<?php
declare(strict_types=1);
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class AdminAuthController extends Controller
{

    private const EXCLUDED_ROLE = 'admin';
    private const TAB_USERS = 'users';
    private const TAB_TRASH = 'trash';
    private const STATUS_ACTIVE = 'active';
    private const STATUS_INACTIVE = 'inactive';
    private const PER_PAGE = 100;

    public function index(Request $request): Response
    {
        $filters = $this->resolveFilters($request);

        $users = $this->buildUsersQuery($filters)
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (User $user): array => $this->transformUser($user));

        $roles = Role::query()
            ->select(['id', 'name'])
            ->where('name', '!=', self::EXCLUDED_ROLE)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/user', [
            'users' => $users,
            'roles' => $roles,
            'stats' => $this->getStats(),
            'filters' => $filters,
        ]);
    }

    private function resolveFilters(Request $request): array
    {
        $tab = $request->string('tab')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        if (! in_array($tab, [self::TAB_USERS, self::TAB_TRASH], true)) {
            $tab = self::TAB_USERS;
        }

        if (! in_array($status, ['', self::STATUS_ACTIVE, self::STATUS_INACTIVE], true)) {
            $status = '';
        }

        return [
            'q' => $request->string('q')->trim()->toString(),
            'role' => $request->string('role')->trim()->toString(),
            'status' => $status,
            'tab' => $tab,
        ];
    }


    private function buildUsersQuery(array $filters): Builder
    {
        $query = $this->baseUsersQuery()
            ->select([
                'id',
                'name',
                'phone',
                'email',
                'is_active',
                'created_at',
                'deleted_at',
            ])
            ->with(['roles:id,name']);

        if ($filters['tab'] === self::TAB_TRASH) {
            $query->onlyTrashed();
        }

        if ($filters['q'] !== '') {
            $this->applySearchFilter($query, $filters['q']);
        }

        if ($filters['role'] !== '') {
            $query->whereHas('roles', function (Builder $roleQuery) use ($filters): void {
                $roleQuery->where('name', $filters['role']);
            });
        }

        if ($filters['tab'] === self::TAB_USERS && $filters['status'] !== '') {
            $this->applyStatusFilter($query, $filters['status']);
        }

        return $query->latest('id');
    }

    /**
     * @return Builder<User>
     */
    private function baseUsersQuery(): Builder
    {
        return User::query()
            ->whereDoesntHave('roles', function (Builder $roleQuery): void {
                $roleQuery->where('name', self::EXCLUDED_ROLE);
            });
    }

    private function applySearchFilter(Builder $query, string $q): void
    {
        $query->where(function (Builder $subQuery) use ($q): void {
            $subQuery
                ->where('name', 'like', '%' . $q . '%')
                ->orWhere('phone', 'like', '%' . $q . '%')
                ->orWhere('email', 'like', '%' . $q . '%');
        });
    }

    private function applyStatusFilter(Builder $query, string $status): void
    {
        if ($status === self::STATUS_ACTIVE) {
            $query->where('is_active', true);
            return;
        }

        if ($status === self::STATUS_INACTIVE) {
            $query->where('is_active', false);
        }
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     phone: string|null,
     *     email: string|null,
     *     is_active: bool,
     *     created_at: string|null,
     *     deleted_at: string|null,
     *     role: string|null
     * }
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
            'email' => $user->email,
            'is_active' => (bool) $user->is_active,
            'created_at' => $user->created_at?->toDateTimeString(),
            'deleted_at' => $user->deleted_at?->toDateTimeString(),
            'role' => $user->roles->first()?->name,
        ];
    }

    /**
     * @return array{
     *     users_count: int,
     *     trash_count: int,
     *     active_count: int,
     *     inactive_count: int
     * }
     */
    private function getStats(): array
    {
        return [
            'users_count' => $this->baseUsersQuery()->count(),
            'trash_count' => $this->baseUsersQuery()->onlyTrashed()->count(),
            'active_count' => $this->baseUsersQuery()->where('is_active', true)->count(),
            'inactive_count' => $this->baseUsersQuery()->where('is_active', false)->count(),
        ];
    }

    public function store(Request $request): RedirectResponse
    {
        $adminRole = config('roles.admin', 'admin');

        $request->merge([
            'name' => trim((string) $request->input('name')),
            'phone' => $this->normalizeBDPhone($request->input('phone')),
            'email' => $request->filled('email')
                ? strtolower(trim((string) $request->input('email')))
                : null,
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone'],
            'email' => ['nullable', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name', 'not_in:' . $adminRole],
            'is_active' => ['required', 'boolean'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX.',
            'role.not_in' => 'Assigning admin role is not allowed.',
        ]);

        try {
            DB::transaction(function () use ($data): void {
                $user = User::create([
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'email' => $data['email'] ?? null,
                    'password' => Hash::make($data['password']),
                    'is_active' => (bool) $data['is_active'],
                ]);

                $user->syncRoles([$data['role']]);
            });

            return back()->with('success', 'User created successfully.');
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors([
                'store' => 'Failed to create user. Please try again.',
            ])->withInput();
        }
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
            'email' => $request->filled('email')
                ? strtolower(trim((string) $request->input('email')))
                : null,
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone,' . $user->id],
            'email' => ['nullable', 'email:rfc,dns', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['required', 'boolean'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX.',
        ]);

        $adminRole = config('roles.admin', 'admin');

        // Existing admin user cannot be modified
        if ($user->hasRole($adminRole)) {
            return back()->withErrors([
                'update' => 'Admin user cannot be modified.',
            ]);
        }

        // No one can be promoted to admin from here
        if ($data['role'] === $adminRole) {
            return back()->withErrors([
                'role' => 'Assigning admin role is not allowed.',
            ]);
        }

        try {
            DB::transaction(function () use ($user, $data): void {
                $user->fill([
                    'name' => trim($data['name']),
                    'phone' => $data['phone'],
                    'email' => $data['email'] ?? null,
                    'is_active' => (bool) $data['is_active'],
                ]);

                if (!empty($data['password'])) {
                    $user->password = Hash::make($data['password']);
                }

                $user->save();
                $user->syncRoles([$data['role']]);
            });

            return back()->with('success', 'User updated successfully.');
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors([
                'update' => 'Failed to update user. Please try again.',
            ])->withInput();
        }
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->hasRole('admin')) {
            return back()->withErrors([
                'delete' => 'Admin cannot be moved to trash.',
            ]);
        }

        if ($user->trashed()) {
            return back()->withErrors([
                'delete' => 'User is already in trash.',
            ]);
        }

        $user->delete();

        return back()->with('success', 'User moved to trash successfully.');
    }

    public function restore(int $id): RedirectResponse
    {
        $user = User::onlyTrashed()->findOrFail($id);

        $user->restore();

        return back()->with('success', 'User restored successfully.');
    }

    public function forceDelete(int $id): RedirectResponse
    {
        $user = User::onlyTrashed()->findOrFail($id);

        if ($user->hasRole('admin')) {
            return back()->withErrors([
                'delete' => 'Admin cannot be permanently deleted.',
            ]);
        }

        if ($user->profile_photo) {
            $this->fileDelete($user->profile_photo);
        }

        $user->forceDelete();

        return back()->with('success', 'User permanently deleted successfully.');
    }

    private function normalizeBDPhone(mixed $value): string
    {
        $phone = preg_replace('/[^\d+]/', '', (string) $value) ?? '';

        if (str_starts_with($phone, '01')) {
            return '+88' . $phone;
        }

        if (str_starts_with($phone, '880')) {
            return '+' . $phone;
        }

        return $phone;
    }
}

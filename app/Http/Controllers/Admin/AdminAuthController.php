<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminAuthController extends Controller
{
    public function index(Request $request)
{
    $q    = $request->string('q')->trim()->toString();
    $role = $request->string('role')->trim()->toString(); // ✅ role filter

    $users = User::query()
        ->select(['id', 'name', 'phone', 'email', 'created_at'])
        ->with(['roles:id,name'])
        ->when($q, function ($query) use ($q) {
            $query->where(function ($qq) use ($q) {
                $qq->where('name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        })
        ->when($role, function ($query) use ($role) {
            // ✅ Filter users by role (Spatie)
            $query->whereHas('roles', function ($rq) use ($role) {
                $rq->where('name', $role);
            });
        })
        ->latest()
        ->paginate(100)
        ->withQueryString()
        ->through(function ($u) {
            return [
                'id'         => $u->id,
                'name'       => $u->name,
                'phone'      => $u->phone,
                'email'      => $u->email,
                'created_at' => $u->created_at,
                'role'       => $u->roles->first()?->name,
            ];
        });

    $roles = Role::query()->orderBy('name')->get(['id', 'name']);

    return Inertia::render('admin/user', [
        'users' => $users,
        'roles' => $roles,
        'filters' => [
            'q'    => $q,
            'role' => $role,
        ],
    ]);
}
    public function store(Request $request)
    {
        // normalize phone (BD)
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        $user->syncRoles([$data['role']]);

        return back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        // normalize phone (BD)
        $request->merge([
            'phone' => $this->normalizeBDPhone($request->input('phone')),
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone,' . $user->id],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ]);

        $user->name = $data['name'];
        $user->phone = $data['phone'];
        $user->email = $data['email'] ?? null;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();
        $user->syncRoles([$data['role']]);

        return back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('super-admin')) {
            return back()->withErrors(['delete' => 'Super admin cannot be deleted']);
        }

        $user->delete();

        return back()->with('success', 'User deleted');
    }

    private function normalizeBDPhone($value): string
    {
        $phone = preg_replace('/[^\d+]/', '', (string) $value);

        // 01XXXXXXXXX -> +8801XXXXXXXXX
        if (str_starts_with($phone, '01')) {
            $phone = '+88' . $phone;
        }

        // 8801XXXXXXXXX -> +8801XXXXXXXXX
        if (str_starts_with($phone, '880')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
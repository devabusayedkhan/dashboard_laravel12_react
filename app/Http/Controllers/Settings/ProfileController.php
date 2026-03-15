<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response |RedirectResponse
    {
        $user = $request->user();
        if (!$user || $user->hasAnyRole(['user'])) {
            return redirect('/profile');
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $data['phone'] = $this->normalizeBDPhone($data['phone'] ?? '');

        $user->fill([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?: null,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('profile_photo')) {
            $this->fileDelete($user->profile_photo);
            $user->profile_photo = $this->fileUpload($request->file('profile_photo'), 'user-profile');
        }

        $user->save();

        return back()->with('status', 'Profile updated successfully.');
    }

    /**
     * Normalize Bangladeshi phone number to +8801XXXXXXXXX format.
     */
    private function normalizeBDPhone(string $value): string
    {
        $phone = preg_replace('/\D+/', '', $value) ?? '';

        if (str_starts_with($phone, '01')) {
            return '+88' . $phone;
        }

        if (str_starts_with($phone, '8801')) {
            return '+' . $phone;
        }

        if (str_starts_with($phone, '880')) {
            return '+' . $phone;
        }

        if (str_starts_with($phone, '1') && strlen($phone) === 10) {
            return '+880' . $phone;
        }

        return str_starts_with($value, '+') ? '+' . ltrim($phone, '+') : $phone;
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user || $user->hasAnyRole(['user'])) {
            return redirect('/profile');
        }
        $user = $request->user();

        Auth::logout();

        $this->fileDelete($user->profile_photo);

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

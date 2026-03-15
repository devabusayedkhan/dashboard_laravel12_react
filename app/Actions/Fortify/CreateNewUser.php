<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        // ✅ normalize phone first
        $phone = preg_replace('/[^\d+]/', '', (string) ($input['phone'] ?? ''));

        // BD normalize:
        // 01XXXXXXXXX -> +8801XXXXXXXXX
        if (str_starts_with($phone, '01')) {
            $phone = '+88' . $phone;
        }

        // 8801XXXXXXXXX -> +8801XXXXXXXXX
        if (str_starts_with($phone, '880')) {
            $phone = '+' . $phone;
        }

        $input['phone'] = $phone;

        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            // optional: BD strict format (+8801 + 9 digits)
            'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone'],
            'password' => $this->passwordRules(),
        ], [
            'phone.regex' => 'Phone number must be in format +8801XXXXXXXXX',
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'phone' => $input['phone'],
            'password' => Hash::make($input['password']),
        ]);

        $user->syncRoles(['user']);
        return $user;
    }
}
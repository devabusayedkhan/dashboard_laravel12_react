<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    public function rules(): array
{
    return [
        'name'  => ['required', 'string', 'max:255'],
        'phone' => ['required', 'regex:/^\+8801\d{9}$/', 'unique:users,phone,' . $this->user()->id],
        'email' => ['nullable', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
    ];
}
}

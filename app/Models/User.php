<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'profile_photo',
        'password',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    protected function phone(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                $value = preg_replace('/[^\d+]/', '', (string) $value);

                // 01XXXXXXXXX -> +8801XXXXXXXXX
                if (str_starts_with($value, '01')) {
                    $value = '+88' . $value;
                }

                // 8801XXXXXXXXX -> +8801XXXXXXXXX
                if (str_starts_with($value, '880')) {
                    $value = '+' . $value;
                }

                return $value;
            }
        );
    }
}
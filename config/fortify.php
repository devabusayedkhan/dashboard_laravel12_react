<?php

use Laravel\Fortify\Features;

return [

    'guard' => 'web',
    'passwords' => 'users',

    'username' => 'phone',

    'email' => 'email',

    'lowercase_usernames' => false,

    'home' => '/dashboard',

    'prefix' => '',
    'domain' => null,

    'middleware' => ['web'],

    'limiters' => [
        'login' => 'login',
        'two-factor' => 'two-factor',
    ],

    'views' => true,

    'features' => [
        Features::registration(),

        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
        ]),
    ],
];
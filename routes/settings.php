<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PhonePasswordResetController;
use App\Http\Controllers\Settings\ContactController;
use App\Http\Controllers\Settings\SettingsController;

// forgot password routes
Route::middleware('guest')->group(function () {
    // ✅ Forgot password (send OTP) - single POST route with throttle + name
    Route::post('/forgot-password', [PhonePasswordResetController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('password.phone');

    // ✅ Forgot password page
    Route::get('/forgot-password', [PhonePasswordResetController::class, 'create'])
        ->name('password.request');

    // ✅ Reset password page
    Route::get('/reset-password', [PhonePasswordResetController::class, 'edit'])
        ->name('password.reset');

    // ✅ Reset password submit
    Route::post('/reset-password', [PhonePasswordResetController::class, 'update'])
        ->middleware('throttle:5,1')
        ->name('password.update');
});

// settings routes
Route::middleware(['auth'])->group(function () {
    // user route
    Route::get('/profile', function () {
        return Inertia::render('user/profile');
    });
    Route::get('settings', function () {
        return Inertia::render('user/settings');
    })->name('settings');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // admin route
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

// site settings routes
Route::middleware(['auth', 'verified', 'permission:manage-site'])->group(function () {
    Route::get('site-settings', [SettingsController::class, 'index'])->name('site-settings');
    Route::post('site-settings', [SettingsController::class, 'update'])->name('site-settings.update');
    // contact routes
    Route::post('/contacts/reorder', [ContactController::class, 'reorder'])->name('contacts.reorder');
    Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');
    Route::post('/contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
});

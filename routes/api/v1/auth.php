<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PhonePasswordResetController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// forgot password routes
Route::middleware('guest')->group(function () {
    Route::post('/forgot-password', [PhonePasswordResetController::class, 'store']);
    Route::post('/verify-reset-otp', [PhonePasswordResetController::class, 'verifyOtp']);
    Route::post('/reset-password', [PhonePasswordResetController::class, 'update']);
});

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

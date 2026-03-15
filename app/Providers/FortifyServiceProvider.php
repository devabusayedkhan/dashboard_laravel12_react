<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
        public function register(): void
    {
        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse {
                public function toResponse($request)
                {
                    return redirect()->back();
                }
            };
        });

        $this->app->singleton(RegisterResponse::class, function () {
            return new class implements RegisterResponse {
                public function toResponse($request)
                {
                    return redirect()->back();
                }
            };
        });
    }

    public function boot(): void
    {
        $this->configureActions();
        $this->configureAuth();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
{
    Fortify::createUsersUsing(CreateNewUser::class);
    Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
}

    /**
     * Phone based authentication (login).
     */
    private function configureAuth(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $phone = preg_replace('/[^\d+]/', '', (string) $request->input('phone'));

            if (str_starts_with($phone, '01')) {
                $phone = '+88' . $phone;
            }

            if (str_starts_with($phone, '880')) {
                $phone = '+' . $phone;
            }

            $user = User::where('phone', $phone)->first();

            if ($user && $user->is_active && Hash::check((string) $request->input('password'), $user->password)) {
                return $user;
            }

            return null;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => false, 
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        // ✅ register page
        // Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            // ✅ phone based throttling
            $phone = (string) $request->input('phone');
            $phone = preg_replace('/[^\d+]/', '', $phone);

            $throttleKey = Str::transliterate($phone . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
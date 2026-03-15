import { router, useForm } from '@inertiajs/react';
import { useCallback } from 'react';
import Swal from 'sweetalert2';

export type LoginFormData = {
    phone: string;
    password: string;
};

export type RegisterFormData = {
    name: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

type UseAuthActionsProps = {
    onLoginSuccess?: () => void;
    onRegisterSuccess?: () => void;
    onLogoutSuccess?: () => void;
};

export function useAuthActions({
    onLoginSuccess,
    onRegisterSuccess,
    onLogoutSuccess,
}: UseAuthActionsProps = {}) {
    const loginForm = useForm<LoginFormData>({
        phone: '',
        password: '',
    });

    const registerForm = useForm<RegisterFormData>({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const login = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();

            loginForm.post('/login', {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    loginForm.reset('phone', 'password');
                    onLoginSuccess?.();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Logged in successfully.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
                onError: (errors) => {
                    const message =
                        errors.phone || errors.password || 'Login failed.';

                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed',
                        text: message,
                        confirmButtonColor: '#f97316',
                    });
                },
            });
        },
        [loginForm, onLoginSuccess],
    );

    const register = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();

            registerForm.post('/register', {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    registerForm.reset(
                        'name',
                        'phone',
                        'password',
                        'password_confirmation',
                    );

                    onRegisterSuccess?.();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Account created successfully.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
                onError: (errors) => {
                    const message =
                        errors.phone ||
                        errors.name ||
                        errors.password ||
                        errors.password_confirmation ||
                        'Registration failed.';

                    Swal.fire({
                        icon: 'error',
                        title: 'Registration failed',
                        text: message,
                        confirmButtonColor: '#f97316',
                    });
                },
            });
        },
        [registerForm, onRegisterSuccess],
    );

    const logout = useCallback(() => {
        router.post(
            '/logout',
            {},
            {
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    onLogoutSuccess?.();

                    Swal.fire({
                        icon: 'success',
                        title: 'Logged out',
                        text: 'You have been logged out successfully.',
                        showConfirmButton: false,
                        timer: 1200,
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout failed',
                        text: 'Something went wrong while logging out.',
                        confirmButtonColor: '#f97316',
                    });
                },
            },
        );
    }, [onLogoutSuccess]);

    return {
        loginForm,
        registerForm,
        login,
        register,
        logout,
    };
}
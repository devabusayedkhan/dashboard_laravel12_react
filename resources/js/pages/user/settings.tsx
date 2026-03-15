import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/public-layout';

type PasswordFormData = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export default function Settings() {
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await Swal.fire({
            icon: 'question',
            title: 'Change password?',
            text: 'Your account password will be updated.',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f97316',
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        form.put(route('user-password.update'), {
            preserveScroll: true,

            onStart: () => {
                void Swal.fire({
                    title: 'Updating password...',
                    text: 'Please wait a moment.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            },

            onSuccess: () => {
                form.reset();

                void Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: 'Your password has been changed successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },

            onError: (errors) => {
                Swal.close();

                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                } else if (errors.password) {
                    passwordInput.current?.focus();
                } else if (errors.password_confirmation) {
                    confirmPasswordInput.current?.focus();
                }

                const firstError =
                    errors.current_password ||
                    errors.password ||
                    errors.password_confirmation ||
                    'Failed to update password. Please try again.';

                void Swal.fire({
                    icon: 'error',
                    title: 'Update failed',
                    text: firstError,
                    confirmButtonColor: '#f97316',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Password settings" />

            <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
                <h1 className="sr-only">Password Settings</h1>

                <div className="skShadow overflow-hidden rounded-xl">
                   
                    <div className="space-y-6 px-6 py-6">
                        <div className="flex items-start gap-3 rounded-xl border bg-orange-50/60 p-4">
                            <div className="mt-0.5 rounded-full bg-orange-100 p-2 text-orange-600">
                                <LockKeyhole className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    Security tip
                                </p>
                                <p className="text-sm text-muted-foreground dark:text-black">
                                    Choose a long password you do not use
                                    anywhere else.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    Current password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type={
                                            showCurrentPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="pr-12"
                                        autoComplete="current-password"
                                        placeholder="Enter current password"
                                        value={form.data.current_password}
                                        onChange={(e) =>
                                            form.setData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                        aria-label={
                                            showCurrentPassword
                                                ? 'Hide current password'
                                                : 'Show current password'
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    className="mt-1"
                                    message={form.errors.current_password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">New password</Label>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="pr-12"
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                        aria-label={
                                            showNewPassword
                                                ? 'Hide new password'
                                                : 'Show new password'
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    className="mt-1"
                                    message={form.errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm new password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        ref={confirmPasswordInput}
                                        name="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="pr-12"
                                        autoComplete="new-password"
                                        placeholder="Re-enter new password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Hide confirm password'
                                                : 'Show confirm password'
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    className="mt-1"
                                    message={form.errors.password_confirmation}
                                />
                            </div>

                            <p className="text-xs text-red-600">
                                Make sure your new password is easy for you to
                                remember but hard for others to guess.
                            </p>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                data-test="update-password-button"
                                className="w-full font-bold text-orange-600"
                            >
                                {form.processing
                                    ? 'Updating...'
                                    : 'Change password'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

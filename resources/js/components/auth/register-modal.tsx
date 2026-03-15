import type { InertiaFormProps } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/helper/Model';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type RegisterFormData = {
    name: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    form: InertiaFormProps<RegisterFormData>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function RegisterModal({
    isOpen,
    onClose,
    onSwitchToLogin,
    form,
    onSubmit,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register for an account"
            width="w-[90%] sm:w-[60%] md:w-[40%] xl:w-[35%] 2xl:w-[30%]"
        >
            <hr className="mb-2 border-gray-500" />

            <form
                onSubmit={onSubmit}
                className="skShadow flex flex-col gap-3 rounded-lg p-3 lg:gap-6 lg:p-6"
            >
                <div className="grid gap-3 lg:gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            autoFocus
                            autoComplete="name"
                            name="name"
                            placeholder="Full name"
                            className="border-orange-500"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        <InputError
                            message={form.errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>

                        <div className="relative">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                +880
                            </div>

                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                inputMode="tel"
                                required
                                autoComplete="tel"
                                placeholder="1XXXXXXXXX"
                                className="border-orange-500 pl-14"
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData('phone', e.target.value)
                                }
                            />

                            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                                BD
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Format:{' '}
                            <span className="font-medium">+8801XXXXXXXXX</span>
                        </p>

                        <InputError message={form.errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                className="border-orange-500"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                            />
                            <InputError message={form.errors.password} />

                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                autoComplete="new-password"
                                name="password_confirmation"
                                placeholder="Confirm password"
                                className="border-orange-500"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={form.errors.password_confirmation}
                            />
                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="flex w-full items-center justify-center gap-1 rounded-md px-4 py-2 font-bold"
                    >
                        Create account
                        {form.processing && <Spinner />}
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                        type="button"
                        className="cursor-pointer text-orange-500"
                        onClick={onSwitchToLogin}
                    >
                        Log in
                    </button>
                </div>
            </form>
        </Modal>
    );
}

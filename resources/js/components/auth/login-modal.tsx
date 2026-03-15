import type { InertiaFormProps } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/helper/Model';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import ForgotModal from './forgot-pass-modal';
import ResetPasswordModal from './reset-password';

type LoginFormData = {
    phone: string;
    password: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    form: InertiaFormProps<LoginFormData>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function LoginModal({
    isOpen,
    onClose,
    onSwitchToRegister,
    form,
    onSubmit,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const [resetOpen, setResetOpen] = useState(false);
    const [resetPhone, setResetPhone] = useState('');
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Login to your account"
            width="w-[90%] sm:w-[60%] md:w-[40%] xl:w-[35%] 2xl:w-[30%]"
        >
            <hr className="mb-2 border-gray-500" />

            <form
                onSubmit={onSubmit}
                className="skShadow flex flex-col gap-3 rounded-lg p-3 lg:gap-6 lg:p-6"
            >
                <div className="grid gap-3 lg:gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="login_phone">Phone Number</Label>

                        <div className="relative">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                +880
                            </div>

                            <Input
                                id="login_phone"
                                type="tel"
                                name="phone"
                                inputMode="tel"
                                required
                                autoFocus
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

                        <InputError message={form.errors.phone} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>

                            <span
                                 onClick={() => setIsForgotOpen(true)}
                                className="ml-auto text-sm cursor-pointer hover:underline"
                                tabIndex={5}
                            >
                                Forgot password?
                            </span>
                        </div>

                        <div className="relative">
                            <Input
                                id="login_password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoComplete="current-password"
                                name="password"
                                placeholder="Password"
                                className="border-orange-500 pr-10"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                            />

                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
                            </button>
                        </div>

                        <InputError message={form.errors.password} />
                    </div>

                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="flex w-full items-center justify-center gap-1 rounded-md px-4 py-2 font-bold"
                    >
                        Log in
                        {form.processing && <Spinner />}
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        className="cursor-pointer text-orange-500"
                        onClick={onSwitchToRegister}
                    >
                        Sign Up
                    </button>
                </div>
            </form>

            <ForgotModal
                isOpen={isForgotOpen}
                onClose={() => setIsForgotOpen(false)}
                onOtpSent={(phone) => {
                    setIsForgotOpen(false);
                    setResetPhone(phone);
                    setResetOpen(true);
                }}
            />
            <ResetPasswordModal
                isOpen={resetOpen}
                onClose={() => setResetOpen(false)}
                phone={resetPhone}
            />
        </Modal>
    );
}

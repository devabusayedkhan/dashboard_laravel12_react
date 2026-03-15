import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/components/helper/Model';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type LoginFormData = {
    phone: string;
    password: string;
};

type Props = {
    buttonText?: string;
    buttonClassName?: string;
};

export default function Login({
    buttonText = 'Log in',
    buttonClassName = 'rounded-xl px-4 py-2 text-sm font-bold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10',
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<LoginFormData>({
        phone: '',
        password: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post('/login', {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                form.reset('phone', 'password');
                setOpen(false);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Logged in successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: errors.phone || errors.password || 'Login failed',
                    confirmButtonColor: '#f97316',
                });
            },
        });
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                className={buttonClassName}
            >
                {buttonText}
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Login to your account"
                width="w-[90%] sm:w-[60%] md:w-[40%] xl:w-[35%] 2xl:w-[30%]"
            >
                <form onSubmit={submit} className="flex flex-col gap-4 p-4">
                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={form.data.phone}
                            onChange={(e) =>
                                form.setData('phone', e.target.value)
                            }
                        />
                        <InputError message={form.errors.phone} />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <Button type="submit" disabled={form.processing}>
                        Login {form.processing && <Spinner />}
                    </Button>
                </form>
            </Modal>
        </>
    );
}
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
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
    buttonText?: string;
    buttonClassName?: string;
};

export default function Register({
    buttonText = 'Sign Up',
    buttonClassName = 'rounded-xl border border-red-500 bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-600',
}: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<RegisterFormData>({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post('/register', {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Account created successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text:
                        errors.phone ||
                        errors.name ||
                        errors.password ||
                        'Registration failed',
                    confirmButtonColor: '#f97316',
                });
            },
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={buttonClassName}
            >
                {buttonText}
            </button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Register for an account"
                width="w-[90%] sm:w-[60%] md:w-[40%] xl:w-[35%] 2xl:w-[30%]"
            >
                <form onSubmit={submit} className="flex flex-col gap-4 p-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        <InputError message={form.errors.name} />
                    </div>

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

                    <div>
                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
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
                    </div>

                    <Button type="submit" disabled={form.processing}>
                        Register {form.processing && <Spinner />}
                    </Button>
                </form>
            </Modal>
        </>
    );
}
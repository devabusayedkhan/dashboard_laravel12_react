import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profile settings', href: edit().url },
];

type ProfileFormData = {
    name: string;
    phone: string;
    email: string;
    profile_photo: File | null;
};

export default function Profile({ status }: { status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const form = useForm<ProfileFormData>({
        name: auth.user.name ?? '',
        phone: auth.user.phone ?? '',
        email: auth.user.email ?? '',
        profile_photo: null,
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await Swal.fire({
            icon: 'question',
            title: 'Save changes?',
            text: 'Your profile information will be updated.',
            showCancelButton: true,
            confirmButtonText: 'Yes, save',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f97316', // orange-ish
        });

        if (!res.isConfirmed) return;

        form.patch(route('profile.update'), {
            preserveScroll: true,

            onStart: () => {
                Swal.fire({
                    title: 'Saving...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });
            },

            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Saved',
                    showConfirmButton: false,
                    timer: 1200,
                });
            },

            onError: (errors: Record<string, string>) => {
                Swal.close();

                const firstKey = Object.keys(errors)[0];
                const firstMsg = firstKey
                    ? (errors[firstKey] ?? 'Update failed')
                    : 'Update failed';

                Swal.fire({
                    icon: 'error',
                    title: 'Update failed',
                    text: firstMsg,
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name, phone and (optional) email address"
                    />

                    {status && (
                        <div className="text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-3">
                            <Label htmlFor="profile_photo">Profile photo</Label>

                            <div className="flex items-center gap-4">
                                {/* Avatar preview */}
                                <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
                                    {form.data.profile_photo ? (
                                        <img
                                            src={URL.createObjectURL(
                                                form.data.profile_photo,
                                            )}
                                            className="h-full w-full object-cover"
                                            alt="Preview"
                                        />
                                    ) : auth.user.profile_photo ? (
                                        <img
                                            src={`/${auth.user.profile_photo}`}
                                            className="h-full w-full object-cover"
                                            alt="Profile"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                            No Photo
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="profile_photo"
                                        className="cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    >
                                        Change photo
                                    </label>

                                    <input
                                        id="profile_photo"
                                        type="file"
                                        name="profile_photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            form.setData(
                                                'profile_photo',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />

                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG or WEBP. Max 2MB.
                                    </p>
                                </div>
                            </div>

                            <InputError
                                className="mt-1"
                                message={form.errors.profile_photo}
                            />
                        </div>
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError
                                className="mt-2"
                                message={form.errors.name}
                            />
                        </div>

                        {/* Phone (editable) */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>

                            <div className="relative">
                                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                    +880
                                </div>

                                <Input
                                    id="phone"
                                    type="tel"
                                    inputMode="tel"
                                    className="mt-1 block w-full pl-14"
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData(
                                            'phone',
                                            normalizeBDPhone(e.target.value),
                                        )
                                    }
                                    onBlur={() =>
                                        form.setData(
                                            'phone',
                                            normalizeBDPhone(form.data.phone),
                                        )
                                    }
                                    name="phone"
                                    required
                                    autoComplete="tel"
                                    placeholder="1XXXXXXXXX"
                                />

                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                                    BD
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Format:{' '}
                                <span className="font-medium">
                                    +8801XXXXXXXXX
                                </span>
                            </p>

                            <InputError
                                className="mt-2"
                                message={form.errors.phone}
                            />
                        </div>

                        {/* Email optional */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email address (optional)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                name="email"
                                autoComplete="email"
                                placeholder="Email address"
                            />
                            <InputError
                                className="mt-2"
                                message={form.errors.email}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={form.processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

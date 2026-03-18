import { router, useForm } from '@inertiajs/react';
import {
    Link as LinkIcon,
    GripVertical,
    Pencil,
    Upload,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SiteContactItem } from '@/types';
import Modal from '../helper/Model';

function InputError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-500">{message}</p>;
}

function SiteContacts({
    item,
    draggable = false,
    onDragStart,
    onDragOver,
    onDrop,
}: {
    item: SiteContactItem;
    draggable?: boolean;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        item.photo ?? null,
    );

    const form = useForm({
        name: item.name ?? '',
        icon: item.icon ?? '',
        color: item.color ?? '',
        photo: null as File | null,
        url: item.url ?? '',
        order: item.order ?? 0,
        status: item.status,
    });

    useEffect(() => {
        form.setData({
            name: item.name ?? '',
            icon: item.icon ?? '',
            color: item.color ?? '',
            photo: null,
            url: item.url ?? '',
            order: item.order ?? 0,
            status: item.status,
        });
    }, [item]);

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const openModal = () => {
        setPhotoPreview(item.photo ?? null);
        form.setData({
            name: item.name ?? '',
            icon: item.icon ?? '',
            color: item.color ?? '',
            photo: null,
            url: item.url ?? '',
            order: item.order ?? 0,
            status: item.status,
        });
        setPhotoPreview(item.photo ?? null);
        setIsOpen(true);
    };

    const closeModal = () => {
        form.clearErrors();
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.transform((data) => {
            if (!data.photo) {
                return {
                    name: data.name,
                    icon: data.icon,
                    color: data.color,
                    url: data.url,
                    order: data.order,
                    status: data.status,
                };
            }

            return data;
        });

        form.post(route('contacts.update', item.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.transform((data) => data);
                setIsOpen(false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Settings updated successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
            },
            onError: (errors) => {
                form.transform((data) => data);
                const firstError = Object.values(errors)[0];
                Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    const statusClasses = item.status
        ? 'border-green-500/40 bg-green-500/[0.03]'
        : 'border-red-500/40 bg-red-500/[0.03]';

    const handleContactDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete permission: ${item.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        router.delete(route('contacts.destroy', item.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <div
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border p-4 transition ${statusClasses}`}
            >
                <div className="col-span-12 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">
                            {item.order}
                        </span>
                    </div>
                </div>

                <div className="">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-background"
                        >
                            {item.photo ? (
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    className="h-6 w-6 object-contain"
                                />
                            ) : item.icon ? (
                                <i className={`${item.icon} `} style={
                                item.color
                                    ? {
                                          color: `${item.color}`,
                                      }
                                    : undefined
                            }/>
                            ) : (
                                <LinkIcon className="h-4 w-4" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {item.url.length > 23
                            ? item.url.slice(0, 23) + '...'
                            : item.url}
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={openModal}
                    className="absolute top-0 right-4"
                >
                    <Pencil className="h-6 w-4 text-orange-500" />
                </Button>

                <Button
                    type="button"
                    onClick={handleContactDelete}
                    className="absolute right-4 bottom-0"
                >
                    <Trash2 className="h-6 w-4 text-red-500" />
                </Button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title={`Edit ${item.name}`}
                width="w-full max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${item.id}`}>Name</Label>
                            <Input
                                id={`name-${item.id}`}
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Facebook / WhatsApp / Email"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`icon-${item.id}`}>Icon</Label>
                            <Input
                                id={`icon-${item.id}`}
                                value={form.data.icon}
                                onChange={(e) =>
                                    form.setData('icon', e.target.value)
                                }
                                placeholder="fa-brands fa-facebook"
                            />
                            <InputError message={form.errors.icon} />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`url-${item.id}`}>URL</Label>
                            <Input
                                id={`url-${item.id}`}
                                value={form.data.url}
                                onChange={(e) =>
                                    form.setData('url', e.target.value)
                                }
                                placeholder="https://facebook.com/your-page"
                            />
                            <InputError message={form.errors.url} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`order-${item.id}`}>Order</Label>
                            <Input
                                id={`order-${item.id}`}
                                type="number"
                                min="0"
                                value={form.data.order}
                                onChange={(e) =>
                                    form.setData(
                                        'order',
                                        Number(e.target.value),
                                    )
                                }
                                placeholder="1"
                            />
                            <InputError message={form.errors.order} />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`color-${item.id}`}>Color</Label>
                            <Input
                                id={`color-${item.id}`}
                                value={form.data.color}
                                onChange={(e) =>
                                    form.setData('color', e.target.value)
                                }
                                placeholder="#1877F2"
                            />
                            <InputError message={form.errors.color} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`status-${item.id}`}>Status</Label>
                            <select
                                id={`status-${item.id}`}
                                value={form.data.status ? '1' : '0'}
                                onChange={(e) =>
                                    form.setData(
                                        'status',
                                        e.target.value === '1',
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <InputError message={form.errors.status} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label
                            htmlFor={`photo-${item.id}`}
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Photo
                        </Label>

                        <Input
                            id={`photo-${item.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                form.setData('photo', file);

                                if (
                                    photoPreview &&
                                    photoPreview.startsWith('blob:')
                                ) {
                                    URL.revokeObjectURL(photoPreview);
                                }

                                if (file) {
                                    setPhotoPreview(URL.createObjectURL(file));
                                } else {
                                    setPhotoPreview(item.photo ?? null);
                                }
                            }}
                        />

                        <InputError message={form.errors.photo} />

                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <p className="mb-3 text-sm font-medium">Preview</p>
                            <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed bg-background p-3">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt={form.data.name}
                                        className="max-h-20 object-contain"
                                    />
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        No image selected
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="w-full font-bold text-orange-500"
                        >
                            {form.processing ? 'Updating...' : 'Update Contact'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default SiteContacts;

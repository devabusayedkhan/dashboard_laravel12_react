import { useForm } from '@inertiajs/react';
import { Plus, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '../helper/Model';

function InputError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-500">{message}</p>;
}

export default function CreateSiteContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm({
        name: '',
        icon: '',
        color: '',
        photo: null as File | null,
        url: '',
        order: 0,
        status: true,
    });

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const openModal = () => {
        form.reset();
        form.clearErrors();
        form.setData({
            name: '',
            icon: '',
            color: '',
            photo: null,
            url: '',
            order: 0,
            status: true,
        });
        setPhotoPreview(null);
        setIsOpen(true);
    };

    const closeModal = () => {
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhotoPreview(null);
        form.clearErrors();
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route('contacts.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <>
            <Button type="button" onClick={openModal} className="w-full font-bold text-orange-500 m-0">
                <Plus className="mr-2 h-4 w-4 inline-block" /> Add New Contact
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title="Add New Contact"
                width="w-full max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                                id="contact-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Facebook / WhatsApp / Email"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-icon">Icon</Label>
                            <Input
                                id="contact-icon"
                                value={form.data.icon}
                                onChange={(e) => form.setData('icon', e.target.value)}
                                placeholder="fa-brands fa-facebook"
                            />
                            <InputError message={form.errors.icon} />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contact-url">URL</Label>
                            <Input
                                id="contact-url"
                                value={form.data.url}
                                onChange={(e) => form.setData('url', e.target.value)}
                                placeholder="https://facebook.com/your-page"
                            />
                            <InputError message={form.errors.url} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-order">Order</Label>
                            <Input
                                id="contact-order"
                                type="number"
                                min="0"
                                value={form.data.order}
                                onChange={(e) =>
                                    form.setData('order', Number(e.target.value))
                                }
                                placeholder="0"
                            />
                            <InputError message={form.errors.order} />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contact-color">Color</Label>
                            <Input
                                id="contact-color"
                                value={form.data.color}
                                onChange={(e) => form.setData('color', e.target.value)}
                                placeholder="#1877F2"
                            />
                            <InputError message={form.errors.color} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-status">Status</Label>
                            <select
                                id="contact-status"
                                value={form.data.status ? '1' : '0'}
                                onChange={(e) =>
                                    form.setData('status', e.target.value === '1')
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
                        <Label htmlFor="contact-photo" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Photo
                        </Label>

                        <Input
                            id="contact-photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                form.setData('photo', file);

                                if (photoPreview && photoPreview.startsWith('blob:')) {
                                    URL.revokeObjectURL(photoPreview);
                                }

                                if (file) {
                                    setPhotoPreview(URL.createObjectURL(file));
                                } else {
                                    setPhotoPreview(null);
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
                                        alt={form.data.name || 'Preview'}
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
                            {form.processing ? 'Creating...' : 'Create Contact'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
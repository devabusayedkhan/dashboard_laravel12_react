import { router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import type { SiteContactItem } from '@/types';
import SiteContacts from './site-contacts';

export default function SiteContactsList({
    items,
}: {
    items: SiteContactItem[];
}) {
    const [contacts, setContacts] = useState<SiteContactItem[]>(() =>
        [...items].sort((a, b) => a.order - b.order),
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null) return;
        if (draggedIndex === dropIndex) return;

        const updatedContacts = [...contacts];
        const draggedItem = updatedContacts[draggedIndex];

        updatedContacts.splice(draggedIndex, 1);
        updatedContacts.splice(dropIndex, 0, draggedItem);

        const reorderedContacts = updatedContacts.map((contact, index) => ({
            ...contact,
            order: index + 1,
        }));

        setContacts(reorderedContacts);
        setDraggedIndex(null);
        router.post(
            route('contacts.reorder'),
            {
                contacts: reorderedContacts.map((contact) => ({
                    id: contact.id,
                    order: contact.order,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Contact order updated successfully',
                        showConfirmButton: false,
                        timer: 1200,
                    });
                },
                onError: (errors) => {
                    const firstError =
                        Object.values(errors)[0] ||
                        'Failed to reorder contacts';

                    Swal.fire({
                        icon: 'error',
                        text: String(firstError),
                    });
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            {contacts.map((item, index) => (
                <SiteContacts
                    key={item.id}
                    item={item}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                />
            ))}
        </div>
    );
}

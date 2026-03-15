import { Link, usePage } from '@inertiajs/react';
import { House, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import MacModal from './helper/MacModel';

type ApiUser = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    profile_photo?: string | null;
};

type Props = {
    apiUser?: ApiUser | null;
};

type ButtonRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export default function MobileBottomNav({ apiUser = null }: Props) {
    const page = usePage<SharedData>();

    const [accountOpen, setAccountOpen] = useState(false);
    const [buttonRect, setButtonRect] = useState<ButtonRect | null>(null);
    const accountButtonRef = useRef<HTMLButtonElement | null>(null);

    let currentPath = page.url.split('?')[0];
    if (!currentPath) currentPath = '/';
    currentPath = currentPath.replace(/\/$/, '') || '/';

    const items = [
        {
            title: 'Home',
            href: '/',
            icon: House,
        },
        {
            title: 'Categories',
            href: '/categories',
            icon: LayoutGrid,
        },
        {
            title: 'Cart',
            href: '/cart',
            icon: ShoppingCart,
        },
        {
            title: apiUser ? 'Account' : 'Account',
            href: '__account__',
            icon: User,
        },
    ];

    const updateButtonRect = () => {
        if (!accountButtonRef.current) return;

        const rect = accountButtonRef.current.getBoundingClientRect();

        setButtonRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
        });
    };

    useEffect(() => {
        if (!accountOpen) return;

        updateButtonRect();

        const onResize = () => updateButtonRect();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [accountOpen]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAccountOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#111315] lg:hidden">
                <div className="grid h-16 grid-cols-4">
                    {items.map((item) => {
                        const isActive =
                            item.href !== '__account__' &&
                            (currentPath === item.href ||
                                (item.href !== '/' &&
                                    currentPath.startsWith(item.href)));

                        const Icon = item.icon;

                        if (item.href === '__account__') {
                            return (
                                <button
                                    key={item.title}
                                    ref={accountButtonRef}
                                    type="button"
                                    onClick={() => {
                                        updateButtonRect();
                                        setAccountOpen(true);
                                    }}
                                    className={cn(
                                        'relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition',
                                        accountOpen
                                            ? 'text-orange-500'
                                            : 'text-black/70 dark:text-white/70',
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.title}</span>

                                    {accountOpen && (
                                        <span className="absolute bottom-0 h-1 w-10 rounded-t-full bg-orange-500" />
                                    )}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition',
                                    isActive
                                        ? 'text-orange-500'
                                        : 'text-black/70 dark:text-white/70',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.title}</span>

                                {isActive && (
                                    <span className="absolute bottom-0 h-1 w-10 rounded-t-full bg-orange-500" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <MacModal
                open={accountOpen}
                onClose={() => setAccountOpen(false)}
                apiUser={apiUser}
                buttonRect={buttonRect}
            />
        </>
    );
}
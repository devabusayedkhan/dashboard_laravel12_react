import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import AppearanceTabs from '@/components/appearance-tabs';
import LoginModal from '@/components/auth/login-modal';
import RegisterModal from '@/components/auth/register-modal';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { useAuthModals } from '@/hooks/use-auth-modals';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';
import Asset from './helper/Asset';
import MobileBottomNav from './mobile-menu';
import { Button } from './ui/button';
import { Icon } from './ui/icon';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: Asset('/'),
        icon: LayoutGrid,
    },
];

const activeItemStyles =
    'text-neutral-900 activeSkBtnShadow dark:text-neutral-100';

const DesktopGuestActions = memo(function DesktopGuestActions({
    onLogin,
    onRegister,
}: {
    onLogin: () => void;
    onRegister: () => void;
}) {
    return (
        <div className="ml-2 hidden items-center gap-2 lg:flex">
            <Button
                type="button"
                onClick={onLogin}
                className="rounded-xl px-4 py-2 text-sm font-bold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
            >
                Log in
            </Button>

            <button
                type="button"
                onClick={onRegister}
                className="rounded-xl border border-red-500 bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
            >
                Sign Up
            </button>
        </div>
    );
});

export const AppHeader = memo(function AppHeader({
    breadcrumbs = [],
}: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const [openUserMenu, setOpenUserMenu] = useState(false);

    const {
        loginModal,
        registerModal,
        openLoginModal,
        closeLoginModal,
        openRegisterModal,
        closeRegisterModal,
        switchToLogin,
        switchToRegister,
        closeAllAuthModals,
    } = useAuthModals();

    const { loginForm, registerForm, login, register, logout } = useAuthActions({
        onLoginSuccess: closeAllAuthModals,
        onRegisterSuccess: closeAllAuthModals,
        onLogoutSuccess: () => setOpenUserMenu(false),
    });

    const currentUser = auth.user ?? null;

    const userInitials = useMemo(() => {
        const n = currentUser?.name?.trim() || 'User';
        const parts = n.split(' ').filter(Boolean);
        const a = parts[0]?.[0] ?? 'U';
        const b = parts[1]?.[0] ?? '';
        return (a + b).toUpperCase();
    }, [currentUser?.name]);

    const currentPath = useMemo(() => {
        let path = page.url.split('?')[0];
        if (!path) path = '/';
        return path.replace(/\/$/, '') || '/';
    }, [page.url]);

    return (
        <>
            <div className="sticky top-0 z-50 border-b-2 bg-[#f3f4f6] dark:bg-[#1e2124]">
                <div className="mx-auto flex h-auto items-center justify-between px-4 md:max-w-7xl lg:h-20">
                    <AppLogo />

                    <div className="hidden h-full grow flex-col items-center lg:flex">
                        <NavigationMenu className="flex h-full w-full items-stretch">
                            <NavigationMenuList className="flex h-full items-center space-x-2">
                                {mainNavItems.map((item, index) => {
                                    const itemHref =
                                        typeof item.href === 'string'
                                            ? item.href
                                            : item.href?.url;

                                    const isActive = currentPath === itemHref;

                                    return (
                                        <NavigationMenuItem
                                            key={index}
                                            className="relative flex h-full items-center"
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    isActive && activeItemStyles,
                                                    'skBtnShadow h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <Icon
                                                        iconNode={item.icon}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                )}
                                                {item.title}
                                            </Link>

                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-orange-500" />
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <AppearanceTabs />

                        <div className="hidden lg:block">
                            {currentUser ? (
                                <div className="relative ml-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenUserMenu((prev) => !prev)
                                        }
                                        className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                    >
                                        {currentUser.profile_photo ? (
                                            <img
                                                src={currentUser.profile_photo}
                                                alt="avatar"
                                                className="h-9 w-9 rounded-2xl object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-black/5 text-xs font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                                                {userInitials}
                                            </div>
                                        )}

                                        <div className="hidden text-left lg:block">
                                            <p className="text-sm leading-tight font-semibold">
                                                {currentUser.name ?? 'Account'}
                                            </p>
                                            <p className="text-xs text-black/60 dark:text-white/60">
                                                My account
                                            </p>
                                        </div>

                                        <span
                                            className={cn(
                                                'hidden text-2xl text-black/60 transition-transform lg:inline dark:text-white/60',
                                                openUserMenu && 'rotate-180',
                                            )}
                                        >
                                            ▾
                                        </span>
                                    </button>

                                    {openUserMenu && (
                                        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#0f0f10]">
                                            <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
                                                <p className="text-sm font-semibold">
                                                    {currentUser.name ?? 'User'}
                                                </p>
                                                <p className="text-xs text-black/60 dark:text-white/60">
                                                    {currentUser.email ?? ''}
                                                </p>
                                            </div>

                                            <div className="p-2">
                                                {auth.permissions?.includes?.(
                                                    'admin.dashboard',
                                                ) && (
                                                    <Link
                                                        href={dashboard()}
                                                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                    >
                                                        <span>Dashboard</span>
                                                        <span className="text-xs text-black/50 dark:text-white/50">
                                                            →
                                                        </span>
                                                    </Link>
                                                )}

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                >
                                                    <span>Profile</span>
                                                    <span className="text-xs text-black/50 dark:text-white/50">
                                                        →
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/orders"
                                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                >
                                                    <span>Orders</span>
                                                    <span className="text-xs text-black/50 dark:text-white/50">
                                                        →
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/cart"
                                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                >
                                                    <span>Cart</span>
                                                    <span className="text-xs text-black/50 dark:text-white/50">
                                                        →
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/wishlist"
                                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                >
                                                    <span>Wishlist</span>
                                                    <span className="text-xs text-black/50 dark:text-white/50">
                                                        →
                                                    </span>
                                                </Link>

                                                <Link
                                                    href="/settings"
                                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                                                >
                                                    <span>Settings</span>
                                                    <span className="text-xs text-black/50 dark:text-white/50">
                                                        →
                                                    </span>
                                                </Link>

                                                <div className="my-2 h-px bg-black/10 dark:bg-white/10" />

                                                <button
                                                    type="button"
                                                    onClick={logout}
                                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-white/10"
                                                >
                                                    <span>Logout</span>
                                                    <span className="text-xs">
                                                        ⎋
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <DesktopGuestActions
                                    onLogin={openLoginModal}
                                    onRegister={openRegisterModal}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <LoginModal
                    isOpen={loginModal}
                    onClose={closeLoginModal}
                    onSwitchToRegister={switchToRegister}
                    form={loginForm}
                    onSubmit={login}
                />

                <RegisterModal
                    isOpen={registerModal}
                    onClose={closeRegisterModal}
                    onSwitchToLogin={switchToLogin}
                    form={registerForm}
                    onSubmit={register}
                />
            </div>

            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <MobileBottomNav apiUser={auth.user ?? null} />
        </>
    );
});
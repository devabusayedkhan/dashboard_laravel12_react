import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronRight,
    LogIn,
    LogOut,
    Package,
    Settings,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import logOut from './LogOut';

type ApiUser = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    profile_photo?: string | null;
};

type ButtonRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    apiUser?: ApiUser | null;
    buttonRect: ButtonRect | null;
};

export default function MacModal({
    open,
    onClose,
    apiUser = null,
    buttonRect,
}: Props) {
    const modalWidth = 340;
    const modalHeight = 370;

    const finalLeft =
        typeof window !== 'undefined'
            ? Math.max(16, window.innerWidth - modalWidth - 16)
            : 16;

    const finalBottom = 90;

    const startX = buttonRect
        ? buttonRect.left + buttonRect.width / 2 - (finalLeft + modalWidth / 2)
        : 0;

    const startY = buttonRect
        ? buttonRect.top +
          buttonRect.height / 2 -
          (finalBottom + modalHeight / 2)
        : 60;

    const handleLogout = () => {
        onClose();
        logOut();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close modal overlay"
                        onClick={onClose}
                        className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.16,
                            x: startX,
                            y: startY,
                            rotate: -6,
                            filter: 'blur(8px)',
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            filter: 'blur(0px)',
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.18,
                            x: startX,
                            y: startY,
                            rotate: -4,
                            filter: 'blur(6px)',
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 24,
                            mass: 0.85,
                        }}
                        style={{
                            width: modalWidth,
                            bottom: finalBottom,
                            left: finalLeft,
                            transformOrigin: '85% 100%',
                        }}
                        className="fixed z-[80] lg:hidden"
                    >
                        <div className="relative">
                            {/* Top tab */}
                            <div className="absolute top-[-14px] right-8 h-8 w-36 rounded-t-[28px] bg-[#ffffff] dark:bg-[#000000] shadow-[0_-2px_0_0_rgba(0,0,0,0.85)]" />

                            {/* Main box */}
                            <div className="relative overflow-visible rounded-[30px] bg-[#ffffff] dark:bg-[#000000] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                                {/* Black inner border */}
                                <div className="pointer-events-none absolute inset-[10px] rounded-[24px] border-[4px] border-black dark:border-white" />

                                <div className="relative z-10 min-h-[330px] px-3 pt-7 pb-3">
                                    <div className="mb-5 flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold tracking-[0.22em] text-black/60 dark:text-white uppercase">
                                                Account
                                            </p>
                                            <h3 className="mt-1 text-2xl font-black tracking-tight text-black dark:text-white">
                                                {apiUser
                                                    ? 'Your Space'
                                                    : 'Welcome Back'}
                                            </h3>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white/40 text-black dark:text-white transition hover:scale-105"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {apiUser ? (
                                        <>
                                            <div className="mb-5 rounded-[22px] border-2 border-black dark:border-white bg-white/30 p-2 dark:text-white text-black backdrop-blur-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-black bg-white/60">
                                                        {apiUser.profile_photo ? (
                                                            <img
                                                                src={apiUser.profile_photo}
                                                                className="h-full w-full object-cover"
                                                                alt="Preview"
                                                            />
                                                        ) : apiUser.profile_photo ? (
                                                            <img
                                                                src={`/${apiUser.profile_photo}`}
                                                                className="h-full w-full object-cover"
                                                                alt="Profile"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                                No Photo
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-extrabold">
                                                            {apiUser.name}
                                                        </p>
                                                        <p className="truncate text-sm text-black/65 dark:text-white">
                                                            {apiUser.email ||
                                                                apiUser.phone ||
                                                                'Signed in user'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <QuickLink
                                                    href="/profile"
                                                    icon={
                                                        <User className="h-5 w-5" />
                                                    }
                                                    label="My Profile"
                                                />
                                                <QuickLink
                                                    href="/orders"
                                                    icon={
                                                        <Package className="h-5 w-5" />
                                                    }
                                                    label="My Orders"
                                                />
                                                <QuickLink
                                                    href="/cart"
                                                    icon={
                                                        <ShoppingBag className="h-5 w-5" />
                                                    }
                                                    label="My Cart"
                                                />
                                                <QuickLink
                                                    href="/settings"
                                                    icon={
                                                        <Settings className="h-5 w-5" />
                                                    }
                                                    label="Settings"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center justify-between rounded-[18px] border-2 border-black dark:border-white bg-orange-600 px-4 py-3 text-white transition hover:translate-x-1 hover:bg-white/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black/50">
                                                            <LogOut className="h-5 w-5" />
                                                        </span>
                                                        <span className="text-sm font-bold">
                                                            Logout
                                                        </span>
                                                    </div>

                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-5 rounded-[22px] border-2 border-black dark:bg-white/20 dark:border-white bg-white/30 p-4 dark:text-white text-black">
                                                <p className="text-sm leading-6 text-black/75 dark:text-white">
                                                    Login করলে তুমি order track,
                                                    cart save, profile manage —
                                                    সবকিছু এক জায়গা থেকে করতে
                                                    পারবে।
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onClose();
                                                    window.dispatchEvent(
                                                        new CustomEvent(
                                                            'open-login-modal',
                                                        ),
                                                    );
                                                }}
                                                className="flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-black dark:border-white bg-black dark:bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
                                            >
                                                <LogIn className="h-4 w-4" />
                                                Login / Sign Up
                                            </button>

                                            <div className="mt-4 space-y-3">
                                                <QuickLink
                                                    href="/cart"
                                                    icon={
                                                        <ShoppingBag className="h-5 w-5" />
                                                    }
                                                    label="Go to Cart"
                                                />
                                                <QuickLink
                                                    href="/categories"
                                                    icon={
                                                        <Package className="h-5 w-5" />
                                                    }
                                                    label="Browse Categories"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function QuickLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-[18px] border-2  bg-white/35 dark:bg-black px-4 py-3 text-black dark:text-white transition hover:translate-x-1 hover:bg-white/50"
        >
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black dark:border-white bg-white/50">
                    {icon}
                </span>
                <span className="text-sm font-bold">{label}</span>
            </div>

            <ChevronRight className="h-4 w-4" />
        </Link>
    );
}

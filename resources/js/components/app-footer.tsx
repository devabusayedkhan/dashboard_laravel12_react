import { usePage } from '@inertiajs/react';
import SkSocial from './helper/SkSocial';

export function AppFooter() {
    const { settings } = usePage<{
        settings: { copyright: string; contact: [] };
    }>().props;

    return (
        <footer className="border-t-2 py-4 bg-[#d3d3d36a]">
            <div className="mx-auto flex flex-col items-center justify-between px-4 md:max-w-7xl lg:flex-row">
                {/* Left side */}
                <p className="m-0 text-sm text-gray-700 dark:text-gray-300">
                    {settings?.copyright}
                </p>

                <div>
                    <SkSocial data={settings.contact} />
                </div>

                {/* Right side (optional links) */}
                <div className="flex">
                    {/* Example: Privacy Policy */}
                    <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-orange-500 dark:text-gray-300"
                    >
                        Privacy Policy
                    </a>
                    <span className="mx-1">|</span>
                    <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-orange-500 dark:text-gray-300"
                    >
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}

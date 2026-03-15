import { Link, usePage } from '@inertiajs/react';


export default function AppLogo() {
    const { settings } = usePage<{ settings: { logo: string; } }>().props;
    return (
        <>
            <div>
                <Link href="/" className="inline-block">
                    <img
                        className="w-[100px] max-h-[100px]"
                        src={settings?.logo}
                        alt="Abu Sayed Khan"
                    />
                </Link>
            </div>
        </>
    );
}

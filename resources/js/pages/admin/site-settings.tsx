import { Head, useForm } from '@inertiajs/react';
import {
    Settings as SettingsIcon,
    Truck,
    Shield,
    FileText,
    Link as LinkIcon,
    Upload,
    Search,
    Mail,
    MapPin,
    Image as ImageIcon,
    Phone,
    Palette,
    Globe,
    Hash,
    CheckCircle2,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import CreateSiteContact from '@/components/site-settings/create-site-contact';
import SiteContactsList from '@/components/site-settings/site-contact-list';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { SiteContactItem } from '@/types';
import type { BreadcrumbItem } from '@/types/navigation';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Site Settings',
        href: '/site-settings',
    },
];

type SettingsData = {
    logo?: string | null;
    favicon?: string | null;
    address?: string | null;
    shop_address?: string | null;
    inside_dhaka_delivery?: number | null;
    outside_dhaka_delivery?: number | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    privacy_policy?: string | null;
    terms_condition?: string | null;
    copyright?: string | null;
};

type PageProps = {
    siteSettings: SettingsData;
    contacts: SiteContactItem[];
};

type SettingsForm = {
    logo: File | null;
    favicon: File | null;
    address: string;
    shop_address: string;
    inside_dhaka_delivery: string;
    outside_dhaka_delivery: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    privacy_policy: string;
    terms_condition: string;
    copyright: string;
};

function SectionHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-2xl border bg-background p-2.5 shadow-sm">
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
function InputError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}
function StatCard({
    title,
    value,
    hint,
}: {
    title: string;
    value: string | number;
    hint: string;
}) {
    return (
        <Card className="skShadow border-0">
            <CardContent className="p-5">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-semibold tracking-tight">
                        {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
            </CardContent>
        </Card>
    );
}
function FilePreview({
    label,
    value,
    fallback,
}: {
    label: string;
    value?: string | null;
    fallback?: string;
}) {
    const src = value || fallback;

    return (
        <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium">{label}</p>
            <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed bg-background p-3">
                {src ? (
                    <img
                        src={src}
                        alt={label}
                        className="max-h-16 object-contain"
                    />
                ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" /> No image
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SiteSettings({ siteSettings, contacts }: PageProps) {
    const [search, setSearch] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const form = useForm<SettingsForm>({
        logo: null,
        favicon: null,
        address: siteSettings.address ?? '',
        shop_address: siteSettings.shop_address ?? '',
        inside_dhaka_delivery: String(siteSettings.inside_dhaka_delivery ?? 0),
        outside_dhaka_delivery: String(
            siteSettings.outside_dhaka_delivery ?? 0,
        ),
        meta_title: siteSettings.meta_title ?? '',
        meta_description: siteSettings.meta_description ?? '',
        meta_keywords: siteSettings.meta_keywords ?? '',
        privacy_policy: siteSettings.privacy_policy ?? '',
        terms_condition: siteSettings.terms_condition ?? '',
        copyright: siteSettings.copyright ?? '',
    });

    const filteredContacts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return contacts;

        return contacts.filter((item) =>
            [item.name, item.url, item.icon ?? '', item.color ?? '']
                .join(' ')
                .toLowerCase()
                .includes(q),
        );
    }, [contacts, search]);

    const activeContacts = contacts.filter((item) => item.status).length;

    // submit handler for the settings form
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to save the changes to site settings? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, save it!',
        });

        if (!result.isConfirmed) return;
        form.post(route('site-settings.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Settings updated successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Site Settings" />

                <div className="min-h-screen">
                    <div className="mx-auto space-y-6 p-4 md:p-6 lg:p-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                                    <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                    Admin Panel / Configuration
                                </div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    Site Settings
                                </h1>
                                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                                    Manage your website branding, addresses,
                                    delivery charge, SEO defaults, policies, and
                                    all social or contact links from one place.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Total Contacts"
                                value={contacts.length}
                                hint="Social and contact items"
                            />
                            <StatCard
                                title="Active Links"
                                value={activeContacts}
                                hint="Visible in frontend"
                            />
                            <StatCard
                                title="Dhaka Delivery"
                                value={`৳ ${form.data.inside_dhaka_delivery || 0}`}
                                hint="Inside Dhaka charge"
                            />
                            <StatCard
                                title="Outside Delivery"
                                value={`৳ ${form.data.outside_dhaka_delivery || 0}`}
                                hint="Outside Dhaka charge"
                            />
                        </div>

                        <div className="grid gap-6 xl:grid-cols-12">
                            <div className="xl:col-span-8">
                                <form onSubmit={submit} className="space-y-6">
                                    <Tabs
                                        defaultValue="general"
                                        className="space-y-6"
                                    >
                                        <div className="flex justify-between">
                                            <div className="overflow-x-auto">
                                                <TabsList className="inline-flex h-auto rounded-2xl border bg-background p-1 shadow-sm">
                                                    <TabsTrigger
                                                        value="general"
                                                        className="rounded-xl px-4 py-2"
                                                    >
                                                        General
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="delivery"
                                                        className="rounded-xl px-4 py-2"
                                                    >
                                                        Delivery
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="seo"
                                                        className="rounded-xl px-4 py-2"
                                                    >
                                                        SEO
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="policies"
                                                        className="rounded-xl px-4 py-2"
                                                    >
                                                        Policies
                                                    </TabsTrigger>
                                                </TabsList>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    disabled={form.processing}
                                                    className="rounded-2xl px-6 font-bold text-orange-500 md:text-lg"
                                                >
                                                    {form.processing
                                                        ? 'Saving...'
                                                        : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </div>

                                        <TabsContent
                                            value="general"
                                            className="space-y-6"
                                        >
                                            <Card className="skShadow rounded-3xl border-0">
                                                <CardHeader>
                                                    <SectionHeader
                                                        icon={SettingsIcon}
                                                        title="Branding & basic info"
                                                        description="Update logo, favicon, and address details used across your website."
                                                    />
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FilePreview
                                                            label="Current logo"
                                                            value={
                                                                logoPreview ??
                                                                siteSettings.logo
                                                            }
                                                            fallback="/logo/logo.png"
                                                        />

                                                        <FilePreview
                                                            label="Current favicon"
                                                            value={
                                                                faviconPreview ??
                                                                siteSettings.favicon
                                                            }
                                                            fallback="/logo/favicon.png"
                                                        />
                                                    </div>

                                                    <div className="grid gap-5 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="logo"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Upload className="h-4 w-4" />{' '}
                                                                Logo
                                                            </Label>

                                                            <Input
                                                                id="logo"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files?.[0] ??
                                                                        null;

                                                                    form.setData(
                                                                        'logo',
                                                                        file,
                                                                    );

                                                                    if (file) {
                                                                        setLogoPreview(
                                                                            URL.createObjectURL(
                                                                                file,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                                className="rounded-xl"
                                                            />

                                                            <InputError
                                                                message={
                                                                    form.errors
                                                                        .logo
                                                                }
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="favicon"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Upload className="h-4 w-4" />{' '}
                                                                Favicon
                                                            </Label>

                                                            <Input
                                                                id="favicon"
                                                                type="file"
                                                                accept=".png,.ico,.svg,.jpg,.jpeg,.webp"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files?.[0] ??
                                                                        null;

                                                                    form.setData(
                                                                        'favicon',
                                                                        file,
                                                                    );

                                                                    if (file) {
                                                                        setFaviconPreview(
                                                                            URL.createObjectURL(
                                                                                file,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                                className="rounded-xl"
                                                            />

                                                            <InputError
                                                                message={
                                                                    form.errors
                                                                        .favicon
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="grid gap-5 md:grid-cols-2">
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label
                                                                htmlFor="address"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <MapPin className="h-4 w-4" />{' '}
                                                                Main address
                                                            </Label>
                                                            <Textarea
                                                                id="address"
                                                                rows={4}
                                                                value={
                                                                    form.data
                                                                        .address
                                                                }
                                                                onChange={(e) =>
                                                                    form.setData(
                                                                        'address',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="rounded-2xl"
                                                                placeholder="Enter your company or office address"
                                                            />
                                                            <InputError
                                                                message={
                                                                    form.errors
                                                                        .address
                                                                }
                                                            />
                                                        </div>

                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label
                                                                htmlFor="shop_address"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <MapPin className="h-4 w-4" />{' '}
                                                                Shop / warehouse
                                                                address
                                                            </Label>
                                                            <Textarea
                                                                id="shop_address"
                                                                rows={4}
                                                                value={
                                                                    form.data
                                                                        .shop_address
                                                                }
                                                                onChange={(e) =>
                                                                    form.setData(
                                                                        'shop_address',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="rounded-2xl"
                                                                placeholder="Enter your shop, pickup point, or warehouse address"
                                                            />
                                                            <InputError
                                                                message={
                                                                    form.errors
                                                                        .shop_address
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent
                                            value="delivery"
                                            className="space-y-6"
                                        >
                                            <Card className="skShadow rounded-3xl border-0">
                                                <CardHeader>
                                                    <SectionHeader
                                                        icon={Truck}
                                                        title="Delivery charges"
                                                        description="Set standard delivery costs that can be used as default values in checkout or order pages."
                                                    />
                                                </CardHeader>
                                                <CardContent className="grid gap-5 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="inside_dhaka_delivery">
                                                            Inside Dhaka
                                                            Delivery
                                                        </Label>
                                                        <Input
                                                            id="inside_dhaka_delivery"
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                form.data
                                                                    .inside_dhaka_delivery
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'inside_dhaka_delivery',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="0"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .inside_dhaka_delivery
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="outside_dhaka_delivery">
                                                            Outside Dhaka
                                                            Delivery
                                                        </Label>
                                                        <Input
                                                            id="outside_dhaka_delivery"
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                form.data
                                                                    .outside_dhaka_delivery
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'outside_dhaka_delivery',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="0"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .outside_dhaka_delivery
                                                            }
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent
                                            value="seo"
                                            className="space-y-6"
                                        >
                                            <Card className="skShadow rounded-3xl border-0">
                                                <CardHeader>
                                                    <SectionHeader
                                                        icon={Shield}
                                                        title="Default SEO settings"
                                                        description="These values can be used as fallback SEO metadata for pages that do not define their own meta information."
                                                    />
                                                </CardHeader>
                                                <CardContent className="space-y-5">
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="meta_title"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Hash className="h-4 w-4" />{' '}
                                                            Meta title
                                                        </Label>
                                                        <Input
                                                            id="meta_title"
                                                            value={
                                                                form.data
                                                                    .meta_title
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'meta_title',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="Default website meta title"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .meta_title
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="meta_description"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <FileText className="h-4 w-4" />{' '}
                                                            Meta description
                                                        </Label>
                                                        <Textarea
                                                            id="meta_description"
                                                            rows={4}
                                                            value={
                                                                form.data
                                                                    .meta_description
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'meta_description',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-2xl"
                                                            placeholder="Write a short SEO description"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .meta_description
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="meta_keywords"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Globe className="h-4 w-4" />{' '}
                                                            Meta keywords
                                                        </Label>
                                                        <Textarea
                                                            id="meta_keywords"
                                                            rows={4}
                                                            value={
                                                                form.data
                                                                    .meta_keywords
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'meta_keywords',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-2xl"
                                                            placeholder="keyword one, keyword two, keyword three"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .meta_keywords
                                                            }
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent
                                            value="policies"
                                            className="space-y-6"
                                        >
                                            <Card className="skShadow rounded-3xl border-0">
                                                <CardHeader>
                                                    <SectionHeader
                                                        icon={FileText}
                                                        title="Policy content"
                                                        description="Manage your privacy policy and terms & conditions in one place."
                                                    />
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="privacy_policy">
                                                            Privacy policy
                                                        </Label>
                                                        <Textarea
                                                            id="privacy_policy"
                                                            rows={10}
                                                            value={
                                                                form.data
                                                                    .privacy_policy
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'privacy_policy',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-2xl"
                                                            placeholder="Write your privacy policy"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .privacy_policy
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="terms_condition">
                                                            Terms & conditions
                                                        </Label>
                                                        <Textarea
                                                            id="terms_condition"
                                                            rows={10}
                                                            value={
                                                                form.data
                                                                    .terms_condition
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'terms_condition',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-2xl"
                                                            placeholder="Write your terms and conditions"
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .terms_condition
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="copyright">
                                                            Footer copyright
                                                        </Label>
                                                        <Input
                                                            id="copyright"
                                                            value={
                                                                form.data
                                                                    .copyright
                                                            }
                                                            onChange={(e) =>
                                                                form.setData(
                                                                    'copyright',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="© 2026 Your Company. All rights reserved."
                                                        />
                                                        <InputError
                                                            message={
                                                                form.errors
                                                                    .copyright
                                                            }
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </form>
                            </div>

                            <div className="space-y-6 xl:col-span-4">
                                <Card className="skShadow rounded-3xl border-0">
                                    <CardHeader>
                                        <SectionHeader
                                            icon={LinkIcon}
                                            title="Contact & social links"
                                            description="Your active links list from the contacts table."
                                        />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="Search contacts..."
                                                className="rounded-xl pl-9"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Total
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {contacts.length}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Active
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    {activeContacts}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="min-h-[300px] overflow-y-auto pr-3">
                                            <div className="space-y-3">
                                                {filteredContacts.length > 0 ? (
                                                    <SiteContactsList
                                                        key={filteredContacts
                                                            .map(
                                                                (item) =>
                                                                    `${item.id}-${item.order}-${item.name}-${item.url}-${item.status}-${item.photo}-${item.icon}-${item.color}`,
                                                            )
                                                            .join('|')}
                                                        items={filteredContacts}
                                                    />
                                                ) : (
                                                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                                        No contact item found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <CreateSiteContact />
                                    </CardContent>
                                </Card>

                                <Card className="skShadow rounded-3xl border-0">
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Quick guide
                                        </CardTitle>
                                        <CardDescription>
                                            Recommended usage for a cleaner site
                                            configuration.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 h-4 w-4" />
                                            <p>
                                                Use the contacts table for
                                                WhatsApp, Messenger, Facebook,
                                                Instagram, phone, email, and any
                                                external profile links.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Palette className="mt-0.5 h-4 w-4" />
                                            <p>
                                                Use icon or photo for each
                                                contact item. Keep colors
                                                consistent with each platform
                                                brand for better recognition.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="mt-0.5 h-4 w-4" />
                                            <p>
                                                Keep address and copyright in
                                                settings because these are
                                                shared globally in header,
                                                footer, and contact sections.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Shield className="mt-0.5 h-4 w-4" />
                                            <p>
                                                Save SEO defaults here, then
                                                override individual page
                                                metadata only where necessary.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

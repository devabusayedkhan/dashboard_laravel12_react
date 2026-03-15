import { usePage } from '@inertiajs/react';
import { KeyRound, LayoutGrid, Shield, Users, UserCog, Cog } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

type PageProps = {
    auth: {
        permissions: string[];
        roles: string[];
    };
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const can = (permission: string) => auth?.permissions?.includes(permission);
    const canAny = (permissions: string[]) => permissions.some((p) => can(p));

    const mainNavItems: NavItem[] = [
        ...(can('admin.dashboard')
            ? [
                  {
                      title: 'Dashboard',
                      href: dashboard(),
                      icon: LayoutGrid,
                  },
              ]
            : []),

        // Role & Permissions group
        ...(canAny(['admin.users', 'admin.roles', 'admin.permissions'])
            ? [
                  {
                      title: 'Role & Permissions',
                      icon: Shield,
                      items: [
                          ...(can('admin.users')
                              ? [
                                    {
                                        title: 'Users',
                                        href: '/admin/users',
                                        icon: Users,
                                    },
                                ]
                              : []),

                          ...(can('admin.roles')
                              ? [
                                    {
                                        title: 'Roles',
                                        href: '/admin/roles',
                                        icon: UserCog,
                                    },
                                ]
                              : []),

                          ...(can('admin.permissions')
                              ? [
                                    {
                                        title: 'Permissions',
                                        href: '/admin/permissions',
                                        icon: KeyRound,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        ...(can('manage-site')
            ? [
                  {
                      title: 'Settings',
                      href: '/site-settings',
                      icon: Cog,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavMain items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

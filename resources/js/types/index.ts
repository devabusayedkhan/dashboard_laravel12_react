export type * from './auth';
export type * from './navigation';
export type * from './ui';
import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export type SiteContactItem = {
    id: number;
    name: string;
    icon?: string | null;
    color?: string | null;
    photo?: string | null;
    url: string;
    order: number;
    status: boolean;
};
import type { AppLayoutProps } from '@/types';
import AppHeaderLayout from './app/app-header-layout';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppHeaderLayout>
);

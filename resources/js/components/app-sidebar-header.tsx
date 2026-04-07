import { usePage } from '@inertiajs/react';
import ThemeToggle from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

export function AppSidebarHeader() {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 bg-background px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {auth.user && <NavUser />}
            </div>
        </header>
    );
}

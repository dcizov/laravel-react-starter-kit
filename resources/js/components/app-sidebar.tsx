import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CheckSquare,
    FolderGit2,
    Key,
    LayoutGrid,
    Lock,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import { useCan } from '@/hooks/use-can';
import { dashboard } from '@/routes';
import permissions from '@/routes/permissions';
import roles from '@/routes/roles';
import tasks from '@/routes/tasks';
import users from '@/routes/users';
import type { NavItem } from '@/types';
import { NavAccess } from './nav-access';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Tasks',
        href: tasks.index(),
        icon: CheckSquare,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const canViewUsers = useCan('view-users');
    const canViewRoles = useCan('view-roles');
    const canViewPermissions = useCan('view-permissions');

    const accessNavItems: NavItem[] = [
        ...(canViewUsers
            ? [{ title: 'Users', href: users.index(), icon: Users }]
            : []),
        ...(canViewRoles
            ? [{ title: 'Roles', href: roles.index(), icon: Lock }]
            : []),
        ...(canViewPermissions
            ? [{ title: 'Permissions', href: permissions.index(), icon: Key }]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            }
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {accessNavItems.length > 0 && (
                    <NavAccess items={accessNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

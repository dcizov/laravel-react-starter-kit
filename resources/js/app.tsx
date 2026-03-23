import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
                {error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'}
            </p>
            <button
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                onClick={resetErrorBoundary}
            >
                Try again
            </button>
        </div>
    );
}

function AppWithErrorBoundary({
    App,
    props,
}: {
    App: React.ComponentType<any>;
    props: any;
}) {
    const { url } = props;

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            resetKeys={[url]}
            onError={(error, info) => {
                console.error('[ErrorBoundary]', error, info.componentStack);
            }}
        >
            <App {...props} />
        </ErrorBoundary>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

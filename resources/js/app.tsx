import { createInertiaApp } from '@inertiajs/react';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
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
        return (
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, info) => {
                    console.error(
                        '[ErrorBoundary]',
                        error,
                        info.componentStack,
                    );
                }}
            >
                <TooltipProvider delay={0}>{app}</TooltipProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

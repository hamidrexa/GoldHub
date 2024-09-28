'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    // const { theme = 'system' } = useTheme();

    return (
        <Sonner
            // theme={theme as ToasterProps['theme']}
            theme="light"
            className="toaster group z-[999999] !font-[inherit]"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:text-sm group-[.toaster]:bg-white group-[.toaster]:fon group-[.toaster]:text-neutral-800 group-[.toaster]:border group-[.toaster]:border-gray-100 group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-transparent group-[.toast]:border group-[.toast]:border-[inherit] group-[.toast]:border-solid group-[.toast]:text-[inherit] group-[.toast]:text-sm',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

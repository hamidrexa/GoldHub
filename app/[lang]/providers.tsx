'use client';

import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetcher } from '@/libs/utils';
import { useNetworkState } from 'react-use';
import { toast } from 'sonner';
import { useGlobalContext } from '@/contexts/store';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const growthbook = new GrowthBook({
    enableDevMode: true,
    apiHost:
        process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST ??
        'https://api.growthbook.sahmeto.com',
    clientKey:
        process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY ?? 'sdk-fF7IIVNUAGLLo5S8',
});

export function Providers({ children }) {
    const { user } = useGlobalContext();
    const networkState = useNetworkState();

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA')
            import('eruda').then((eruda) => eruda.default.init());
        console.log(
            "%c🎉 WE'RE HIRING!",
            'color: #10EDC5; font-size: 24px; font-weight: bold; background-color: #0C0E3C; padding: 4px;'
        );
        console.log(
            '%cVisit our careers page: https://jobinja.ir/companies/negarbi/jobs',
            'color: #10EDC5; font-size: 16px; background-color: #0C0E3C; padding: 4px;'
        );
    }, []);
    useEffect(() => {
        growthbook.init();
        if (user)
            growthbook.setAttributes({
                id: user.id,
            });
    }, [user]);
    useEffect(() => {
        if (!networkState.online)
            toast.loading('Connection Issue', {
                description: 'Your internet connection has been lost.',
                closeButton: false,
                position: 'top-center',
            });
        else toast.dismiss();
    }, [networkState.online]);
    useEffect(() => {
        var _mtm = (window._mtm = window._mtm || []);
        _mtm.push({
            'mtm.startTime': new Date().getTime(),
            event: 'mtm.Start',
        });
        (function () {
            var d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.async = true;
            g.src = 'https://matomo.darkube.app/js/container_sjxAPumg.js';
            s.parentNode.insertBefore(g, s);
        })();
    }, []);
    useEffect(() => {
        if (user) {
            var _paq = (window._paq = window._paq || []);
            _paq.push(['setUserId', user.id]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function () {
                var u = '//matomo.darkube.app/';
                _paq.push(['setTrackerUrl', u + 'matomo.php']);
                _paq.push(['setSiteId', 1]);
                var d = document,
                    g = d.createElement('script'),
                    s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.src = u + 'matomo.js';
                s.parentNode.insertBefore(g, s);
            })();

            if (window.clarity) {
                window.clarity('set', 'userId', user.id);
                window.clarity(
                    'identify',
                    user.email,
                    '',
                    '',
                    user.phone_number
                );
            }
        }
    }, [user]);

    return (
        <GrowthBookProvider growthbook={growthbook}>
            {/*<ThemeProvider attribute="class" defaultTheme="light">*/}
            <SWRConfig
                value={{
                    fetcher,
                    refreshInterval: 250000,
                    revalidateOnFocus: false,
                    errorRetryCount: 0,
                    errorRetryInterval: 500,
                }}
            >
                <GoogleOAuthProvider clientId="995773658255-4rbljkeuffmrollveonuumq7ev6rqvid.apps.googleusercontent.com">
                    {children}
                    <ProgressBar
                        height="4px"
                        color="#FFBE00"
                        options={{ showSpinner: true }}
                        shallowRouting
                    />
                </GoogleOAuthProvider>
            </SWRConfig>
            {/*</ThemeProvider>*/}
        </GrowthBookProvider>
    );
}

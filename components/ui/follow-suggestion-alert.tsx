'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import FollowWizard from '@/components/follow-wizard';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

type Props = {
    dict: any;
    lang: Locale;
};

export default function FollowSuggestionAlert({ dict, lang }: Props) {
    const seenFollowAlert = Cookies.get('seenFollowAlert');
    const { user } = useGlobalContext();
    const path = usePathname();
    const hasLessRequiredBookmarks = user?.bookmark_count <= 2;
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsOpen(hasLessRequiredBookmarks), 30000);
    }, [hasLessRequiredBookmarks]);

    if (
        !user ||
        // !user.active_plan?.is_active ||
        seenFollowAlert ||
        !hasLessRequiredBookmarks ||
        path.includes('/profile') ||
        path.includes('/finochat') ||
        path.includes('/notifications') ||
        path.includes('/copytrade') ||
        path.includes('/privacy') ||
        path.includes('/pricing') ||
        path.includes('/organization') ||
        path.includes('/about') ||
        path.includes('/contact') ||
        path.includes('/invest') ||
        path === '/'
    )
        return null;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open)
                    Cookies.set('seenFollowAlert', 'true', {
                        expires: 2,
                    });
            }}
        >
            <DialogContent>
                <FollowWizard
                    dict={dict}
                    lang={lang}
                    onEnd={() => {
                        setIsOpen(false);
                        Cookies.set('seenFollowAlert', 'true', {
                            expires: 1,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Cookies from 'js-cookie';
import { XIcon } from 'lucide-react';

const AnnouncementAlert = ({ dict, lang, page = 'all_pages' }) => {
    const [isActive, setIsActive] = useState(false);
    const isSeenAnnouncements = Cookies.get('isSeenAnnouncements');
    const announcement: any = useFeatureValue('announcement', {});

    useEffect(() => {
        if (!isSeenAnnouncements)
            setIsActive(
                (page === announcement.pages ||
                    announcement.pages === 'all_pages') &&
                    announcement.lang.includes(lang)
            );
    }, [announcement]);

    const onClick = () => {
        Cookies.set('isSeenAnnouncements', 'true', { expires: 1 });
        setIsActive(false);
    };

    if (isSeenAnnouncements || !isActive) return null;

    return (
        <div className="sticky left-0 right-0 top-16 z-50 mx-auto mt-5 max-w-7xl px-2.5 md:top-24 md:mb-0 md:px-0">
            <Alert variant={announcement.type}>
                <XIcon className="cursor-pointer" onClick={onClick} />
                {announcement.title && (
                    <AlertTitle className="whitespace-pre-line">
                        {announcement.title}
                    </AlertTitle>
                )}
                {announcement.description && (
                    <AlertDescription className="whitespace-pre-line">
                        {announcement.description}
                        {announcement.link && (
                            <a
                                className="font-extrabold underline underline-offset-2"
                                href={announcement.link}
                            >
                                {announcement.link_text || dict.moreInfo}
                            </a>
                        )}
                    </AlertDescription>
                )}
            </Alert>
        </div>
    );
};

export default AnnouncementAlert;

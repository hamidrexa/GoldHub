'use client';

import { Phone } from '@/app/[lang]/(auth)/login/components/phone';
import React, { useState } from 'react';
import { Otp } from '@/app/[lang]/(auth)/login/components/otp';
import { Password } from '@/app/[lang]/(auth)/login/components/password';
import { CompleteInfo } from '@/app/[lang]/(auth)/login/components/complete-info';
import { Locale } from '@/i18n-config';

export type StepValues = 'phone' | 'otp' | 'password' | 'complete-info';

export function PhoneAuth({
    dict,
    lang,
    texts,
    redirectUrl,
    showGoogle,
}: {
    dict: any;
    lang: Locale;
    texts?: any;
    redirectUrl?: any;
    showGoogle?: boolean;
}) {
    const [userId, setUserId] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [step, setStep] = useState<StepValues>('phone');

    return (
        <>
            {step === 'phone' && (
                <Phone
                    showGoogle={showGoogle}
                    dict={dict}
                    lang={lang}
                    setStep={setStep}
                    setUserId={setUserId}
                    setIsNewUser={setIsNewUser}
                    texts={texts}
                    redirectUrl={redirectUrl}
                />
            )}
            {step === 'password' && (
                <Password
                    dict={dict}
                    userId={userId}
                    setStep={setStep}
                    redirectUrl={redirectUrl}
                />
            )}
            {step === 'otp' && (
                <Otp
                    userId={userId}
                    isNewUser={isNewUser}
                    dict={dict}
                    setStep={setStep}
                    redirectUrl={redirectUrl}
                />
            )}
            {step === 'complete-info' && (
                <CompleteInfo
                    lang={lang}
                    dict={dict}
                    userId={userId}
                    setStep={setStep}
                    redirectUrl={redirectUrl}
                />
            )}
        </>
    );
}

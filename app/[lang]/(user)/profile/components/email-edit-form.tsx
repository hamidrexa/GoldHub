'use client';

import { useState } from 'react';
import { EmailVerificationForm } from '@/app/[lang]/(user)/profile/components/email-verify-form';
import { ActivationForm } from '@/app/[lang]/(user)/profile/components/activation-form';

export function EmailEditForm({ lang, dict, setOpen }) {
    const [step, setStep] = useState(1);
    return step === 1 ? (
        <EmailVerificationForm lang={lang} dict={dict} setStep={setStep} />
    ) : (
        <ActivationForm
            setOpen={setOpen}
            activated="email"
            lang={lang}
            dict={dict}
            onSubmit={() => {}}
        />
    );
}

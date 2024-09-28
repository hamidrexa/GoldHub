'use client';

import { useState } from 'react';
import { ActivationForm } from '@/app/[lang]/(user)/profile/components/activation-form';
import { PhoneVerifyForm } from '@/app/[lang]/(user)/profile/components/phone-number-edit';

export function PhoneSubmitForm({ lang, dict, setOpen }) {
    const [step, setStep] = useState(1);
    return step === 1 ? (
        <PhoneVerifyForm lang={lang} dict={dict} setStep={setStep} />
    ) : (
        <ActivationForm
            setStep={setStep}
            setOpen={setOpen}
            activated="phone"
            lang={lang}
            dict={dict}
            onSubmit={() => {}}
        />
    );
}

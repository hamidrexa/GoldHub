'use client';

import React, { useState } from 'react';
import PublishFirstForm from '@/components/publish-first-form';
import PublishSecondForm from '@/components/publish-second-form';
import { useGlobalContext } from '@/contexts/store';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getLinksLang } from '@/libs/utils';

export default function PublishSignal({ lang, dict, setIsOpen, onEnd }) {
    const { user } = useGlobalContext();
    const [signal, setSignal] = useState({});
    const [step, setStep] = useState(1);
    const [response, setResponse] = useState(null);

    return (
        <>
            {step === 1 ? (
                <PublishFirstForm setStep={setStep} setSignal={setSignal} />
            ) : step === 2 ? (
                <PublishSecondForm
                    setSignal={setSignal}
                    signal={signal}
                    setStep={setStep}
                    setResponse={setResponse}
                />
            ) : (
                <div className="flex w-full flex-col gap-3 text-xl leading-relaxed">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        سیگنال شما با{' '}
                        <span className="font-bold text-green-500">
                            موفقیت{' '}
                        </span>{' '}
                        ثبت شد.
                    </div>
                    <div>
                        ضمنا شما می توانید سیگنال خود را در
                        <Link
                            target="_blank"
                            className="font-bold text-blue-700 underline underline-offset-4"
                            href={`${getLinksLang(lang)}/publisher/${response?.publisher_primary_username}`}
                        >
                            {' '}
                            صفحه اختصاصی
                        </Link>{' '}
                        خود در طلامی مشاهده و اصلاح کنید.
                    </div>
                </div>
            )}
        </>
    );
}

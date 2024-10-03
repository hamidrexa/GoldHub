import React, { useState } from 'react';
import { activate } from '@/app/[lang]/(auth)/login/services/activate';
import { Timer } from '@/components/timer';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useReadOTP } from 'react-read-otp';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, RotateCw } from 'lucide-react';
import { forgetPassword } from '@/app/[lang]/(auth)/login/services/forgetPassword';
import OtpInput from 'react-otp-input';
import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export function Otp({ userId, isNewUser, setStep, dict, redirectUrl }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOtpRetry, setIsLoadingOtpRetry] = useState(false);
    const [isCounterEnd, setIsCounterEnd] = useState(false);
    const [otp, setOTP] = useState(null);
    const searchParams = useSearchParams();
    useReadOTP((otp) => {
        setOTP(otp);
        if (otp?.length === 4) getToken(Number(otp));
    });

    const getToken = async (code: number) => {
        setIsLoading(true);
        try {
            const { token } = await activate({
                ID: userId.ID,
                code: code,
            });
            Cookies.set('token', token.access, { expires: 7 });
            Cookies.set('token-refresh', token.refresh, { expires: 365 });
            if (isNewUser) setStep('complete-info');
            else
                window.location.href =
                    redirectUrl || searchParams.get('url') || '/';
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(
                e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0] ||
                    e?.error?.params?.email?.[0]
            );
        }
        setIsLoading(false);
    };
    const handleOtpRetry = async () => {
        setIsLoadingOtpRetry(true);
        try {
            await forgetPassword({ ID: userId.ID });
            setOTP(null);
            setIsCounterEnd(false);
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(
                e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0] ||
                    e?.error?.params?.email?.[0]
            );
        }
        setIsLoadingOtpRetry(false);
    };

    return (
        <>
            <Button
                variant="link"
                className="absolute -top-10 px-0 underline underline-offset-2"
                onClick={() => setStep('phone')}
            >
                <ChevronRight strokeWidth={1.25} />
                بازگشت
            </Button>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    کد یکبار مصرف
                </h1>
                <p className="text-sm">
                    {isCounterEnd
                        ? 'کد ارسال شده منقضی شده است. لطفا کد جدید دریافت کنید.'
                        : ` جهت ورود لطفا کد ۴ رقمی ارسال شده به ${userId.enteredValue} را وارد کنید.`}
                </p>
            </div>
            {/*<InputOTP*/}
            {/*    dir="ltr"*/}
            {/*    autoFocus*/}
            {/*    maxLength={4}*/}
            {/*    disabled={isLoading || isCounterEnd}*/}
            {/*    className={cn({ 'animate-pulse': isLoading })}*/}
            {/*    value={otp}*/}
            {/*    onChange={(otp) => setOTP(otp)}*/}
            {/*    onComplete={getToken}*/}
            {/*>*/}
            {/*    <InputOTPGroup>*/}
            {/*        <InputOTPSlot index={0} />*/}
            {/*        <InputOTPSlot index={1} />*/}
            {/*        <InputOTPSlot index={2} />*/}
            {/*        <InputOTPSlot index={3} />*/}
            {/*    </InputOTPGroup>*/}
            {/*</InputOTP>*/}
            {!isCounterEnd && (
                <div dir="ltr">
                    <OtpInput
                        shouldAutoFocus
                        skipDefaultStyles
                        numInputs={4}
                        containerStyle={cn(
                            'w-full flex justify-center items-center gap-2',
                            {
                                'pointer-events-none opacity-50':
                                    isLoading || isCounterEnd,
                                'animate-pulse': isLoading,
                            }
                        )}
                        inputType="tel"
                        renderSeparator={<span></span>}
                        inputStyle="w-12 h-12 bg-white border border-gray-400 rounded-md text-center leading-none font-bold text-2xl"
                        value={otp}
                        onChange={(otp) => {
                            setOTP(Number(otp));
                            if (otp?.length === 4) getToken(Number(otp));
                        }}
                        renderInput={(props) => <input {...props} />}
                    />
                </div>
            )}
            {isCounterEnd ? (
                <Button onClick={handleOtpRetry} disabled={isLoadingOtpRetry}>
                    {isLoadingOtpRetry ? (
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                        <RotateCw
                            className="inline ltr:ml-2 rtl:mr-2"
                            stroke="#fff"
                            strokeWidth={1.2}
                            width={20}
                            height={20}
                        />
                    )}
                    دریافت مجدد کد
                </Button>
            ) : (
                <p className="text-center text-sm">
                    در صورت عدم دریافت کد یا تغییر شماره می‌توانید تا{' '}
                    <Timer
                        className="inline-block w-9 font-bold"
                        endTime={120}
                        onEnd={() => setIsCounterEnd(true)}
                        countDown
                    />{' '}
                    دقیقه دیگر مجدد تلاش کنید.
                </p>
            )}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="text-muted-foreground px-2">یا</span>
                </div>
            </div>
            <button
                className="flex cursor-pointer items-center justify-center gap-2 text-center text-sm font-medium underline underline-offset-2"
                onClick={() => setStep('password')}
            >
                ورود با رمز عبور
            </button>
        </>
    );
}

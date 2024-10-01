import { TicketIcon } from 'lucide-react';
import { Metadata } from 'next';
import { cn, getLinksLang } from '@/libs/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'رسید خرید | طلامی',
    description: '',
};

const PlanType = {
    1: 'طلایی',
    2: 'نقره‌ای',
    3: 'برنزی',
    4: 'هدیه',
    5: 'هدیه',
    6: 'هدیه',
};

export default function ReceiptPage({ params: { planId, lang } }) {
    const isSuccess = parseInt(planId) !== 0;

    return (
        <div className="mb-20 mt-24 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center px-10 py-6">
                <TicketIcon
                    width={120}
                    height={120}
                    className="mb-5"
                    color={isSuccess ? '#07bb61' : '#f31616'}
                />
                <h1 className="text-2xl font-bold">
                    {isSuccess
                        ? parseInt(planId) === 43 ||
                          parseInt(planId) === 44 ||
                          parseInt(planId) === 76
                            ? 'تراکنش با موفقیت انجام شد، تا دقایقی دیگر سفارش شما تکمیل می شود.'
                            : `طی ۲۴ساعت، طرح ${PlanType[planId]} شما فعال می شود`
                        : 'پرداخت شما ناموفق بود.'}
                </h1>
                <p className="mt-4">
                    در صورت مشکل در فرایند فعال سازی یا خرید میتوانید از طریق
                    پشتیبانی طلامی اطلاع دهید.
                </p>
                {isSuccess && (
                    <Link
                        className={cn(buttonVariants(), 'mt-4 min-w-24')}
                        href={
                            parseInt(planId) === 43 || parseInt(planId) === 44
                                ? `${getLinksLang(lang)}/invest`
                                : `${getLinksLang(lang)}/profile`
                        }
                    >
                        ادامه
                    </Link>
                )}
            </div>
        </div>
    );
}

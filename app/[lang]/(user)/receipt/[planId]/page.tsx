import { TicketIcon } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { cn, getLinksLang } from '@/libs/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: { planId: string; lang: Locale };
}

export async function generateMetadata(
    { params: { lang, planId } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const isSuccess = parseInt(planId) !== 0;

    const seoTitle = isSuccess
        ? dict.transactionStatus.success
        : dict.transactionStatus.cancel;
    const seoDescription = `View the receipt for your transaction on GoldHub. Status: ${
        isSuccess ? 'Successful' : 'Failed'
    }.`;

    return {
        title: `${seoTitle} | GoldHub`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle} | GoldHub`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/receipt/${planId}`,
        },
    };
}

const PlanType = {
    1: 'طلایی',
    2: 'نقره‌ای',
    3: 'برنزی',
    4: 'هدیه',
    5: 'هدیه',
    6: 'هدیه',
};

export default function ReceiptPage({ params: { planId, lang } }: PageProps) {
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
                    پشتیبانی طلانو اطلاع دهید.
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

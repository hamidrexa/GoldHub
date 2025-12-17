import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang, orderId } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const order = mockBuyerOrders.find(o => o.id === orderId);

    const seoTitle = order
        ? `${dict.marketplace.buyer.orderDetailModal.title} ${order.id}`
        : dict.marketplace.buyer.orderDetailPage.notFound.title;
    const seoDescription = order
        ? `View details for order ${order.id}, placed on ${order.date}.`
        : dict.marketplace.buyer.orderDetailPage.notFound.description;

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer/orders/${orderId}`,
        },
    };
}
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { OrderPageWrapper } from '@/app/[lang]/(user)/buyer/components/order-page-wrapper';

interface PageProps {
    params: { lang: Locale; orderId: string };
}

// Server-side status badge component
export default async function OrderDetailPage({ params: { lang, orderId } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <OrderPageWrapper dict={dict} lang={lang} orderId={orderId}/>
    );
}

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, DollarSign, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { mockDashboardStats } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminStartCards } from '@/app/[lang]/(user)/admin/components/start-cards';

type Props = {
    params: { lang: Locale };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.common.dashboard || 'Admin Dashboard';
    const seoDescription = dict.marketplace.admin.welcomeMessage || 'Monitor key metrics, review recent activities, and manage your GoldHub marketplace.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/admin/dashboard`,
        },
    };
}

export default async function DashboardPage({ params: { lang } }: Props) {
    const dict = await getDictionary(lang);
    const stats = mockDashboardStats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.common.dashboard}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.admin.welcomeMessage}</p>
                </div>
                <Link href={`/${lang}/admin/users-kyc`}>
                    <Button className="bg-gold-600 hover:bg-gold-700 text-black">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {dict.marketplace.admin.reviewKycRequests}
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <AdminStartCards dict={dict} lang={lang}/>

            {/*<div className="grid gap-4 grid-cols-1 lg:grid-cols-7">*/}
            {/*    /!* Recent Activity *!/*/}
            {/*    <Card className="col-span-full lg:col-span-4">*/}
            {/*        <CardHeader className="flex flex-row items-center justify-between">*/}
            {/*            <CardTitle className="text-lg">{dict.marketplace.admin.recentActivity}</CardTitle>*/}
            {/*            <Link href={`/${lang}/admin/audit-logs`}>*/}
            {/*                <Button variant="ghost" size="sm">*/}
            {/*                    {dict.marketplace.common.viewAll}*/}
            {/*                    <ArrowRight className="h-4 w-4 ml-1" />*/}
            {/*                </Button>*/}
            {/*            </Link>*/}
            {/*        </CardHeader>*/}
            {/*        <CardContent className="space-y-3">*/}
            {/*            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">*/}
            {/*                <div className="flex-1">*/}
            {/*                    <p className="font-semibold text-sm">{dict.marketplace.admin.newOrderReceived}</p>*/}
            {/*                    <p className="text-xs text-muted-foreground mt-1">{dict.marketplace.admin.orderFrom}</p>*/}
            {/*                </div>*/}
            {/*                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">2 {dict.marketplace.common.hoursAgo}</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">*/}
            {/*                <div className="flex-1">*/}
            {/*                    <p className="font-semibold text-sm">{dict.marketplace.admin.kycSubmitted}</p>*/}
            {/*                    <p className="text-xs text-muted-foreground mt-1">{dict.marketplace.admin.kycSubmittedDesc}</p>*/}
            {/*                </div>*/}
            {/*                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">5 {dict.marketplace.common.hoursAgo}</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">*/}
            {/*                <div className="flex-1">*/}
            {/*                    <p className="font-semibold text-sm">{dict.marketplace.admin.paymentReceived}</p>*/}
            {/*                    <p className="text-xs text-muted-foreground mt-1">{dict.marketplace.admin.paymentReceivedDesc}</p>*/}
            {/*                </div>*/}
            {/*                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">1 {dict.marketplace.common.daysAgo}</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">*/}
            {/*                <div className="flex-1">*/}
            {/*                    <p className="font-semibold text-sm">{dict.marketplace.admin.newUserRegistered}</p>*/}
            {/*                    <p className="text-xs text-muted-foreground mt-1">{dict.marketplace.admin.newUserRegisteredDesc}</p>*/}
            {/*                </div>*/}
            {/*                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">2 {dict.marketplace.common.daysAgo}</span>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}

            {/*    /!* Quick Actions *!/*/}
            {/*    <Card className="col-span-full lg:col-span-3">*/}
            {/*        <CardHeader>*/}
            {/*            <CardTitle className="text-lg">{dict.marketplace.admin.quickActions}</CardTitle>*/}
            {/*        </CardHeader>*/}
            {/*        <CardContent className="space-y-3">*/}
            {/*            <Link href={`/${lang}/admin/orders`} className="block p-3 border rounded-lg hover:bg-gold-50 transition-colors">*/}
            {/*                <div className="font-semibold text-sm">{dict.marketplace.admin.reviewPendingOrders}</div>*/}
            {/*                <div className="text-xs text-muted-foreground mt-1">{stats.pendingOrders} {dict.marketplace.common.ordersWaiting}</div>*/}
            {/*            </Link>*/}
            {/*            <Link href={`/${lang}/admin/users-kyc`} className="block p-3 border rounded-lg hover:bg-gold-50 transition-colors">*/}
            {/*                <div className="font-semibold text-sm">{dict.marketplace.admin.reviewKycRequests}</div>*/}
            {/*                <div className="text-xs text-muted-foreground mt-1">{stats.pendingKyc} {dict.marketplace.common.applicationsPending}</div>*/}
            {/*            </Link>*/}
            {/*            <Link href={`/${lang}/admin/audit-logs`} className="block p-3 border rounded-lg hover:bg-gold-50 transition-colors">*/}
            {/*                <div className="font-semibold text-sm">{dict.marketplace.admin.viewAuditLogs}</div>*/}
            {/*                <div className="text-xs text-muted-foreground mt-1">{dict.marketplace.admin.monitorSystemActivity}</div>*/}
            {/*            </Link>*/}
            {/*            <Link href={`/${lang}/admin/users-kyc`} className="block p-3 border rounded-lg hover:bg-gold-50 transition-colors">*/}
            {/*                <div className="font-semibold text-sm">{dict.marketplace.admin.manageUsers}</div>*/}
            {/*                <div className="text-xs text-muted-foreground mt-1">{stats.activeUsers} {dict.marketplace.common.activeUsers}</div>*/}
            {/*            </Link>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*</div>*/}
        </div>
    );
}

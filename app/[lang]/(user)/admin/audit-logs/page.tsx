import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.admin.auditLogsPage.title || 'Audit Logs';
    const seoDescription = dict.marketplace.admin.auditLogsPage.description || 'Review and monitor all system and user activities.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/admin/audit-logs`,
        },
    };
}
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { mockAuditLogs, AuditLog } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { URLTabs } from '@/components/ui/url-tabs';
import { AuditLogsSearch } from './audit-logs-search';
import { ActivityLogsTable } from '@/app/[lang]/(user)/admin/components/activity-logs-table';

// Server-side event badge component

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string };
}

export default async function AuditLogsPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const eventFilter = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';

    // Filter logs server-side
    let filteredLogs = [...mockAuditLogs];

    // Filter by search
    if (searchQuery) {
        filteredLogs = filteredLogs.filter(log =>
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ipAddress.includes(searchQuery) ||
            log.device.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by event type
    if (eventFilter !== 'all') {
        if (eventFilter === 'kyc') {
            filteredLogs = filteredLogs.filter(log =>
                log.event === 'kyc_submitted' || log.event === 'kyc_approved' || log.event === 'kyc_rejected'
            );
        } else {
            filteredLogs = filteredLogs.filter(log => log.event === eventFilter);
        }
    }

    const loginCount = mockAuditLogs.filter(l => l.event === 'login').length;
    const kycCount = mockAuditLogs.filter(l =>
        l.event === 'kyc_submitted' || l.event === 'kyc_approved' || l.event === 'kyc_rejected'
    ).length;


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.auditLogsPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.auditLogsPage.description}</p>
            </div>

            {/* Client-side search component */}
            <AuditLogsSearch
                placeholder={dict.marketplace.admin.auditLogsPage.searchPlaceholder}
                defaultValue={searchQuery}
            />

            {/* Client-side tabs wrapper */}
            <URLTabs tabs={[
                { value: 'all', label: dict.marketplace.admin.auditLogsPage.tabs.all },
                { value: 'login', label: dict.marketplace.admin.auditLogsPage.tabs.login },
                { value: 'order_created', label: dict.marketplace.admin.auditLogsPage.tabs.orders },
                { value: 'kyc', label: dict.marketplace.admin.auditLogsPage.tabs.kyc },
            ]} defaultValue={eventFilter} />

            {/* Server-rendered table */}
            <ActivityLogsTable searchQuery={searchQuery} eventFilter={eventFilter} dict={dict} />

            {/* Stats cards - fully server-rendered */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.totalEvents}</div>
                    <div className="text-3xl font-bold">{mockAuditLogs.length}</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.loginEvents}</div>
                    <div className="text-3xl font-bold text-green-600">{loginCount}</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.kycEvents}</div>
                    <div className="text-3xl font-bold text-yellow-600">{kycCount}</div>
                </div>
            </div>
        </div>
    );
}

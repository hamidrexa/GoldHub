import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { mockAuditLogs, AuditLog } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { AuditLogsSearch } from './audit-logs-search';
import { ActivityLogsTable } from '@/app/[lang]/(user)/admin/components/activity-logs-table';

// Server-side event badge component
function EventBadge({ event, dict }: { event: AuditLog['event']; dict: any }) {
    const badges = {
        login: { label: dict.marketplace.admin.auditLogsPage.events.login, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        logout: { label: dict.marketplace.admin.auditLogsPage.events.logout, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        order_created: { label: dict.marketplace.admin.auditLogsPage.events.orderCreated, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        kyc_submitted: { label: dict.marketplace.admin.auditLogsPage.events.kycSubmitted, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
        kyc_approved: { label: dict.marketplace.admin.auditLogsPage.events.kycApproved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        kyc_rejected: { label: dict.marketplace.admin.auditLogsPage.events.kycRejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[event];
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

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

    const tabs = [
        { value: 'all', label: dict.marketplace.admin.auditLogsPage.tabs.all },
        { value: 'login', label: `${dict.marketplace.admin.auditLogsPage.tabs.login} (${loginCount})` },
        { value: 'kyc', label: `${dict.marketplace.admin.auditLogsPage.tabs.kyc} (${kycCount})` },
        { value: 'order_created', label: dict.marketplace.admin.auditLogsPage.tabs.orders },
    ];

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

            {/* Server-side tabs using URL params */}
            <div className="border-b w-full flex space-x-4">
                {tabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/${lang}/admin/audit-logs?tab=${tab.value}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`px-4 py-3 border-b-2 transition-colors ${eventFilter === tab.value
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

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

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
    const seoTitle = dict.marketplace.admin.usersKycPage.title || 'User KYC Management';
    const seoDescription = dict.marketplace.admin.usersKycPage.description || 'Review and manage user KYC submissions to ensure compliance and security.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/admin/users-kyc`,
        },
    };
}
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { getUsersList } from '@/lib/api-client';
import { mockUsers, User } from '@/lib/mock-data';
import Link from 'next/link';
import { URLTabs } from '@/components/ui/url-tabs';
import { UsersKycSearch } from './users-kyc-search';
import { UsersKycTable } from '@/app/[lang]/(user)/admin/components/user-kyc-tables';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { KycDialog } from './kyc-dialog';
// Define display user type for compatibility
interface DisplayUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'supplier' | 'retailer';
    kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    companyName?: string;
    joinedDate: string;
    documentsUploaded: boolean;
    iban?: string;
    swift?: string;
}

// Server-side KYC badge component
function KycBadge({
    status,
    dict,
}: {
    status: DisplayUser['kycStatus'];
    dict: any;
}) {
    const badges = {
        approved: {
            label: dict.marketplace.admin.usersKycPage.status.approved,
            className: 'bg-green-100 text-green-800 hover:bg-green-100',
        },
        pending: {
            label: dict.marketplace.admin.usersKycPage.status.pendingReview,
            className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        },
        rejected: {
            label: dict.marketplace.admin.usersKycPage.status.rejected,
            className: 'bg-red-100 text-red-800 hover:bg-red-100',
        },
        not_submitted: {
            label: dict.marketplace.admin.usersKycPage.status.notSubmitted,
            className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        },
    };
    const config = badges[status];
    return (
        <Badge variant="default" className={config.className}>
            {config.label}
        </Badge>
    );
}

// Server-side role badge component
function RoleBadge({ role }: { role: DisplayUser['role'] }) {
    const colors = {
        admin: 'bg-red-100 text-red-800',
        supplier: 'bg-blue-100 text-blue-800',
        retailer: 'bg-purple-100 text-purple-800',
    };
    return (
        <Badge
            variant="default"
            className={`${colors[role]} hover:${colors[role]}`}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
    );
}

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string; user?: string };
}

export default async function UsersKycPage({
    params: { lang },
    searchParams,
}: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';
    const selectedUserId = searchParams.user;

    // Fetch users from API, fallback to mock data
    let users: DisplayUser[] = [];
    try {
        const apiUsers = await getUsersList();
        users = apiUsers.map((user) => ({
            id: String(user.id),
            name: user.username,
            email: user.email,
            role: (user.role === 'buyer'
                ? 'retailer'
                : user.role) as DisplayUser['role'],
            kycStatus: (() => {
                if (!user.kyc_status) return 'not_submitted';
                if (user.kyc_status.includes('approved')) return 'approved';
                if (user.kyc_status.includes('rejected')) return 'rejected';
                if (user.kyc_status.includes('requested')) return 'pending';
                return 'not_submitted';
            })(),
            companyName: user.company_name,
            joinedDate: user.joined_date,
            documentsUploaded: !!user.kyc_status,
        }));
    } catch (error) {
        console.error(
            'Failed to fetch users from API, using mock data:',
            error
        );
        users = mockUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            kycStatus: user.kycStatus,
            companyName: user.companyName,
            joinedDate: user.joinedDate,
            documentsUploaded: user.documentsUploaded,
            iban: user.iban,
            swift: user.swift,
        }));
    }

    // Filter users server-side
    let filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.companyName &&
                user.companyName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
    );

    // Filter by tab
    if (activeTab === 'pending') {
        filteredUsers = filteredUsers.filter((u) => u.kycStatus === 'pending');
    } else if (activeTab === 'approved') {
        filteredUsers = filteredUsers.filter((u) => u.kycStatus === 'approved');
    }

    const pendingCount = users.filter((u) => u.kycStatus === 'pending').length;
    const selectedUser = selectedUserId
        ? users.find((u) => u.id === selectedUserId)
        : null;

    const tabs = [
        { value: 'all', label: dict.marketplace.admin.usersKycPage.tabs.all },
        { value: 'pending', label: `${dict.marketplace.admin.usersKycPage.tabs.pending} (${pendingCount})` },
        { value: 'approved', label: dict.marketplace.admin.usersKycPage.tabs.approved },
    ];

    // Determine table headers based on active tab
    const showSubmittedColumn = activeTab === 'pending';
    const showApprovedColumn = activeTab === 'approved';
    const showKycStatusColumn = activeTab === 'all';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {dict.marketplace.admin.usersKycPage.title}
                </h1>
                <p className="text-muted-foreground">
                    {dict.marketplace.admin.usersKycPage.description}
                </p>
            </div>

            {/* Client-side search component */}
            <UsersKycSearch
                placeholder={
                    dict.marketplace.admin.usersKycPage.searchPlaceholder
                }
                defaultValue={searchQuery}
            />

            {/* Client-side tabs wrapper */}
            <URLTabs tabs={[
                { value: 'all', label: dict.marketplace.admin.usersKycPage.tabs.all },
                { value: 'pending', label: dict.marketplace.admin.usersKycPage.tabs.pending },
                { value: 'approved', label: dict.marketplace.admin.usersKycPage.tabs.approved },
            ]} defaultValue={activeTab} />

            <UsersKycTable
                lang={lang}
                dict={dict}
                searchQuery={searchQuery}
                activeTab={activeTab}
            />
        </div>
    );
}

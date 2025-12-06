import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { getUsersList, mapApiUserToUi } from '@/lib/api-client';
import { mockUsers, User } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { UsersKycSearch } from './users-kyc-search';
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
function KycBadge({ status, dict }: { status: DisplayUser['kycStatus']; dict: any }) {
    const badges = {
        approved: { label: dict.marketplace.admin.usersKycPage.status.approved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        pending: { label: dict.marketplace.admin.usersKycPage.status.pendingReview, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
        rejected: { label: dict.marketplace.admin.usersKycPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        not_submitted: { label: dict.marketplace.admin.usersKycPage.status.notSubmitted, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    };
    const config = badges[status];
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

// Server-side role badge component
function RoleBadge({ role }: { role: DisplayUser['role'] }) {
    const colors = {
        admin: 'bg-red-100 text-red-800',
        supplier: 'bg-blue-100 text-blue-800',
        retailer: 'bg-purple-100 text-purple-800',
    };
    return <Badge variant="default" className={`${colors[role]} hover:${colors[role]}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
}

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string; user?: string };
}

export default async function UsersKycPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';
    const selectedUserId = searchParams.user;

    // Fetch users from API, fallback to mock data
    let users: DisplayUser[] = [];
    try {
        const apiUsers = await getUsersList();
        users = apiUsers.map(user => ({
            id: String(user.id),
            name: user.username,
            email: user.email,
            role: (user.role === 'buyer' ? 'retailer' : user.role) as DisplayUser['role'],
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
        console.error('Failed to fetch users from API, using mock data:', error);
        users = mockUsers.map(user => ({
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
    let filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter by tab
    if (activeTab === 'pending') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'pending');
    } else if (activeTab === 'approved') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'approved');
    }

    const pendingCount = users.filter(u => u.kycStatus === 'pending').length;
    const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

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
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.usersKycPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.usersKycPage.description}</p>
            </div>

            {/* Client-side search component */}
            <UsersKycSearch
                placeholder={dict.marketplace.admin.usersKycPage.searchPlaceholder}
                defaultValue={searchQuery}
            />

            {/* Server-side tabs using URL params */}
            <div className="border-b w-full flex space-x-4">
                {tabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/${lang}/admin/users-kyc?tab=${tab.value}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`px-4 py-3 border-b-2 transition-colors ${activeTab === tab.value
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Server-rendered table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.name}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.email}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.company}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.role}</TableHead>
                            {showKycStatusColumn && (
                                <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.kycStatus}</TableHead>
                            )}
                            {showSubmittedColumn && (
                                <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.submitted}</TableHead>
                            )}
                            {showApprovedColumn && (
                                <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.approved}</TableHead>
                            )}
                            {!showSubmittedColumn && !showApprovedColumn && (
                                <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.joined}</TableHead>
                            )}
                            <TableHead className="font-semibold text-right">{dict.marketplace.admin.usersKycPage.table.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.companyName || '-'}</TableCell>
                                    <TableCell><RoleBadge role={user.role} /></TableCell>
                                    {showKycStatusColumn && (
                                        <TableCell><KycBadge status={user.kycStatus} dict={dict} /></TableCell>
                                    )}
                                    <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/${lang}/admin/users-kyc?tab=${activeTab}${searchQuery ? `&q=${searchQuery}` : ''}&user=${user.id}`}
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* KYC Dialog - client component for interactivity */}
            {selectedUser && (
                <KycDialog
                    user={selectedUser as any}
                    dict={dict}
                    lang={lang}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                />
            )}
        </div>
    );
}

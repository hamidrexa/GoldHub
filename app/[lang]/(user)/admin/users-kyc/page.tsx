import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Clock, CheckCircle } from 'lucide-react';
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
import { ServerTabs, ServerTab } from '@/components/ui/server-tabs';
import { UsersKycSearch } from './users-kyc-search';
import { KycDialog } from './kyc-dialog';

// Server-side KYC badge component
function KycBadge({ status, dict }: { status: User['kycStatus']; dict: any }) {
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
function RoleBadge({ role }: { role: User['role'] }) {
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

    // Filter users server-side
    let filteredUsers = mockUsers.filter(user =>
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

    const pendingCount = mockUsers.filter(u => u.kycStatus === 'pending').length;
    const selectedUser = selectedUserId ? mockUsers.find(u => u.id === selectedUserId) : null;

    const tabs: ServerTab[] = [
        { value: 'all', label: dict.marketplace.admin.usersKycPage.tabs.all, icon: Users, href: `/${lang}/admin/users-kyc?tab=all${searchQuery ? `&q=${searchQuery}` : ''}` },
        { value: 'pending', label: `${dict.marketplace.admin.usersKycPage.tabs.pending} (${pendingCount})`, icon: Clock, href: `/${lang}/admin/users-kyc?tab=pending${searchQuery ? `&q=${searchQuery}` : ''}` },
        { value: 'approved', label: dict.marketplace.admin.usersKycPage.tabs.approved, icon: CheckCircle, href: `/${lang}/admin/users-kyc?tab=approved${searchQuery ? `&q=${searchQuery}` : ''}` },
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
            <ServerTabs tabs={tabs} activeTab={activeTab} />

            {/* Server-rendered table */}
            <div className="rounded-lg border bg-white overflow-x-auto">
                <Table className="min-w-[700px]">
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
                    user={selectedUser}
                    dict={dict}
                    lang={lang}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                />
            )}
        </div>
    );
}

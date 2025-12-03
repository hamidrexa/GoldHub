import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard | GoldTrade',
    description: 'Gold and jewelry marketplace admin panel',
};

export default async function AdminPage({ params: { lang } }) {
    // Redirect to dashboard
    redirect(`/${lang}/admin/dashboard`);
}

import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata({ params: { lang } }): Promise<Metadata> {
    const dict = await getDictionary(lang);
    return {
        title: dict.marketplace.admin.title,
        description: dict.marketplace.admin.description,
    };
}

export default async function AdminPage({ params: { lang } }) {
    // Redirect to dashboard
    redirect(`/${lang}/admin/dashboard`);
}

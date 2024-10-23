import { ProfilePage } from '@/app/[lang]/(user)/profile/components/profile-page';
import { getDictionary } from '@/get-dictionary';
import { Metadata, ResolvingMetadata } from 'next';
import { Locale } from '@/i18n-config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AnnouncementAlert from '@/components/announcement-alert';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(params.lang);
    const seoTitle = 'حساب کاربری | طلانو';

    return {
        title: seoTitle,
        alternates: {
            canonical: `https://sahmeto.com${params.lang !== 'fa' ? `/${params.lang}` : ''}/profile`,
        },
    };
}

export default async function Profile({ params: { lang } }) {
    const dict = await getDictionary(lang);
    if (!cookies().get('token')) return redirect('/login');

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="profile" />
            <ProfilePage dict={dict} lang={lang} />
        </>
    );
}

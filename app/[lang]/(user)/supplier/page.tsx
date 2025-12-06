import { redirect } from 'next/navigation';

export default function SupplierPage({ params: { lang } }: { params: { lang: string } }) {
    redirect(`/${lang}/supplier/dashboard`);
}

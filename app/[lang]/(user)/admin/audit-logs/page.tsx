import { getDictionary } from '@/get-dictionary';
import AuditLogsClient from './audit-logs-client';

export default async function AuditLogsPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <AuditLogsClient dict={dict} />;
}

'use client';

import { PasswordEditForm } from '@/app/[lang]/(user)/profile/components/password-edit-form';

export function PasswordChangeForm({ lang, dict, setOpen }) {
    return <PasswordEditForm lang={lang} dict={dict} setOpen={setOpen} />;
}

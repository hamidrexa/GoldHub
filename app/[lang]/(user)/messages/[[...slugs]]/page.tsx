import {Locale} from '@/i18n-config';
import {getMessage} from '@/app/[lang]/(user)/messages/services/getMessage';
import {getLinksLang,} from '@/libs/utils';
import {notFound, redirect} from 'next/navigation';

type PageProps = {
    params: {
        slugs: string[];
        lang: Locale;
    };
};

const markets = ['crypto', 'tse'];
export default async function MessagePage({params: {slugs, lang}}: PageProps) {
    const market = markets.includes(slugs[0]) ? slugs[0] : null;
    const id = market ? slugs[1] : slugs[0];
    const message = await getMessage(market ?? 'tse', id, {
        lang,
    });
    if (!message) notFound();
    if (message) return redirect(`${getLinksLang(lang)}/message/${message.asset_signal_id}`);

}

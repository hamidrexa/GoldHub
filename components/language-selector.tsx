'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { LANGS, DEFAULT_LANG, stripLangFromPath } from '@/libs/lang';
import { ArabicFlag, TurkeyFlag, USAFlag } from '@/components/ui/flags';
import { cn } from '@/libs/utils';

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
    en: USAFlag,
    ar: ArabicFlag,
    tr: TurkeyFlag,
};

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const basePath = stripLangFromPath(pathname);

    const activeLang =
        LANGS.find(l => l.code === currentLang) ??
        LANGS.find(l => l.code === DEFAULT_LANG)!;

    const ActiveFlag = FLAG_MAP[activeLang.code];

    const changeLang = (lang: string) => {
        router.push(
            lang === DEFAULT_LANG ? basePath || '/' : `/${lang}${basePath}`
        );
    };

    return (
        <DropdownMenu>
            {/* ===== Trigger ===== */}
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="
                    my-2
                        flex items-center gap-2
                        px-2
                        text-white
                        hover:bg-gray-800/40
                    "
                >
                    <Globe className="h-4 w-4" />

                    {ActiveFlag && (
                        <ActiveFlag className="h-4 w-4 rounded-sm" />
                    )}

                    <span className="text-sm font-medium hidden md:inline">
                        {activeLang.label}
                    </span>
                </Button>
            </DropdownMenuTrigger>

            {/* ===== Dropdown ===== */}
            <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl bg-sidebar-bg text-white"
            >
                {LANGS.map(lang => {
                    const Flag = FLAG_MAP[lang.code];
                    const isActive = lang.code === activeLang.code;

                    return (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => changeLang(lang.code)}
                            className={cn(
                                `
                                flex items-center gap-3
                                rounded-md px-3 py-2
                                text-sm cursor-pointer
                                transition-colors
                                `,
                                isActive
                                    ? 'bg-gold-600/20 text-gold-400'
                                    : 'hover:bg-gray-700/40'
                            )}
                        >
                            {Flag && (
                                <Flag className="h-5 w-5 rounded-sm" />
                            )}
                            <span className="font-medium">
                                {lang.label}
                            </span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

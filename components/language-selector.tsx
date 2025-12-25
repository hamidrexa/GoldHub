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

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const basePath = stripLangFromPath(pathname);

    const changeLang = (lang: string) => {
        if (lang === DEFAULT_LANG) {
            router.push(basePath || '/');
        } else {
            router.push(`/${lang}${basePath}`);
        }
    };

    const activeLang =
        LANGS.find(l => l.code === currentLang) ??
        LANGS.find(l => l.code === DEFAULT_LANG)!;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-navy-700"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">{activeLang.label}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {LANGS.map(lang => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLang(lang.code)}
                        className="cursor-pointer"
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { usePrice } from '@/app/[lang]/(user)/(asset)/services/usePrice';
import { cn, currency, roundNumber } from '@/libs/utils';

const Holder = ({ title, price, isLoading, changePercent, market, lang }) => {
    return (
        <div className="flex items-center gap-1.5 text-sm leading-none">
            {title}
            {!isLoading ? (
                <>
                    {changePercent > 0 ? (
                        <ChevronsUp
                            width={18}
                            height={18}
                            color="#07BB61"
                            strokeWidth={2}
                        />
                    ) : (
                        <ChevronsDown
                            width={18}
                            height={18}
                            color="#F31616"
                            strokeWidth={2}
                        />
                    )}
                    <span
                        className={cn(
                            'text-xl font-bold leading-none',
                            changePercent > 0
                                ? 'text-neutral-400'
                                : 'text-neutral-600'
                        )}
                        dir="ltr"
                    >
                        {changePercent}%
                    </span>
                    <span className="text-2xl leading-none">
                        {currency(price, market, lang)}
                    </span>
                </>
            ) : (
                <span
                    className="h-5 animate-pulse rounded-sm bg-gray-200"
                    style={{ width: '78px' }}
                />
            )}
        </div>
    );
};

export function Price({ market, dict, id, serverPrice, lang }) {
    const { price: clientPrice, isLoading, error } = usePrice({ id });
    const [price, setPrice] = useState(serverPrice);

    useEffect(() => {
        if (Object.keys(clientPrice).length) setPrice(clientPrice);
    }, [clientPrice]);

    return (
        <div className="flex items-center gap-5">
            <Holder
                title={market === 'crypto' ? dict.price : dict.lastTransaction}
                isLoading={!serverPrice}
                price={
                    market === 'crypto' ? price.price?.USD : price.price?.TOMAN
                }
                changePercent={roundNumber(
                    market === 'crypto'
                        ? price.change_24h?.USD
                        : price.change_24h?.TOMAN,
                    2
                )}
                market={market}
                lang={lang}
            />
        </div>
    );
}

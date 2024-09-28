'use client';

import { useTopPublishers } from '@/services/useTopPublishers';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getImage } from '@/libs/utils';

export function GroupAvatar() {
    let tops = [];
    const { tops: crypto, isLoading: cryptoLoading } = useTopPublishers({
        type: 'cryptocurrency',
        limit: 2,
    });
    const { tops: ticker, isLoading: tickerLoading } = useTopPublishers({
        type: 'signal',
        limit: 2,
    });
    const topPublisher =
        crypto && ticker
            ? [
                  [...crypto].map((asset) => ({
                      ...asset,
                      image: !!asset.photo.thumbnail
                          ? asset.photo.thumbnail
                          : `https://sahmeto.com/img/sources/${asset.account_type}.png`,
                  })),
                  [...ticker].map((asset) => ({
                      ...asset,
                      image: !!asset.photo.thumbnail
                          ? asset.photo.thumbnail
                          : `https://sahmeto.com/img/sources/${asset.account_type}.png`,
                  })),
              ].forEach((subArray) => {
                  tops = [...tops, ...subArray];
              })
            : [];
    return !cryptoLoading && !tickerLoading ? (
        <div className="inline-block whitespace-normal">
            {[...tops].map((publisher, index) => (
                <div
                    key={index}
                    className="-mx-3 inline-block items-center rounded-full border-2 border-neutral-700 bg-transparent bg-white p-0.5 first:-mx-2 last:-mx-1"
                    style={{ zIndex: 10 * index }}
                >
                    <Image
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = `/img/sources/${publisher.account_type}.png`;
                        }}
                        width={32}
                        height={32}
                        src={getImage(publisher)}
                        alt={publisher.name}
                        className="h-8 w-8 min-w-8 rounded-full object-cover "
                        unoptimized
                    />
                </div>
            ))}
        </div>
    ) : (
        <div className="inline-block whitespace-nowrap">
            {[1, 2, 3, 4].map((item, index) => (
                <div
                    key={index}
                    className="-mx-3 inline-block items-center rounded-full border-2 bg-transparent bg-white p-0.5 first:-mx-2 last:-mx-1"
                    style={{ zIndex: 10 * index }}
                >
                    <Skeleton className="h-8 w-8 min-w-8 rounded-full object-cover " />
                </div>
            ))}
        </div>
    );
}

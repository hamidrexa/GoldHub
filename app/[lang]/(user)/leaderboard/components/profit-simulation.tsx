import { cn } from '@/libs/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { InfoIcon } from 'lucide-react';
import React from 'react';
import { getNumberRoa, Roi } from '@/components/roi';
import { componentFormat } from '@/libs/stringFormatter';
import { getTopPublishersV2 } from '@/app/[lang]/(user)/leaderboard/services/getTopPublishersV2';
import { Publisher } from '@/components/publisher';
import { ProfitSimulationPricing } from '@/app/[lang]/(user)/leaderboard/components/profit-simulation-pricing';

export async function ProfitSimulation({ dict, lang }) {
    const res = await getTopPublishersV2();
    const profit =
        (res.publisher
            .map(({ performances }) => performances['180d'].return)
            .reduce((acc, cur) => acc + cur) /
            res.publisher.length) *
        100;
    const indexProfit = res.publisher_by_pk.performances['180d'].return * 100;

    return (
        <div className="mb-5 flex w-full flex-col gap-5 rounded-md border border-gray-100 bg-white p-5 text-neutral-800 md:flex-row md:px-10 md:py-5">
            <div className="flex w-full flex-col">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                    {dict.bestCryptoPerformance}
                    <Dialog>
                        <DialogTrigger>
                            <InfoIcon
                                strokeWidth={1.5}
                                width={20}
                                height={20}
                            />
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <p className="mt-6 text-lg font-medium">
                                {componentFormat(
                                    dict.profitSimulate,
                                    {},
                                    <Roi number={profit} sign="٪" />
                                )}
                            </p>
                            <div className="max-h-80 space-y-3 overflow-auto">
                                {res.publisher.map((publisher) => (
                                    <div
                                        key={publisher.id}
                                        className="flex items-center justify-between"
                                    >
                                        <Publisher
                                            lang={lang}
                                            dict={dict}
                                            publisher={publisher}
                                            elements={{
                                                rank: false,
                                            }}
                                        />
                                        <span>
                                            {dict.sixMonthPerformance}
                                            <Roi
                                                number={
                                                    publisher.performances[
                                                        '180d'
                                                    ].return * 100
                                                }
                                                sign="٪"
                                            />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                    <div
                        className={cn(
                            'flex flex-col border-r-4 pr-2',
                            getNumberRoa(profit, {
                                colors: {
                                    profit: 'border-r-neutral-400',
                                    loss: 'border-r-neutral-600',
                                    neutral: 'border-r-neutral-200',
                                },
                            }).color
                        )}
                    >
                        <span className="font-medium">
                            {dict.top10SixMonthPer}
                        </span>
                        <Roi
                            className="mt-3.5 text-4xl font-bold leading-[0.5]"
                            number={profit}
                            sign="٪"
                        />
                    </div>
                    <div
                        className={cn(
                            'flex flex-col border-r-4 pr-2',
                            getNumberRoa(indexProfit, {
                                colors: {
                                    profit: 'border-r-neutral-400',
                                    loss: 'border-r-neutral-600',
                                    neutral: 'border-r-neutral-200',
                                },
                            }).color
                        )}
                    >
                        <span className="font-medium">بیت کوین(BTC)</span>
                        <Roi
                            className="mt-3.5 text-4xl font-bold leading-[0.5]"
                            number={indexProfit}
                            sign="٪"
                        />
                    </div>
                </div>
            </div>
            <ProfitSimulationPricing lang={lang} />
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Disclaimer } from '@/components/disclaimer';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { roundNumber } from '@/libs/utils';
import { Roi } from '@/components/roi';

const updatePerformance = (data) => {
    // let performance = 1;
    // let indexPerformance = 1;
    //
    // const updatedData = data.map((obj) => {
    //     performance *= 1 + obj.performance;
    //     indexPerformance *= 1 + obj.index_performance;
    //
    //     return {
    //         ...obj,
    //         performance: roundNumber((performance - 1) * 100),
    //         index_performance: roundNumber((indexPerformance - 1) * 100),
    //     };
    // });
    //
    return data;
};

export function LandingPage({
    dict,
    lang,
    tsePerformance,
    tseIndexPerformance,
    cryptoPerformance,
    cryptoIndexPerformance,
    tsePublisher,
    cryptoPublisher,
}) {
    const tseIndex = tseIndexPerformance.map(
        ({ avrage_performance }) => avrage_performance
    );
    const tseData = [
        {
            month_title: '',
            performance: 0,
            index_performance: 0,
        },
    ].concat(
        updatePerformance(
            tsePerformance.map(({ avrage_performance, month_title }, i) => ({
                month_title,
                performance: avrage_performance,
                index_performance: tseIndex[i],
            }))
        )
    );
    const cryptoIndex = cryptoIndexPerformance.map(
        ({ avrage_performance }) => avrage_performance
    );
    const cryptoData = [
        {
            month_title: '',
            performance: 0,
            index_performance: 0,
        },
    ].concat(
        updatePerformance(
            cryptoPerformance.map(({ avrage_performance, month_title }, i) => ({
                month_title,
                performance: avrage_performance,
                index_performance: cryptoIndex[i],
            }))
        )
    );

    return (
        <>
            <div className="bg-gray-900 py-16 text-white">
                <div className="flex flex-col justify-evenly gap-10 px-6 md:flex-row md:px-32">
                    <div className="pt-20">
                        <h1 className="mb-4 text-3xl font-bold md:text-5xl">
                            انتخاب های سهمتو
                        </h1>
                        <p className="mb-5 max-w-2xl text-lg md:text-xl">
                            به دنبال انتخاب های برتر سهمتو. مستقیم به صندوق
                            ورودی شما تحویل داده می شود. به دنبال انتخاب های
                            برتر سهمتو. مستقیم به صندوق ورودی شما تحویل داده می
                            شود.
                        </p>
                        <Button
                            variant="secondary"
                            size="xl"
                            className="w-full md:w-fit"
                        >
                            انتخاب ها را دریافت کنید
                        </Button>
                    </div>
                    <div className="pl-10">
                        <div>
                            <h2 className="mb-5 text-center text-3xl font-bold">
                                عملکرد بورس
                            </h2>
                            <div className="flex items-center gap-8">
                                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[10px] border-white bg-gray-100 p-6 text-center text-neutral-800 shadow-inner">
                                    <div className="text-2xl font-bold">
                                        سهمتو
                                    </div>
                                    <Roi
                                        className="mt-2 text-2xl font-black"
                                        number={roundNumber(
                                            tsePublisher.gain365d * 100
                                        )}
                                        sign="٪"
                                    />
                                </div>
                                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[10px] border-white bg-gray-100 p-6 text-center text-neutral-800 shadow-inner">
                                    <div className="text-2xl font-bold">
                                        شاخص
                                    </div>
                                    <Roi
                                        className="mt-2 text-2xl font-black"
                                        number={roundNumber(
                                            tsePublisher.gain365d * 100
                                        )}
                                        sign="٪"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="mb-5 text-center text-3xl font-bold">
                                عملکرد ارزدیجیتال
                            </h2>
                            <div className="flex items-center gap-8">
                                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[10px] border-white bg-gray-100 p-6 text-center text-neutral-800 shadow-inner">
                                    <div className="text-2xl font-bold">
                                        سهمتو
                                    </div>
                                    <Roi
                                        className="mt-2 text-2xl font-black"
                                        number={roundNumber(
                                            cryptoPublisher.gain365d * 100
                                        )}
                                        sign="٪"
                                    />
                                </div>
                                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[10px] border-white bg-gray-100 p-6 text-center text-neutral-800 shadow-inner">
                                    <div className="text-2xl font-bold">
                                        بیت‌کوین
                                    </div>
                                    <Roi
                                        className="mt-2 text-2xl font-black"
                                        number={roundNumber(
                                            cryptoPublisher.gain365d * 100
                                        )}
                                        sign="٪"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-6xl p-2.5">
                <div className="mt-20">
                    <h2 className="mb-4 mt-10 text-2xl font-semibold">
                        چگونه به عملکرد برتر دست یافته ایم؟
                    </h2>
                    <p className="mb-10">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت
                        چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
                        بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و
                        برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع
                        با.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={tseData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 30,
                                bottom: 0,
                            }}
                        >
                            <XAxis
                                dataKey="month_title"
                                tickLine={false}
                                axisLine={false}
                                interval="equidistantPreserveStart"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                                itemStyle={{
                                    fontWeight: '500',
                                }}
                                formatter={(value) => value + '%'}
                            />
                            <Line
                                name="بورس"
                                type="natural"
                                dataKey="index_performance"
                                stroke="#84859C"
                                strokeWidth={4}
                                dot={false}
                            />
                            <Line
                                name="سهمتو"
                                type="natural"
                                dataKey="performance"
                                stroke="#10EDC5"
                                strokeWidth={4}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-10"></div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={cryptoData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 30,
                                bottom: 0,
                            }}
                        >
                            <XAxis
                                dataKey="month_title"
                                tickLine={false}
                                axisLine={false}
                                interval="equidistantPreserveStart"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                                itemStyle={{
                                    fontWeight: '500',
                                }}
                                formatter={(value) => value + '%'}
                            />
                            <Line
                                name="بیت‌کوین"
                                type="natural"
                                dataKey="performance"
                                stroke="#84859C"
                                strokeWidth={4}
                                dot={false}
                            />
                            <Line
                                name="سهمتو"
                                type="natural"
                                dataKey="index_performance"
                                stroke="#10EDC5"
                                strokeWidth={4}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <h2 className="mb-4 mt-20 text-2xl font-semibold">
                    {dict.questionAsk}
                </h2>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                >
                    <AccordionItem value="1" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n1.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n1.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n2.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n2.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n3.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n3.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n4.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n4.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n5.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n5.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Disclaimer className="my-20" />
            </div>
        </>
    );
}

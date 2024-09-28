'use client';
import {
    Area,
    AreaChart,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import React, { Fragment } from 'react';
import { Locale } from '@/i18n-config';
import { currency } from '@/libs/utils';

type chartProps = {
    width: string | number;
    height: string | number;
    xDataKey: string;
    yDataKey: string;
    color: string;
    data: { [key: string]: number | string }[];
    name?: string;
    lang: Locale;
    tooltip?: boolean;
    market: any;
};

const SparkLine = ({
    width,
    height,
    xDataKey,
    yDataKey,
    data,
    color,
    name,
    lang,
    tooltip = true,
    market,
}: chartProps) => {
    const highlightedPoint = data.filter(
        (item) => item.redPoint || item.greenPoint
    );

    const f = Object.values(data.map((item) => item[yDataKey])).map(
        (num) => num as number
    );

    const min = Math.min(...f);
    const max = Math.max(...f);

    return (
        <ResponsiveContainer width={width} height={height}>
            <AreaChart
                data={data}
                margin={{
                    top: 5,
                    left: 0,
                    right: 0,
                    bottom: 5,
                }}
            >
                <XAxis
                    dataKey={xDataKey}
                    domain={['dataMin', 'dataMax']}
                    hide
                />
                <YAxis
                    dataKey={yDataKey}
                    domain={['dataMin', 'dataMax']}
                    hide
                />
                {tooltip && (
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                        itemStyle={{
                            color: '#0C0E3C',
                            fontWeight: '500',
                        }}
                        formatter={(value) =>
                            typeof value === 'number'
                                ? currency(value, market, lang)
                                : value
                        }
                    />
                )}
                <Area
                    name={name}
                    type="monotone"
                    dataKey={yDataKey}
                    stroke={color}
                    strokeWidth={1}
                    fillOpacity={1}
                    fill={`url(#${yDataKey})`}
                />
                <defs>
                    <linearGradient
                        id={yDataKey}
                        x1="230.588"
                        y1="-29.171"
                        x2="244.953"
                        y2="100.61"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={color} stopOpacity="0.31" />
                        <stop offset="1" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {highlightedPoint.length &&
                    highlightedPoint.map((item, index) => (
                        <Fragment key={index}>
                            <ReferenceLine
                                stroke={item.greenPoint ? '#07BB61' : '#F31616'}
                                segment={[
                                    {
                                        x: item[xDataKey],
                                        y: max,
                                    },
                                    {
                                        x: item[xDataKey],
                                        y: min,
                                    },
                                ]}
                                strokeWidth={1}
                            />
                            <ReferenceDot
                                x={item[xDataKey]}
                                y={item[yDataKey]}
                                r={4}
                                fill="white"
                                strokeWidth={1}
                                stroke={item.greenPoint ? '#07BB61' : '#F31616'}
                            />
                        </Fragment>
                    ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SparkLine;

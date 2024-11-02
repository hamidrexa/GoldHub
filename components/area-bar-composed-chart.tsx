'use client';

import {
    Area,
    Bar,
    ComposedChart,
    Legend,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import React, { Fragment } from 'react';
import { Locale } from '@/i18n-config';
import { roundNumber } from '@/libs/utils';

dayjs.extend(jalaliday);

export function AreaBarComposedChart({
    xDataKey,
    yDataKey = null,
    barDataKey,
    barColor,
    barName,
    data,
    name,
    color,
    dir,
    interval = 0,
    lang,
    dot,
    isAnimationActive,
    market,
    barChart
}: {
    dir: string;
    xDataKey: string;
    yDataKey?: any;
    color: string;
    name: string;
    barDataKey: string;
    barColor: string;
    barName: any;
    data: any;
    interval?: any;
    lang: Locale;
    dot?: boolean;
    isAnimationActive?: boolean;
    market: string;
    barChart: boolean
}) {
    const highlightPoint = data.filter((item) => item.viewPoint);

    const CustomizedLegend = (props: { payload: any }) => {
        const { payload } = props;

        return (
            <div className="mt-4 flex items-center justify-center">
                {payload.map((entry, index) => (
                    <Fragment key={`item-${index}`}>
                        <span className="mx-2 font-medium ">{entry.value}</span>
                        {entry.dataKey === 'return_price' && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="46"
                                height="13"
                                viewBox="0 0 46 13"
                                fill="none"
                                className="inline"
                            >
                                <path
                                    d="M0.671876 12.4936L15.6622 2.36217L31.1827 11.1249L45.5 1.05468"
                                    stroke="#84859C"
                                />
                            </svg>
                        )}
                        {(entry.dataKey === 'buy_signals_count' ||
                            entry.dataKey === 'sell_signals_count') && (
                                <svg
                                    width="9"
                                    height="30"
                                    viewBox="0 0 9 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.67188 29.376C2.46274 29.376 0.671875 27.5851 0.671875 25.376L0.671875 4.17236C0.671875 1.96322 2.46274 0.172363 4.67188 0.172363C6.88101 0.172363 8.67188 1.96322 8.67188 4.17236L8.67188 25.376C8.67188 27.5851 6.88101 29.376 4.67188 29.376Z"
                                        fill={
                                            entry.dataKey === 'buy_signals_count'
                                                ? '#10EDC5'
                                                : '#DB2777'
                                        }
                                    />
                                </svg>
                            )}
                    </Fragment>
                ))}
            </div>
        );
    };
    const CustomizedAxisTick = ({
        x,
        y,
        stroke,
        payload,
    }: {
        x?: any;
        y?: any;
        stroke?: any;
        payload?: any;
    }) => {
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={0}
                    dx={2}
                    textAnchor={dir === 'rtl' ? 'start' : 'end'}
                    fill="#8E8FB2"
                    transform="rotate(-90)"
                    fontSize={12}
                    fontStyle="normal"
                >
                    {payload.value}
                </text>
            </g>
        );
    };
    const CustomReferenceDot = (props) => {
        return (
            <>
                <circle cx={props.cx} cy={props.cy} r="4" fill={color} />
                <circle
                    cx={props.cx}
                    cy={props.cy}
                    r="4"
                    fill={color}
                    opacity="0.6"
                >
                    <animate
                        attributeName="r"
                        values="4;12;4"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.6;0;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>
            </>
        );
    };

    return (
        <div className="h-full w-full" dir={dir}>
            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                    data={data}
                    margin={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    {xDataKey && (
                        <XAxis
                            dataKey={xDataKey}
                            tickCount={14}
                            interval={interval}
                            tick={<CustomizedAxisTick />}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin', 'dataMax']}
                        />
                    )}
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'gray',
                        }}
                        itemStyle={{
                            color: '#0C0E3C',
                            fontWeight: '500',
                        }}
                        formatter={(value) =>
                            roundNumber(
                                Number(value),
                                typeof value === 'number' && value > 1 ? 0 : 10
                            )
                        }
                    />
                    <Legend
                        content={CustomizedLegend}
                        formatter={(value) => (
                            <span className="text-sm font-medium not-italic text-black ">
                                {value}
                            </span>
                        )}
                        verticalAlign="bottom"
                        align="center"
                        height={50}
                        wrapperStyle={{ bottom: '-20px' }}
                    />
                    {yDataKey && (
                        <YAxis
                            hide
                            domain={[
                                0,
                                (dataMax: number) => Math.ceil(dataMax * 2),
                            ]}
                            axisLine={false}
                            tickLine={false}
                            id="left"
                            yAxisId="left"
                            tickCount={15}
                            allowDecimals={false}
                            fontSize={14}
                            textAnchor={dir === 'rtl' ? 'start' : 'end'}
                        />
                    )}
                    {yDataKey && (
                        <YAxis
                            hide
                            id="right"
                            yAxisId="right"
                            axisLine={false}
                            tickCount={12}
                            orientation="right"
                            tickLine={false}
                            domain={[
                                (dataMin: number) => dataMin * 0.9,
                                (dataMax: number) => dataMax * 1.05,
                            ]}
                            fontSize={14}
                            textAnchor={dir === 'rtl' ? 'end' : 'start'}
                        />
                    )}
                    {barChart && <Bar
                        dataKey={barDataKey}
                        fill={barColor}
                        name={barName}
                        radius={20}
                        yAxisId="left"
                        barSize={11}
                        isAnimationActive={isAnimationActive}
                    />}
                    {highlightPoint.length &&
                        highlightPoint.map((item, index) => (
                            <ReferenceDot
                                key={index}
                                x={item[xDataKey]}
                                y={item[yDataKey]}
                                yAxisId="right"
                                shape={CustomReferenceDot}
                            />
                        ))}
                    {yDataKey && (
                        <Area
                            yAxisId="right"
                            name={name}
                            type="monotone"
                            dataKey={yDataKey}
                            stroke={color}
                            strokeWidth={1}
                            fillOpacity={1}
                            fill={`url(#area)`}
                            isAnimationActive={isAnimationActive}
                        />
                    )}
                    <defs>
                        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                            <stop stopColor={color} stopOpacity="0.31" />
                            <stop
                                offset="1"
                                stopColor={color}
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

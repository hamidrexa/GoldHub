'use client';

import React from 'react';
import {
    Bar,
    BarChart as BarChartComponent,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { roundNumber } from '@/libs/utils';

export function BarChart({
    width,
    height,
    data,
    name,
    xDataKey,
    yDataKey,
    lang,
    dict,
    market,
}) {
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
    const dataMax = Math.max(
        ...yDataKey
            .flatMap((key) => data.map((item) => Math.abs(item[key])))
            .filter((x) => x)
    );
    const Colors = [
        {
            firstColor: '#10EDC5',
            secondColor: '#F31616',
        },
        {
            firstColor: '#84859C',
            secondColor: '#84859C',
        },
    ];

    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChartComponent
                data={data}
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 21,
                }}
            >
                <XAxis
                    interval={0}
                    dataKey={xDataKey}
                    axisLine={false}
                    tickLine={false}
                    tick={<CustomizedAxisTick />}
                />
                {yDataKey.map((key, index) => (
                    <YAxis
                        key={key}
                        dataKey={key}
                        axisLine={false}
                        tickLine={false}
                        yAxisId={key}
                        domain={[-dataMax, dataMax]}
                        hide
                    />
                ))}
                <Tooltip
                    contentStyle={{
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}
                    itemStyle={{
                        color: '#0C0E3C',
                    }}
                    cursor={false}
                    formatter={(value) =>
                        value === 'no data'
                            ? `${dict.noData}`
                            : roundNumber(Number(value), 10)
                    }
                />
                {yDataKey.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        background={{ fill: '#E2E6E9', radius: 100 }}
                        radius={100}
                        barSize={yDataKey?.length > 1 ? 9 : 11}
                        yAxisId={key}
                        name={name[i]}
                    >
                        {data.map((entry, j) => (
                            <Cell
                                key={`cell-${j}`}
                                fill={
                                    entry[key] > 0
                                        ? Colors[i].firstColor
                                        : Colors[i].secondColor
                                }
                            />
                        ))}
                    </Bar>
                ))}
            </BarChartComponent>
        </ResponsiveContainer>
    );
}

'use client';

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import React, { useEffect, useState } from 'react';
import { roundNumber } from '@/libs/utils';
import { usePerformanceHistory } from '@/app/[lang]/(user)/publisher/services/usePerformanceHistory';

const updatePerformance = (data) => {
    let performance = 1;
    let indexPerformance = 1;

    const updatedData = data.map((obj) => {
        performance *= 1 + obj.performance;
        indexPerformance *= 1 + obj.index_performance;

        return {
            ...obj,
            performance: roundNumber((performance - 1) * 100),
            index_performance: roundNumber((indexPerformance - 1) * 100),
        };
    });

    return updatedData;
};

export function ProfitComparedWithIndex({ id }) {
    const {
        performanceHistory: { chart_result: performance },
    } = usePerformanceHistory(id);
    const {
        performanceHistory: { chart_result: indexPerformance },
    } = usePerformanceHistory(id, {
        chart_type: 'index',
    });
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!performance || !indexPerformance) return;

        const index = indexPerformance.map(
            ({ avrage_performance }) => avrage_performance
        );
        const data = [
            {
                month_title: '',
                performance: 0,
                index_performance: 0,
            },
        ].concat(
            updatePerformance(
                performance.map(({ avrage_performance, month_title }, i) => ({
                    month_title,
                    performance: avrage_performance,
                    index_performance: index[i],
                }))
            )
        );
        setData(data);
    }, [performance, indexPerformance]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
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
                    name="شاخص کل"
                    type="natural"
                    dataKey="index_performance"
                    stroke="#84859C"
                    strokeWidth={4}
                    dot={false}
                />
                <Line
                    name="تریدر"
                    type="natural"
                    dataKey="performance"
                    stroke="#10EDC5"
                    strokeWidth={4}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

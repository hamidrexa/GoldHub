'use client';

import {
    Cell,
    Legend,
    Pie,
    PieChart as PieChartComponent,
    ResponsiveContainer,
} from 'recharts';
import React, { useState } from 'react';
import { roundNumber } from '@/libs/utils';
import {Empty} from "@/components/empty";

export function PieChart({ className = '', width, height, data, dataKey }) {
    const COLORS = ['#0C0E3C', '#0D3857', '#0E6270', '#0FB6A3', '#10EDC5'];
    const [selectedPart, setSelectedPart] = useState(null);
    const mostSuggestedSymbols = data.slice(0, 4);
    const otherSuggestedSymbols = data
        .slice(4)
        .map((item) => {
            return item.percent;
        })
        .reduce((acc, cur) => {
            return acc + cur;
        }, 0);
    const displayData = [
        ...mostSuggestedSymbols,
        ...(mostSuggestedSymbols.length > 3 && otherSuggestedSymbols > 0
            ? [
                  {
                      other: true,
                      [dataKey]: roundNumber(otherSuggestedSymbols, 2),
                  },
              ]
            : []),
    ];

    const onMouseEnterHandler = (_, index) => {
        setSelectedPart(index);
    };
    const onMouseLeaveHandler = () => {
        setSelectedPart(null);
    };
    const active = (index) => {
        return selectedPart === null ? 1 : selectedPart === index ? 1 : 0.4;
    };
    const CustomLegend = (chartProps: { payload: any }) => {
        const { payload } = chartProps;

        return (
            <div className="h-40 overflow-auto">
                {payload.map((entry, index, value) => (
                    <div
                        className="mt-1 flex items-center justify-end gap-2"
                        onMouseEnter={() => onMouseEnterHandler(entry, index)}
                        onMouseLeave={onMouseLeaveHandler}
                        onTouchStart={() => onMouseEnterHandler(entry, index)}
                        onTouchEnd={onMouseLeaveHandler}
                        key={index}
                    >
                        <span className="whitespace-nowrap text-base font-black">
                            {!entry.payload.other
                                ? entry.value
                                : `${data.length - 4} مورد دیگر`}
                        </span>
                        <span className="whitespace-nowrap text-base font-black">
                            {!entry.other
                                ? entry.payload.value
                                : otherSuggestedSymbols}
                            %
                        </span>
                        <svg
                            className="min-w-fit"
                            width="37"
                            height="25"
                            viewBox="0 0 37 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="0.857422"
                                y="0.3927"
                                width="35.2844"
                                height="23.7802"
                                rx="8.91758"
                                fill={entry.color}
                                opacity={active(index)}
                            />
                        </svg>
                    </div>
                ))}
            </div>
        );
    };

    return (
       <div className="mx-auto w-full max-w-sm">
            <ResponsiveContainer
                className={className}
                width={width}
                height={height}
            >
                <PieChartComponent
                    margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <Pie
                        data={displayData}
                        paddingAngle={3}
                        dataKey={dataKey}
                        outerRadius={75}
                        innerRadius={65}
                        cornerRadius={5}
                        onMouseEnter={onMouseEnterHandler}
                        onMouseLeave={onMouseLeaveHandler}
                        onTouchStart={onMouseEnterHandler}
                        onTouchEnd={onMouseLeaveHandler}
                    >
                        {displayData.map((item, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                                style={{
                                    opacity: active(index),
                                }}
                            />
                        ))}
                    </Pie>
                    <Legend
                        content={CustomLegend}
                        verticalAlign="middle"
                        align="left"
                        layout="vertical"
                    />
                </PieChartComponent>
            </ResponsiveContainer>
        </div>
    );
}

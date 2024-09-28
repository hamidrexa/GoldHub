import React from 'react';

const cleanPercentage = (percentage: number): number => {
    const tooLow = !Number.isFinite(+percentage) || percentage < 0;
    const tooHigh = percentage > 100;
    return tooLow ? 0 : tooHigh ? 100 : +percentage;
};
const Circle: React.FC<{
    color: string;
    pct: number | undefined;
}> = ({ color, pct }) => {
    const r = 45;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct!) * circ) / 100;

    return (
        <circle
            r={r}
            cx={100}
            cy={100}
            fill="transparent"
            stroke={strokePct !== circ ? color : ''}
            strokeWidth={'0.5rem'}
            strokeDasharray={circ}
            strokeDashoffset={pct ? strokePct : 0}
            strokeLinecap="round"
        ></circle>
    );
};
const Text: React.FC<{
    percentage: number;
}> = ({ percentage }) => {
    return (
        <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={'1.125em'}
        >
            {percentage.toFixed(0)}%
        </text>
    );
};

const CircularProgressBar: React.FC<{
    percentage: number;
    color: string;
}> = ({ percentage, color }) => {
    const pct = cleanPercentage(percentage);
    return (
        <svg width={200} height={200}>
            <g transform={`rotate(-90 ${'100 100'})`}>
                <Circle color="#84859C" pct={undefined} />
                <Circle color={color} pct={pct} />
            </g>
            {/*<Text percentage={pct} />*/}
        </svg>
    );
};

export default CircularProgressBar;

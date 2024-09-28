'use client';

import React from 'react';

type cardProp = {
    title: string;
    text?: any;
    icon: React.ReactNode;
};

export default function ContentCard({ title, text, icon }: cardProp) {
    return (
        <div className="flex max-w-80 flex-col justify-center gap-8 rounded-md p-6 text-justify hover:cursor-default">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                {icon}
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="text-center text-base">{text}</div>
        </div>
    );
}

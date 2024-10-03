import React from 'react';

export function LinearProgress({
    title,
    description,
    completeDescription,
    progress,
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-lg bg-neutral-700 p-6 text-neutral-800 lg:flex-row-reverse">
            <div className="w-full space-y-4">
                <div className="flex w-full !justify-between text-base font-semibold">
                    <span>{title}</span>
                    <span>{progress}%</span>
                </div>
                <div className=" flex w-full gap-3">
                    <span
                        className={`h-2 w-1/4 rounded-lg ${
                            progress >= 25 ? 'bg-neutral-800' : 'bg-gray-300'
                        }`}
                    />
                    <span
                        className={`h-2 w-1/4 rounded-lg ${
                            progress >= 50 ? 'bg-neutral-800' : 'bg-gray-300'
                        }`}
                    />
                    <span
                        className={`h-2 w-1/4 rounded-lg ${
                            progress >= 75 ? 'bg-neutral-800' : 'bg-gray-300'
                        }`}
                    />
                    <span
                        className={`h-2 w-1/4 rounded-lg ${
                            progress === 100 ? 'bg-neutral-800' : 'bg-gray-300'
                        }`}
                    />
                </div>
            </div>
            <div className="w-full text-justify text-base tracking-tight">
                {progress < 100 ? (
                    <span>{description}</span>
                ) : (
                    <span>{completeDescription}</span>
                )}
            </div>
        </div>
    );
}

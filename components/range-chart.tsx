import { cn, currency, formatPrice } from '@/libs/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';
import { sum } from 'lodash';

export function RangeChart({
    lang,
    dict,
    barData,
    sliderLength,
    minValue,
    maxValue,
    avgValue,
    currValue,
    loading,
    market,
}) {
    const realMin = !!minValue ? minValue : 0.5 * currValue;
    const realMax = !!maxValue ? maxValue : 1.5 * currValue;
    const realAvg = !!avgValue ? avgValue : currValue;
    const squares = [realMin, currValue, realAvg, realMax].map((number) =>
        Math.pow(number, 2)
    );
    const dev = Math.sqrt(sum(squares));
    const norman = [realMin, currValue, realAvg, realMax].map(
        (number) => number / dev
    );
    const distance2 = Math.abs(realAvg - currValue);

    return (
        <div className={cn('mx-auto my-8 max-w-sm', { 'blur-md': loading })}>
            <SliderPrimitive.Root
                className={cn(
                    'relative flex w-full touch-none select-none items-center pb-12'
                )}
                dir="ltr"
                value={[
                    norman[0],
                    Math.min(norman[1], norman[2]),
                    Math.max(norman[1], norman[2]),
                    norman[3],
                ]}
                min={norman[0]}
                max={norman[3]}
                step={Math.min(
                    Math.min(realAvg, currValue) - realMin,
                    distance2,
                    realMax - Math.max(realAvg, currValue)
                )}
                // minStepsBetweenThumbs={
                //     0.0001 * Math.min(realAvg, currValue) - realMin
                // }
                disabled
            >
                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-400 shadow-light">
                    <SliderPrimitive.Range className="absolute h-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative block h-3 w-3 rounded-full border-2 border-gray-700 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <span className="absolute left-1/2 top-7 flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-[14px] font-medium leading-normal text-neutral-200">
                        <span className="text-neutral-800" dir="ltr">
                            {!!minValue
                                ? currency(formatPrice(minValue), market, lang)
                                : '-'}
                            {/*{market === 'tse' ? 'ریال' : '$'}*/}
                        </span>
                        کف قیمت
                    </span>
                </SliderPrimitive.Thumb>
                {realAvg < currValue ? (
                    <>
                        <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative  block h-5 w-5 rounded-full border-2 border-teal-600 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <span className="absolute bottom-[18px] left-1/2 flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-xl font-medium leading-normal text-neutral-200 md:text-[18px]">
                                <span
                                    className={
                                        currValue > avgValue
                                            ? 'text-neutral-600'
                                            : 'text-neutral-400'
                                    }
                                    dir="ltr"
                                >
                                    {!!avgValue
                                        ? currency(
                                              formatPrice(avgValue),
                                              market,
                                              lang
                                          )
                                        : 'داده ناکافی'}
                                    {/*{market === 'tse' ? 'ریال' : '$'}*/}
                                </span>
                                <span>قیمت میانگین</span>
                                <div className="h-12 w-[2px] bg-neutral-200"></div>
                            </span>
                        </SliderPrimitive.Thumb>
                        <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative  block h-5 w-5 rounded-full border-2 border-teal-600 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <span className="absolute left-1/2 top-[18px] flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-xl font-medium leading-normal text-neutral-200 md:text-[18px]">
                                <div className="h-12 w-[2px] bg-neutral-200"></div>
                                <span className="text-neutral-800" dir="ltr">
                                    {currency(
                                        formatPrice(currValue),
                                        market,
                                        lang
                                    )}
                                    {/*{market === 'tse' ? 'ریال' : '$'}*/}
                                </span>
                                <span>قیمت فعلی</span>
                            </span>
                        </SliderPrimitive.Thumb>
                    </>
                ) : (
                    <>
                        <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative  block h-5 w-5 rounded-full border-2 border-teal-600 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <span className="absolute left-1/2 top-[18px] flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-xl font-medium leading-normal text-neutral-200 md:text-[18px]">
                                <div className="h-12 w-[2px] bg-neutral-200"></div>
                                <span className="text-neutral-800" dir="ltr">
                                    {currency(
                                        formatPrice(currValue),
                                        market,
                                        lang
                                    )}
                                    {/*{market === 'tse' ? 'ریال' : '$'}*/}
                                </span>
                                <span>قیمت فعلی</span>
                            </span>
                        </SliderPrimitive.Thumb>
                        <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative  block h-5 w-5 rounded-full border-2 border-teal-600 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <span className="absolute bottom-[18px] left-1/2 flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-xl font-medium leading-normal text-neutral-200 md:text-[18px]">
                                <span
                                    className={
                                        currValue > avgValue
                                            ? 'text-neutral-600'
                                            : 'text-neutral-400'
                                    }
                                    dir="ltr"
                                >
                                    {!!avgValue
                                        ? currency(
                                              formatPrice(avgValue),
                                              market,
                                              lang
                                          )
                                        : 'داده ناکافی'}
                                    {/*{market === 'tse' ? 'ریال' : '$'}*/}
                                </span>
                                <span>قیمت میانگین</span>
                                <div className="h-12 w-[2px] bg-neutral-200"></div>
                            </span>
                        </SliderPrimitive.Thumb>
                    </>
                )}
                <SliderPrimitive.Thumb className="ring-offset-background focus-visible:ring-ring relative block h-3 w-3 rounded-full border-2 border-gray-700 bg-white shadow-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <span className="absolute left-1/2 top-7 flex -translate-x-1/2 flex-col items-center justify-center whitespace-nowrap text-[14px] font-medium leading-normal text-neutral-200">
                        <span className="text-neutral-800" dir="ltr">
                            {!!maxValue
                                ? currency(formatPrice(maxValue), market, lang)
                                : '-'}
                            {/*{market === 'tse' ? 'ریال' : '$'}*/}
                        </span>
                        سقف قیمت
                    </span>
                </SliderPrimitive.Thumb>
            </SliderPrimitive.Root>
        </div>
    );
}

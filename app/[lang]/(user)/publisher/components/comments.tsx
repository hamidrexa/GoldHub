import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

type CommentsProps = {
    message: string[];
};

export function Comments({ message }: CommentsProps) {
    return (
        <div className="mb-2 mt-5 flex w-full items-center justify-center gap-10 md:flex-row">
            {!!message?.length && <div className="flex w-1/5 flex-col items-center justify-center gap-y-4">
                <div className="flex items-center justify-center gap-5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M3 21.0005C6 21.0005 10 20.0005 10 13.0005V5.00052C10 3.75052 9.244 2.98352 8 3.00052H4C2.75 3.00052 2 3.75052 2 4.97252V11.0005C2 12.2505 2.75 13.0005 4 13.0005C5 13.0005 5 13.0005 5 14.0005V15.0005C5 16.0005 4 17.0005 3 17.0005C2 17.0005 2 17.0085 2 18.0315V20.0005C2 21.0005 2 21.0005 3 21.0005Z"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15 21.0005C18 21.0005 22 20.0005 22 13.0005V5.00052C22 3.75052 21.243 2.98352 20 3.00052H16C14.75 3.00052 14 3.75052 14 4.97252V11.0005C14 12.2505 14.75 13.0005 16 13.0005H16.75C16.75 15.2505 17 17.0005 14 17.0005V20.0005C14 21.0005 14 21.0005 15 21.0005Z"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="text-xl font-bold underline">
                        {message?.length}نظر
                    </div>
                </div>
                <div className="text-[#8E8FB2]"> نظرات کاربران</div>
            </div>}
            {!!message?.length && <div className="flex w-3/5 items-center justify-center">
                <Carousel
                    opts={{
                        align: 'start',
                    }}
                    className="mb-2  w-full"
                    dir="ltr"
                >
                    <CarouselContent>
                        {message.map((item: any, index) => (
                            <CarouselItem
                                key={index}
                                className=" ml-2 flex items-center justify-center md:basis-1/2 lg:basis-[38%]"
                            >
                                <Card className="w-full">
                                    <CardContent className="flex flex-col items-center justify-center gap-2 p-2.5">
                                        <div
                                            dir="rtl"
                                            className="line-clamp-2 items-start text-xs leading-4 text-gray-700"
                                        >
                                            {item.content}
                                        </div>
                                        <div
                                            className="w-full text-xs leading-4 text-gray-700"
                                            dir="rtl"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="inline"
                                            >
                                                <path
                                                    d="M0.5 9.00049C0.5 4.30607 4.30558 0.500488 9 0.500488C13.6944 0.500488 17.5 4.30607 17.5 9.00049C17.5 13.6949 13.6944 17.5005 9 17.5005C4.30558 17.5005 0.5 13.6949 0.5 9.00049Z"
                                                    fill="#0C0E3C"
                                                />
                                                <path
                                                    d="M0.5 9.00049C0.5 4.30607 4.30558 0.500488 9 0.500488C13.6944 0.500488 17.5 4.30607 17.5 9.00049C17.5 13.6949 13.6944 17.5005 9 17.5005C4.30558 17.5005 0.5 13.6949 0.5 9.00049Z"
                                                    stroke="white"
                                                />
                                                <path
                                                    d="M12.6283 6.00049L9.02435 9.45946H3.5V12.0005H10.121L14.5 7.79687L12.6283 6.00049Z"
                                                    fill="#10EDC5"
                                                />
                                            </svg>
                                            <span className="text-[10px]">
                                                {item.author.name}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>}
            <div className="flex w-1/5 flex-col items-center justify-center gap-y-5">
                <span className="block font-semibold text-gray-700">
                    {' '}
                    شما چه فکر میکنید؟
                </span>
                <Button className="bg-neutral-800 text-gray-300">
                    {' '}
                    <span className="ml-3 text-2xl">+</span> نظر دهید
                </Button>
            </div>
        </div>
    );
}

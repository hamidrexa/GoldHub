'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { cn } from '@/libs/utils';

export function NewDragSlider({ items, className, curr, average, min, max }) {
    return (
        <Slider
            allowCross={false}
            min={min}
            max={max}
            range
            styles={{
                track: {
                    background:
                        average > curr
                            ? 'linear-gradient(90deg, #0F7E81 15%, #10EDC5 85%)'
                            : 'linear-gradient(90deg, #db2777 30%, #F9A8D4 80%)',
                    height: 15,
                },
                handle: {
                    top: 7,
                    width: 20,
                    height: 20,
                    backgroundColor: '#fff',
                    borderColor: average > curr ? '#10EDC5' : '#db2777',
                    opacity: 1,
                    boxShadow: 'none',
                },
                rail: {
                    height: 15,
                },
            }}
            dotStyle={{
                bottom: '-1px',
                height: '17px',
                width: '17px',
                backgroundColor: '#fff',
                borderColor: '#E2E6E9',
            }}
            // activeDotStyle={{
            //     backgroundColor: '#fff',
            //     borderColor: '#10D2B4',
            // }}
            className={cn(className, 'range-slider pointer-events-none')}
            value={[Math.min(curr, average), Math.max(curr, average)]}
            marks={items}
            // step={9}
        />
    );
}

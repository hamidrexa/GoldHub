'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { cn } from '@/libs/utils';

type Props = {
    min: number,
    max: number,
    value?: number
    disabled?: boolean;
    className?: string,
    onChange?: (value: number) => void;

}
export function NewRangeSlider({
    min,
    max,
    className,
    value,
    disabled,
    onChange
}: Props) {
    return (
        <Slider
            allowCross={false}
            min={min}
            max={max}
            value={value}
            disabled={disabled}
            onChange={onChange}
            styles={{
                track: {
                    background:
                        // average > curr
                        //     ? 'linear-gradient(90deg, #0F7E81 15%, #10EDC5 85%)'
                        // : 
                        'linear-gradient(90deg, #CA8A04 30%, #CA8A04 80%)',
                    height: 15,
                },
                handle: {
                    display: disabled && 'none',
                    top: 7,
                    width: 20,
                    height: 20,
                    backgroundColor: '#D7DAE0',
                    borderColor:
                        // average > curr ? '#10EDC5'
                        //  :
                        '#D7DAE0',
                    opacity: 1,
                    boxShadow: 'none',
                },
                rail: {
                    height: disabled ? 0 : 15,
                    background: '#3D424A1A',
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
            className={cn(className, 'range-slider')}
        />
    );
}

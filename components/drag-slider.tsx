'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function DragSlider({ items, defaultValue, onValueCommit, className }) {
    return (
        <Slider
            className={className}
            reverse
            min={0}
            max={3}
            defaultValue={[
                Object.values(items).findIndex(
                    ({ value }) => value == defaultValue
                ),
            ]}
            styles={{
                track: {
                    backgroundColor: '#10EDC5',
                },
                handle: {
                    backgroundColor: '#fff',
                    borderColor: '#34D399',
                    opacity: 1,
                    boxShadow: 'none',
                },
            }}
            dotStyle={{
                backgroundColor: '#fff',
                borderColor: '#E2E6E9',
            }}
            activeDotStyle={{
                backgroundColor: '#fff',
                borderColor: '#10D2B4',
            }}
            marks={items}
            step={null}
            onChangeComplete={(e: number) => onValueCommit(items[e].value)}
        />
    );
}

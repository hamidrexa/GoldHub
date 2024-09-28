import React from 'react';

export default function format(str: string, values: object): string {
    for (const key in values) {
        const regex = new RegExp('{' + key + '}', 'g');
        str = str?.replace(regex, values[key]);
    }
    return str;
}

export function componentFormat(
    str: string,
    values: object,
    ...components: React.JSX.Element[]
): React.JSX.Element {
    const strParts = format(str, values)?.split('{component}');
    const elements: (string | React.JSX.Element)[] = [strParts?.[0]];
    for (let i = 1; i < strParts?.length; i++) {
        elements.push(components[i - 1]);
        elements.push(strParts[i]);
    }
    return <> {...elements} </>;
}
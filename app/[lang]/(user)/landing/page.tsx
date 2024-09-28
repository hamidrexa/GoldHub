import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { LandingPage } from '@/app/[lang]/(user)/landing/components/landing-page';
import { getPerformanceHistory } from '@/app/[lang]/(user)/publisher/services/getPerformanceHistory';
import { getPublisher } from '@/app/[lang]/(user)/publisher/services/getPublisher';
import { transformPublisherData } from '@/libs/dataTransformers';

export default async function Landing({ params: { lang } }) {
    const dict = await getDictionary(lang);
    const tsePublisher = transformPublisherData(
        await getPublisher('g_1536538540')
    );
    const cryptoPublisher = transformPublisherData(
        await getPublisher('t_jacob911')
    );
    const tsePerformance = await getPerformanceHistory('g_1536538540');
    const tseIndexPerformance = await getPerformanceHistory('g_1536538540', {
        chart_type: 'index',
    });
    const cryptoPerformance = await getPerformanceHistory('t_jacob911');
    const cryptoIndexPerformance = await getPerformanceHistory('t_jacob911', {
        chart_type: 'index',
    });

    return (
        <LandingPage
            dict={dict}
            lang={lang}
            tsePerformance={tsePerformance.chart_result}
            tseIndexPerformance={tseIndexPerformance.chart_result}
            cryptoPerformance={cryptoPerformance.chart_result}
            cryptoIndexPerformance={cryptoIndexPerformance.chart_result}
            tsePublisher={tsePublisher}
            cryptoPublisher={cryptoPublisher}
        />
    );
}

import Cookies from 'js-cookie';

export async function getCurrentMonthPerformance(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/telegram/publishers/${id}/performance_risk_chart`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return res.json();
}

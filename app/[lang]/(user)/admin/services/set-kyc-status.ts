import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function setKycStatus(body) {
    return fetcher({
        url: `/api/v1/gold_artifacts/set_KYC_status`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
        method: 'POST',
    });
}
import { fetcher } from '@/libs/utils';

export function addImage(product_id: number, file: File) {
    const formData = new FormData();
    formData.append('images', file);

    return fetcher({
        url: `/v1/gold_artifacts/product_add_image/${product_id}/`,
        method: 'POST',
        body: formData,
    });
}

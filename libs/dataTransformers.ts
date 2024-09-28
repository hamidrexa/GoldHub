import { getImage } from '@/libs/utils';

export const transformAssetData = (asset) => {
    if (!asset) return null;

    return {
        ...asset,
        symbol: asset.symbol_fa || asset.symbol,
        name: asset.name_fa || asset.name,
        image: asset.image || `/ticker-images/${asset.symbol_fa}.jpg`,
        market_capital: asset.market_cap || asset.market_capital,
    };
};

export const transformPublishersData = (data: any) => {
    return data.map((item: any) => ({
        ...item,
        photo: getImage({
            photo: item.photo,
            account_type: item.account_type,
        }),
        gain7d: item.performances['7d']?.return,
        gain30d: item.performances['30d']?.return,
        gain90d: item.performances['90d']?.return,
        gain180d: item.performances['180d']?.return,
        gain365d: item.performances['365d']?.return,
        winrate: item.winrate['all'],
        return_per_order: item.return_per_order['all'],
        signals_count: item.signals_count.all['2y'],
    }));
};

export const transformPublisherData = (data: any) => {
    return {
        ...data,
        photo: getImage({
            photo: data.photo,
            account_type: data.account_type,
        }),
        gain7d: data.performances['7d']?.return,
        gain30d: data.performances['30d']?.return,
        gain90d: data.performances['90d']?.return,
        gain180d: data.performances['180d']?.return,
        gain365d: data.performances['365d']?.return,
    };
};

export const transformAssetPriceData = (data: any) => {
    return {
        ...data,
        change_percent:
            data.p_change_percent || data.close_price_change_percentage,
        price: data.last_price || data.close_price,
    };
};

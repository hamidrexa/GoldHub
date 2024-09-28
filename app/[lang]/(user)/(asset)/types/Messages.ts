export type OrderByChoices =
    | 'latest'
    | 'assetsignal__value'
    | 'date'
    | 'created_at'
    | 'update_at'
    | 'id';

export type AccountTypeChoices =
    | 'telegram'
    | 'tradingview'
    | 'rahavard'
    | 'sahamyab'
    | 'shareholder'
    | 'arzdigital';

export type StatusChoices = 'N' | 'I' | 'R' | 'L' | 'D';

export type PurchaseStatusChoices = 'normal' | 'buy' | 'sell' | 'error';

export type SignalValues = 'B' | 'S' | 'B,S' | 'B,S,N';

export interface MessagesParams {
    id?: string;
    order_by?: OrderByChoices;
    publishers?: number[];
    account_type?: AccountTypeChoices;
    assets?: string[];
    assetsignal__values?: SignalValues;
    asset_signal_id?: string;
    min_asset_signals?: string;
    title?: string;
    created_at?: string;
    updated_at?: string;
    status?: StatusChoices[];
    source?: 'crawler' | 'manual' | 'sahmeto';
    is_signal?: boolean;
    post_id?: number;
    word_count?: number;
    publisher__top?: boolean;
    purchase_status?: PurchaseStatusChoices;
    page?: number;
    page_size?: number;
}

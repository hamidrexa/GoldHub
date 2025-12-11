/**
 * API Client for GoldHub marketplace
 * Base URL from NEXT_PUBLIC_API_URL environment variable
 * Authentication uses token from cookies (consistent with existing fetcher)
 * Set USE_MOCK_DATA=true in .env to use mock data instead of API calls
 */

import Cookies from 'js-cookie';

// API Base URL - uses NEXT_PUBLIC_API_URL from .env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_PATH = '/v1/gold_artifacts';

// Toggle to use mock data instead of API
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// ============================================================================
// API Types - Based on api.md specification
// ============================================================================

/** Order status values from API */
export type ApiOrderStatus =
    | 'Draft'
    | 'Cancelled'
    | 'Submitted'
    | 'Rejected'
    | 'Confirmed'
    | 'Paid'
    | 'Shipped'
    | 'Delivered';

/** KYC status values from API */
export type ApiKycStatus =
    | 'buyer_requested'
    | 'supplier_requested'
    | 'buyer_approved'
    | 'supplier_approved'
    | 'buyer_rejected'
    | 'supplier_rejected';

/** Product from API */
export interface ApiProduct {
    id: number;
    title: string;
    category: string;
    karat: number;
    weight: number;
    price: number;
    details?: string;
    images: string[];
    inventory: number;
    supplier?: string;
}

/** Cart item from API */
export interface ApiCartItem {
    product_id: number;
    count: number;
    product: ApiProduct;
}

/** Cart details response */
export interface ApiCartDetails {
    items: ApiCartItem[];
    total: number;
}

/** Order from API */
export interface ApiOrder {
    id: number;
    status: ApiOrderStatus;
    created_at: string;
    updated_at: string;
    total: number;
    items_count: number;
    buyer?: string;
    supplier?: string;
    items?: ApiOrderItem[];
}

/** Order item from API */
export interface ApiOrderItem {
    product: ApiProduct;
    quantity: number;
    price_at_order: number;
}

/** User from API */
export interface ApiUser {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'supplier' | 'buyer';
    kyc_status: ApiKycStatus | null;
    company_name?: string;
    joined_date: string;
}

// ============================================================================
// Request/Response types
// ============================================================================

export interface AddProductRequest {
    category: string;
    title: string;
    karat?: number;
    weight: number;
    price: number;
    details?: string;
    inventory?: number;
}

export interface UpdateProductRequest {
    category?: string;
    title?: string;
    karat?: number;
    weight?: number;
    price?: number;
    details?: string;
    inventory?: number;
}

export interface ProductsListParams {
    category?: string;
    title?: string;
    karat?: number;
    min_weight?: number;
    max_weight?: number;
    min_price?: number;
    max_price?: number;
    supplier?: string;
    [key: string]: string | number | undefined;
}

export interface AddToCartRequest {
    product_id: number;
    count?: number;
}

export interface RemoveFromCartRequest {
    product_id: number;
}

export interface UpdateOrderStatusRequest {
    order_id: number;
    status: ApiOrderStatus;
}

export interface SetKycStatusRequest {
    user_id: number;
    new_status: ApiKycStatus;
}

// ============================================================================
// API Error handling
// ============================================================================

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ============================================================================
// Helper functions
// ============================================================================

function getAuthHeaders(): Record<string, string> {
    // Get token from cookies - consistent with existing fetcher in libs/utils.ts
    const token = typeof window !== 'undefined' ? Cookies.get('token') : undefined;

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = getAuthHeaders();

    const url = `${API_BASE_URL}${API_PATH}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status,
            errorData.message || `API Error: ${response.status}`,
            errorData
        );
    }

    return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

// ============================================================================
// Products API
// ============================================================================

export async function getProducts(params: ProductsListParams = {}): Promise<ApiProduct[]> {
    if (USE_MOCK_DATA) {
        throw new Error('Using mock data');
    }
    const query = buildQueryString(params);
    return fetchApi<ApiProduct[]>(`/products_list${query}`);
}

export async function addProduct(data: AddProductRequest): Promise<ApiProduct> {
    return fetchApi<ApiProduct>('/product_create', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProduct(
    productId: number,
    data: UpdateProductRequest
): Promise<ApiProduct> {
    return fetchApi<ApiProduct>(`/product_update/${productId}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function addProductImage(
    productId: number,
    image: File
): Promise<{ success: boolean }> {
    const formData = new FormData();
    formData.append('images', image);

    const token = typeof window !== 'undefined' ? Cookies.get('token') : undefined;

    const url = `${API_BASE_URL}${API_PATH}/product_add_image/${productId}/`;
    const response = await fetch(url, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
    });

    if (!response.ok) {
        throw new ApiError(response.status, 'Failed to upload image');
    }

    return response.json();
}

export async function deleteProductImage(imageId: number): Promise<{ success: boolean }> {
    return fetchApi(`/product_delete_image/${imageId}/`, {
        method: 'DELETE',
    });
}

// ============================================================================
// Cart API
// ============================================================================

export async function getCartDetails(): Promise<ApiCartDetails> {
    if (USE_MOCK_DATA) {
        throw new Error('Using mock data');
    }
    return fetchApi<ApiCartDetails>('/cart_detail');
}

export async function addToCart(data: AddToCartRequest): Promise<{ success: boolean }> {
    return fetchApi('/add_to_cart', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function removeFromCart(data: RemoveFromCartRequest): Promise<{ success: boolean }> {
    return fetchApi('/remove_from_cart', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============================================================================
// Orders API
// ============================================================================

export async function submitOrder(): Promise<ApiOrder> {
    return fetchApi<ApiOrder>('/submit_order', {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

export async function updateOrderStatus(data: UpdateOrderStatusRequest): Promise<{ success: boolean }> {
    return fetchApi('/update_order_status', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getOrdersHistory(): Promise<ApiOrder[]> {
    if (USE_MOCK_DATA) {
        throw new Error('Using mock data');
    }
    return fetchApi<ApiOrder[]>('/orders_history');
}

export async function getSellsHistory(): Promise<ApiOrder[]> {
    if (USE_MOCK_DATA) {
        throw new Error('Using mock data');
    }
    return fetchApi<ApiOrder[]>('/sells_history');
}

export async function payOrder(orderId: number): Promise<{ success: boolean }> {
    return fetchApi(`/pay_order/${orderId}/`, {
        method: 'POST',
    });
}

// ============================================================================
// Users API (Admin only)
// ============================================================================

export async function getUsersList(): Promise<ApiUser[]> {
    if (USE_MOCK_DATA) {
        throw new Error('Using mock data');
    }
    return fetchApi<ApiUser[]>('/users_list');
}

export async function setKycStatus(data: SetKycStatusRequest): Promise<{ success: boolean }> {
    return fetchApi('/set_KYC_status', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============================================================================
// Type adapters - Convert API types to UI types
// ============================================================================

/** Map API order status to display-friendly format */
export function mapApiOrderStatus(status: ApiOrderStatus): string {
    return status;
}

/** Map API product to UI product format */
export function mapApiProductToUi(product: ApiProduct) {
    return {
        id: String(product.id),
        name: product.title,
        category: product.category,
        karat: `${product.karat}K` as '18K' | '22K' | '24K',
        weight: product.weight,
        price: product.price,
        stock: product.inventory,
        image: product.images?.[0],
        status: 'active' as const,
        createdDate: new Date().toISOString().split('T')[0],
        specifications: product.details,
    };
}

/** Map API order to UI order format */
export function mapApiOrderToUi(order: ApiOrder) {
    return {
        id: String(order.id),
        buyer: order.buyer || 'Unknown',
        items: order.items_count,
        total: order.total,
        status: order.status.toLowerCase().replace(' ', '_'),
        date: new Date(order.created_at).toLocaleDateString(),
    };
}

/** Map API user to UI user format */
export function mapApiUserToUi(user: ApiUser) {
    const kycStatusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'not_submitted'> = {
        'buyer_requested': 'pending',
        'supplier_requested': 'pending',
        'buyer_approved': 'approved',
        'supplier_approved': 'approved',
        'buyer_rejected': 'rejected',
        'supplier_rejected': 'rejected',
    };

    return {
        id: String(user.id),
        name: user.username,
        email: user.email,
        role: user.role === 'buyer' ? 'retailer' : user.role,
        kycStatus: user.kyc_status ? kycStatusMap[user.kyc_status] || 'not_submitted' : 'not_submitted',
        companyName: user.company_name,
        joinedDate: user.joined_date,
        documentsUploaded: !!user.kyc_status,
    };
}

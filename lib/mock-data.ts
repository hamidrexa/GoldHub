// Mock data for admin dashboard

export type OrderStatus =
    | 'draft'
    | 'submitted'
    | 'pending_supplier'
    | 'confirmed'
    | 'in_processing'
    | 'ready'
    | 'shipped'
    | 'delivered'
    | 'closed'
    | 'cancelled';

export interface Order {
    id: string;
    buyer: string;
    items: number;
    total: number;
    status: OrderStatus;
    date: string;
}

// Buyer-specific types
export interface CartItem {
    productId: string;
    product: Product;
    quantity: number;
    addedAt: string;
}

export interface OrderTimelineEntry {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
    completed: boolean;
}

export interface OrderDetail extends Order {
    orderItems: {
        product: Product;
        quantity: number;
        priceAtOrder: number;
        subtotal: number;
    }[];
    timeline: OrderTimelineEntry[];
    shippingAddress?: {
        street: string;
        city: string;
        country: string;
        postalCode: string;
    };
    subtotal: number;
    tax: number;
    shipping: number;
}

export interface WishlistItem {
    productId: string;
    product: Product;
    addedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'supplier' | 'retailer';
    kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    companyName?: string;
    iban?: string;
    swift?: string;
    documentsUploaded: boolean;
    joinedDate: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    event: 'login' | 'logout' | 'order_created' | 'kyc_submitted' | 'kyc_approved' | 'kyc_rejected';
    ipAddress: string;
    device: string;
}

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    activeUsers: number;
    pendingKyc: number;
}

export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        buyer: 'Global Traders Corp.',
        items: 5,
        total: 37250,
        status: 'confirmed',
        date: '1/15/2024'
    },
    {
        id: 'ORD-002',
        buyer: 'Global Traders Corp.',
        items: 2,
        total: 17800,
        status: 'shipped',
        date: '1/14/2024'
    },
    {
        id: 'ORD-003',
        buyer: 'Eastern Gold Ltd.',
        items: 10,
        total: 21500,
        status: 'pending_supplier',
        date: '1/17/2024'
    },
    {
        id: 'ORD-004',
        buyer: 'Premium Jewelers Inc.',
        items: 3,
        total: 45600,
        status: 'closed',
        date: '1/10/2024'
    },
    {
        id: 'ORD-005',
        buyer: 'Royal Gold House',
        items: 7,
        total: 28900,
        status: 'confirmed',
        date: '1/16/2024'
    },
    {
        id: 'ORD-006',
        buyer: 'Diamond District Co.',
        items: 15,
        total: 89500,
        status: 'shipped',
        date: '1/13/2024'
    },
    {
        id: 'ORD-007',
        buyer: 'Golden Valley Trading',
        items: 4,
        total: 19200,
        status: 'pending_supplier',
        date: '1/18/2024'
    },
    {
        id: 'ORD-008',
        buyer: 'Luxury Metals Ltd.',
        items: 8,
        total: 52300,
        status: 'closed',
        date: '1/8/2024'
    },
    {
        id: 'ORD-009',
        buyer: 'Artisan Jewelry Studio',
        items: 12,
        total: 34700,
        status: 'confirmed',
        date: '1/15/2024'
    },
    {
        id: 'ORD-010',
        buyer: 'Metropolitan Gold',
        items: 6,
        total: 41500,
        status: 'shipped',
        date: '1/12/2024'
    },
    {
        id: 'ORD-011',
        buyer: 'Heritage Bullion',
        items: 9,
        total: 67800,
        status: 'pending_supplier',
        date: '1/19/2024'
    },
    {
        id: 'ORD-012',
        buyer: 'Elite Precious Metals',
        items: 20,
        total: 125000,
        status: 'closed',
        date: '1/5/2024'
    }
];

export const mockUsers: User[] = [
    {
        id: 'U001',
        name: 'John Smith',
        email: 'john@globaltraders.com',
        role: 'retailer',
        kycStatus: 'approved',
        companyName: 'Global Traders Corp.',
        iban: 'GB82WEST12345698765432',
        swift: 'WESTGB22',
        documentsUploaded: true,
        joinedDate: '2023-11-15'
    },
    {
        id: 'U002',
        name: 'Sarah Chen',
        email: 'sarah@easterngold.com',
        role: 'retailer',
        kycStatus: 'pending',
        companyName: 'Eastern Gold Ltd.',
        iban: 'HK35HSBC12345678901234',
        swift: 'HSBCHKHH',
        documentsUploaded: true,
        joinedDate: '2024-01-10'
    },
    {
        id: 'U003',
        name: 'Michael Brown',
        email: 'michael@premiumjewelers.com',
        role: 'supplier',
        kycStatus: 'approved',
        companyName: 'Premium Jewelers Inc.',
        iban: 'US64SVBK00000000123456',
        swift: 'SVBKUS6S',
        documentsUploaded: true,
        joinedDate: '2023-09-20'
    },
    {
        id: 'U004',
        name: 'Emma Wilson',
        email: 'emma@royalgold.com',
        role: 'retailer',
        kycStatus: 'not_submitted',
        companyName: 'Royal Gold House',
        documentsUploaded: false,
        joinedDate: '2024-01-18'
    },
    {
        id: 'U005',
        name: 'David Lee',
        email: 'david@diamonddistrict.com',
        role: 'retailer',
        kycStatus: 'approved',
        companyName: 'Diamond District Co.',
        iban: 'SG12OCBC1234567890',
        swift: 'OCBCSGSG',
        documentsUploaded: true,
        joinedDate: '2023-10-05'
    },
    {
        id: 'U006',
        name: 'Lisa Martinez',
        email: 'lisa@goldenvalley.com',
        role: 'retailer',
        kycStatus: 'rejected',
        companyName: 'Golden Valley Trading',
        iban: 'ES9121000418450200051332',
        swift: 'CAIXESBB',
        documentsUploaded: true,
        joinedDate: '2024-01-12'
    },
    {
        id: 'U007',
        name: 'James Anderson',
        email: 'james@luxurymetals.com',
        role: 'supplier',
        kycStatus: 'approved',
        companyName: 'Luxury Metals Ltd.',
        iban: 'CH9300762011623852957',
        swift: 'UBSWCHZH80A',
        documentsUploaded: true,
        joinedDate: '2023-08-15'
    }
];

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'LOG001',
        timestamp: '2024-01-19 09:15:23',
        user: 'john@globaltraders.com',
        event: 'login',
        ipAddress: '192.168.1.105',
        device: 'Chrome 120.0 / Windows 10'
    },
    {
        id: 'LOG002',
        timestamp: '2024-01-19 08:45:12',
        user: 'sarah@easterngold.com',
        event: 'kyc_submitted',
        ipAddress: '203.45.67.89',
        device: 'Safari 17.1 / macOS'
    },
    {
        id: 'LOG003',
        timestamp: '2024-01-19 08:30:45',
        user: 'admin@goldtrade.com',
        event: 'login',
        ipAddress: '10.0.0.1',
        device: 'Firefox 121.0 / Ubuntu'
    },
    {
        id: 'LOG004',
        timestamp: '2024-01-18 18:22:33',
        user: 'michael@premiumjewelers.com',
        event: 'logout',
        ipAddress: '156.78.90.123',
        device: 'Chrome 120.0 / Windows 11'
    },
    {
        id: 'LOG005',
        timestamp: '2024-01-18 16:55:17',
        user: 'david@diamonddistrict.com',
        event: 'order_created',
        ipAddress: '45.123.67.201',
        device: 'Edge 120.0 / Windows 10'
    },
    {
        id: 'LOG006',
        timestamp: '2024-01-18 15:30:22',
        user: 'emma@royalgold.com',
        event: 'login',
        ipAddress: '89.234.12.45',
        device: 'Chrome 120.0 / Android'
    },
    {
        id: 'LOG007',
        timestamp: '2024-01-18 14:10:55',
        user: 'admin@goldtrade.com',
        event: 'kyc_approved',
        ipAddress: '10.0.0.1',
        device: 'Firefox 121.0 / Ubuntu'
    },
    {
        id: 'LOG008',
        timestamp: '2024-01-18 12:45:33',
        user: 'lisa@goldenvalley.com',
        event: 'kyc_submitted',
        ipAddress: '67.89.123.45',
        device: 'Safari 17.1 / iOS'
    },
    {
        id: 'LOG009',
        timestamp: '2024-01-18 11:20:18',
        user: 'james@luxurymetals.com',
        event: 'login',
        ipAddress: '123.45.67.89',
        device: 'Chrome 120.0 / macOS'
    },
    {
        id: 'LOG010',
        timestamp: '2024-01-18 10:05:42',
        user: 'john@globaltraders.com',
        event: 'order_created',
        ipAddress: '192.168.1.105',
        device: 'Chrome 120.0 / Windows 10'
    }
];

export const mockDashboardStats: DashboardStats = {
    totalOrders: 156,
    pendingOrders: 23,
    totalRevenue: 1245000,
    activeUsers: 45,
    pendingKyc: 8
};

// Supplier-specific data

export interface Stone {
    id: string;
    type: string;
    count: number;
    weight: number; // carats or grams depending on type, simplified for now
    unit: 'ct' | 'g';
    clarity?: string;
    color?: string;
}

export interface Product {
    id: string;
    sku?: string;
    name: string;
    description?: string;
    category: 'gold_bar' | 'gold_coin' | 'jewelry' | 'necklace' | 'bracelet' | 'earring' | 'ring';

    // Material Details
    metalType?: 'gold' | 'silver' | 'platinum';
    metalColor?: 'yellow' | 'white' | 'rose' | 'two_tone' | 'tri_tone';
    karat: '18K' | '22K' | '24K'; // Keeping this as primary purity indicator for now, can be mapped to 750/916/999
    weight: number; // Net weight in grams
    grossWeight?: number; // Gross weight including stones

    // Stones
    stones?: Stone[];

    // Pricing & B2B
    price: number; // Total price or Base price
    makingCharges?: number;
    makingChargesType?: 'per_gram' | 'fixed';

    stock: number;
    moq?: number;
    countryOfOrigin?: string;

    // Certification
    certificationType?: 'BIS' | 'GIA' | 'IGI' | 'Other';
    certificateFile?: string; // URL or File path

    image?: string; // S3 URL placeholder
    status: 'active' | 'inactive' | 'draft';
    createdDate: string;
    specifications?: string; // Legacy field, can be kept for backward compatibility or migrated
}

export interface SupplierStats {
    activeProducts: number;
    pendingOrders: number;
    revenueMTD: number;
    avgOrderValue: number;
    liveGoldPrice: number;
    goldPriceChange: number; // percentage
}

export interface PricingConfig {
    spotPricePerGram: number; // USD per gram
    markupPercentage: number;
    automaticPricing: boolean;
    lastUpdated: string;
}

export const mockProducts: Product[] = [
    {
        id: 'PROD-001',
        sku: 'GB-24K-100',
        name: '24K Gold Bar 100g',
        description: 'Premium Swiss craftsmanship 100g Gold Bar.',
        category: 'gold_bar',
        metalType: 'gold',
        metalColor: 'yellow',
        karat: '24K',
        weight: 100,
        grossWeight: 100,
        price: 7450,
        makingCharges: 50,
        makingChargesType: 'fixed',
        stock: 22,
        moq: 1,
        countryOfOrigin: 'Switzerland',
        status: 'active',
        createdDate: '2024-01-05',
        specifications: 'Gold Bar · 24K · 100gram'
    },
    {
        id: 'PROD-002',
        sku: 'GC-22K-1OZ',
        name: 'Gold Krugerrand 1oz',
        category: 'gold_coin',
        metalType: 'gold',
        metalColor: 'yellow',
        karat: '22K',
        weight: 31.1,
        grossWeight: 31.1,
        price: 2150,
        stock: 50,
        moq: 5,
        status: 'active',
        createdDate: '2024-01-10',
        specifications: 'Gold Coin · 22K · 1ounce'
    },
    {
        id: 'PROD-003',
        sku: 'NK-18K-DIA-001',
        name: '18K Diamond Necklace',
        description: 'Elegant purity with VS1 diamonds.',
        category: 'necklace',
        metalType: 'gold',
        metalColor: 'white',
        karat: '18K',
        weight: 45,
        grossWeight: 46.2,
        stones: [
            { id: 'st-1', type: 'Diamond', count: 12, weight: 1.2, unit: 'ct', clarity: 'VS1', color: 'G' }
        ],
        price: 8900,
        makingCharges: 15,
        makingChargesType: 'per_gram',
        stock: 10,
        moq: 1,
        countryOfOrigin: 'Italy',
        status: 'active',
        createdDate: '2024-01-12',
        specifications: 'Jewelry · 18K · 45gram'
    },
    {
        id: 'PROD-004',
        name: '22K Gold Bracelet',
        category: 'bracelet',
        karat: '22K',
        weight: 25,
        price: 1875,
        stock: 15,
        status: 'active',
        createdDate: '2024-01-08',
        specifications: 'Jewelry · 22K · 25gram'
    },
    {
        id: 'PROD-005',
        name: '24K Gold Bar 50g',
        category: 'gold_bar',
        karat: '24K',
        weight: 50,
        price: 3725,
        stock: 35,
        status: 'active',
        createdDate: '2024-01-15',
        specifications: 'Gold Bar · 24K · 50gram'
    },
    {
        id: 'PROD-006',
        name: '18K Gold Earrings',
        category: 'earring',
        karat: '18K',
        weight: 8,
        price: 650,
        stock: 28,
        status: 'active',
        createdDate: '2024-01-18',
        specifications: 'Jewelry · 18K · 8gram'
    },
    {
        id: 'PROD-007',
        name: '22K Wedding Ring',
        category: 'ring',
        karat: '22K',
        weight: 12,
        price: 890,
        stock: 18,
        status: 'draft',
        createdDate: '2024-01-19',
        specifications: 'Jewelry · 22K · 12gram'
    },
    {
        id: 'PROD-008',
        name: '24K Gold Coin Set',
        category: 'gold_coin',
        karat: '24K',
        weight: 62.2,
        price: 4650,
        stock: 12,
        status: 'active',
        createdDate: '2024-01-14',
        specifications: 'Gold Coin · 24K · 2oz'
    }
];

export const mockSupplierStats: SupplierStats = {
    activeProducts: 7,
    pendingOrders: 12,
    revenueMTD: 156000,
    avgOrderValue: 3250,
    liveGoldPrice: 74.50, // per gram
    goldPriceChange: 1.2 // +1.2%
};

export const mockPricingConfig: PricingConfig = {
    spotPricePerGram: 74.50,
    markupPercentage: 8.5,
    automaticPricing: true,
    lastUpdated: '2024-01-19 14:30:00'
};

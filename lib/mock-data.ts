// Mock data for admin dashboard

export interface Order {
    id: string;
    buyer: string;
    items: number;
    total: number;
    status: 'confirmed' | 'shipped' | 'pending_supplier' | 'completed' | 'cancelled';
    date: string;
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
        status: 'completed',
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
        status: 'completed',
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
        status: 'completed',
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

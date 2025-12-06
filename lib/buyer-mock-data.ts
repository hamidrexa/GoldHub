// Buyer-specific mock data
import { mockProducts, Product, CartItem, WishlistItem, OrderDetail } from './mock-data';

export const mockCartItems: CartItem[] = [
    {
        productId: 'PROD-001',
        product: mockProducts[0],
        quantity: 2,
        addedAt: '2024-01-19 10:30:00'
    },
    {
        productId: 'PROD-003',
        product: mockProducts[2],
        quantity: 1,
        addedAt: '2024-01-19 11:15:00'
    }
];

export const mockWishlist: WishlistItem[] = [
    {
        productId: 'PROD-002',
        product: mockProducts[1],
        addedAt: '2024-01-18 14:20:00'
    },
    {
        productId: 'PROD-005',
        product: mockProducts[4],
        addedAt: '2024-01-17 09:45:00'
    }
];

export const mockBuyerOrders: OrderDetail[] = [
    {
        id: 'ORD-B001',
        buyer: 'John Smith',
        items: 2,
        total: 16325,
        status: 'shipped',
        date: '2024-01-15',
        orderItems: [
            {
                product: mockProducts[0],
                quantity: 2,
                priceAtOrder: 7450,
                subtotal: 14900
            }
        ],
        timeline: [
            { status: 'draft', timestamp: '2024-01-15 09:00:00', completed: true, notes: 'Order initiated' },
            { status: 'submitted', timestamp: '2024-01-15 09:15:00', completed: true, notes: 'Order submitted' },
            { status: 'pending_supplier', timestamp: '2024-01-15 09:15:00', completed: true, notes: 'Awaiting supplier confirmation' },
            { status: 'confirmed', timestamp: '2024-01-15 14:30:00', completed: true, notes: 'Supplier confirmed order' },
            { status: 'in_processing', timestamp: '2024-01-16 08:00:00', completed: true, notes: 'Preparing your order' },
            { status: 'ready', timestamp: '2024-01-17 15:00:00', completed: true, notes: 'Ready for shipment' },
            { status: 'shipped', timestamp: '2024-01-18 10:30:00', completed: true, notes: 'Shipped via DHL - Tracking: DHL123456' },
            { status: 'delivered', timestamp: '', completed: false, notes: 'Expected delivery: Jan 20' },
            { status: 'closed', timestamp: '', completed: false }
        ],
        shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            country: 'USA',
            postalCode: '10001'
        },
        subtotal: 14900,
        tax: 1193,
        shipping: 232
    },
    {
        id: 'ORD-B002',
        buyer: 'John Smith',
        items: 1,
        total: 2240,
        status: 'pending_supplier',
        date: '2024-01-19',
        orderItems: [
            {
                product: mockProducts[1],
                quantity: 1,
                priceAtOrder: 2150,
                subtotal: 2150
            }
        ],
        timeline: [
            { status: 'draft', timestamp: '2024-01-19 11:20:00', completed: true },
            { status: 'submitted', timestamp: '2024-01-19 11:25:00', completed: true },
            { status: 'pending_supplier', timestamp: '2024-01-19 11:25:00', completed: true, notes: 'Waiting for supplier to confirm' },
            { status: 'confirmed', timestamp: '', completed: false },
            { status: 'in_processing', timestamp: '', completed: false },
            { status: 'ready', timestamp: '', completed: false },
            { status: 'shipped', timestamp: '', completed: false },
            { status: 'delivered', timestamp: '', completed: false },
            { status: 'closed', timestamp: '', completed: false }
        ],
        shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            country: 'USA',
            postalCode: '10001'
        },
        subtotal: 2150,
        tax: 172,
        shipping: 18
    },
    {
        id: 'ORD-B003',
        buyer: 'John Smith',
        items: 1,
        total: 9156,
        status: 'delivered',
        date: '2024-01-08',
        orderItems: [
            {
                product: mockProducts[2],
                quantity: 1,
                priceAtOrder: 8900,
                subtotal: 8900
            }
        ],
        timeline: [
            { status: 'draft', timestamp: '2024-01-08 14:00:00', completed: true },
            { status: 'submitted', timestamp: '2024-01-08 14:10:00', completed: true },
            { status: 'pending_supplier', timestamp: '2024-01-08 14:10:00', completed: true },
            { status: 'confirmed', timestamp: '2024-01-08 16:30:00', completed: true },
            { status: 'in_processing', timestamp: '2024-01-09 09:00:00', completed: true },
            { status: 'ready', timestamp: '2024-01-10 14:00:00', completed: true },
            { status: 'shipped', timestamp: '2024-01-11 08:00:00', completed: true, notes: 'Shipped via FedEx' },
            { status: 'delivered', timestamp: '2024-01-13 11:30:00', completed: true, notes: 'Delivered successfully' },
            { status: 'closed', timestamp: '', completed: false }
        ],
        shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            country: 'USA',
            postalCode: '10001'
        },
        subtotal: 8900,
        tax: 712,
        shipping: 144
    }
];

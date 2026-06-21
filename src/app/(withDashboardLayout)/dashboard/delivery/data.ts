import { DeliveryMan, LoadingSheet, Settlement } from './types';

export const deliveryMen: DeliveryMan[] = [
    {
        id: '1',
        name: 'Ali',
        phone: '01700000001',
        status: 'active',
        nid: '199012345678',
        address: 'Dhaka, Bangladesh',
        profile: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        id: '2',
        name: 'Babu',
        phone: '01700000002',
        status: 'inactive',
        nid: '198876543210',
        address: 'Chittagong, Bangladesh',
        profile: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
];

export const loadingSheets: LoadingSheet[] = [
    {
        id: 'ls1',
        date: '2026-01-29',
        deliveryManName: 'Ali',
        deliveryManId: '1',
        status: 'loaded',
        items: [
            {
                productId: 'p1',
                productName: 'Deluxe Biscuit Classic',
                quantity: 10,
                purchasePrice: 2.01,
                sellingPrice: 3.17
            }
        ],
    },
];

export const settlements: Settlement[] = [
    {
        id: 'st1',
        date: '2026-01-29',
        deliveryManName: 'Ali',
        deliveryManId: '1',
        loadingSheetId: 'ls1',
        totalLoaded: 10,
        totalSold: 8,
        totalReturned: 1,
        totalDamaged: 1,
        totalSales: 25.36,
        totalProfit: 9.28,
        totalLoss: 2.01,
        status: 'finalized',
        items: [
            {
                productId: 'p1',
                productName: 'Deluxe Biscuit Classic',
                loadedQuantity: 10,
                soldQuantity: 8,
                returnedQuantity: 1,
                damagedQuantity: 1,
                purchasePrice: 2.01,
                sellingPrice: 3.17
            }
        ]
    },
];

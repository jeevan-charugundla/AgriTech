export type SellType = 'customers' | 'retailers';
export type ListingStatus = 'Active' | 'Paused' | 'Sold Out';

export interface ProductListing {
    id: string;
    imageSrc: string;
    cropName: string;
    category: string;
    grade: string;
    quantity: number; // in kg
    pricePerKg: number;
    isOrganic: boolean;
    sellType: SellType;
    status: ListingStatus;
    location: string;
    harvestDate: string;
    minOrderQuantity?: number; // Only for retailers
}

export interface IncomingOrder {
    id: string;
    buyerName: string;
    buyerAvatar: string;
    location: string;
    timestamp: string; // e.g. "2h ago"
    bidPrice: number;
    listingId: string;
    requestedQuantity: number;
    status: 'pending' | 'negotiating' | 'accepted' | 'rejected';
}

export interface Transaction {
    id: string;
    buyerName: string;
    date: string;
    amount: number;
    status: 'Received' | 'Pending';
}

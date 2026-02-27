import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Plus, CheckCircle2, XCircle, Clock, IndianRupee, ChevronRight, ArrowLeft, Send } from 'lucide-react';
import './MarketScreen.css';
import { ProductListing, IncomingOrder, SellType, Transaction } from '../types/market';

export const MarketScreen: React.FC = () => {
    // --- State ---
    const [viewState, setViewState] = useState<'main' | 'addProduct' | 'productDetail' | 'chatNegotiation' | 'paymentHistory'>('main');
    const [sellType, setSellType] = useState<SellType>('customers');

    // Mock Data State
    const [listings, setListings] = useState<ProductListing[]>([
        {
            id: 'l1',
            imageSrc: 'https://images.unsplash.com/photo-1587049352847-4d1cccd065dc?auto=format&fit=crop&w=150&q=80',
            cropName: 'Organic Tomatoes',
            category: 'Vegetables',
            grade: 'Grade A',
            quantity: 50,
            pricePerKg: 40,
            isOrganic: true,
            sellType: 'customers',
            status: 'Active',
            location: 'Pune Mandi',
            harvestDate: '2023-10-25',
        },
        {
            id: 'l2',
            imageSrc: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=150&q=80',
            cropName: 'Red Onions',
            category: 'Vegetables',
            grade: 'Grade B',
            quantity: 0,
            pricePerKg: 25,
            isOrganic: false,
            sellType: 'retailers',
            status: 'Sold Out',
            location: 'Nashik',
            harvestDate: '2023-10-20',
        },
    ]);

    const [orders, setOrders] = useState<IncomingOrder[]>([
        {
            id: 'o1',
            buyerName: 'Raj Trading Co.',
            buyerAvatar: 'R',
            location: 'Pune Mandi',
            timestamp: '2h ago',
            bidPrice: 38,
            listingId: 'l1',
            requestedQuantity: 50,
            status: 'pending',
        }
    ]);

    const [transactions] = useState<Transaction[]>([
        { id: 't1', buyerName: 'FreshMart', date: 'Oct 24, 2023', amount: 12500, status: 'Received' },
        { id: 't2', buyerName: 'GreenGrocers', date: 'Oct 25, 2023', amount: 4200, status: 'Pending' },
    ]);

    // Active Selection State for sub-views
    const [activeOrder, setActiveOrder] = useState<IncomingOrder | null>(null);

    // Form State for Add Product
    const [formState, setFormState] = useState({
        cropName: '',
        category: 'Vegetables',
        grade: 'Grade A',
        quantity: '',
        pricePerKg: '',
        isOrganic: false,
        minOrderQuantity: '',
        location: '',
        harvestDate: ''
    });

    // --- Actions ---

    const handleAddProduct = () => {
        if (!formState.cropName || !formState.quantity || !formState.pricePerKg) {
            alert('Please fill out all required fields.');
            return;
        }

        const newListing: ProductListing = {
            id: `l${Date.now()}`,
            imageSrc: 'https://images.unsplash.com/photo-1595856416625-f6c6d0426f04?auto=format&fit=crop&w=150&q=80', // Mock fresh image
            cropName: formState.cropName,
            category: formState.category,
            grade: formState.grade,
            quantity: parseInt(formState.quantity),
            pricePerKg: parseFloat(formState.pricePerKg),
            isOrganic: formState.isOrganic,
            sellType: sellType,
            status: 'Active',
            location: formState.location || 'Your Farm',
            harvestDate: formState.harvestDate || new Date().toISOString().split('T')[0],
            minOrderQuantity: formState.minOrderQuantity ? parseInt(formState.minOrderQuantity) : undefined,
        };

        setListings([newListing, ...listings]);
        setViewState('main');
        // Show simulated toast
        alert('Product listed successfully!');

        // Reset Form
        setFormState({ cropName: '', category: 'Vegetables', grade: 'Grade A', quantity: '', pricePerKg: '', isOrganic: false, minOrderQuantity: '', location: '', harvestDate: '' });
    };

    const handleAcceptOrder = (orderId: string) => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        const order = orders[orderIndex];
        const listingIndex = listings.findIndex(l => l.id === order.listingId);

        if (listingIndex !== -1) {
            const updatedListings = [...listings];
            const listing = { ...updatedListings[listingIndex] };

            if (listing.quantity < order.requestedQuantity) {
                alert('Insufficient quantity to accept this order!');
                return;
            }

            listing.quantity -= order.requestedQuantity;
            if (listing.quantity <= 0) {
                listing.status = 'Sold Out';
            }
            updatedListings[listingIndex] = listing;
            setListings(updatedListings);
        }

        // Remove order from active incoming array and perhaps move to history (not explicitly modelled to save space)
        setOrders(orders.filter(o => o.id !== orderId));
        alert(`Order for ${order.buyerName} accepted successfully!`);
        if (viewState === 'chatNegotiation') setViewState('main');
    };

    const handleRejectOrder = (orderId: string) => {
        setOrders(orders.filter(o => o.id !== orderId));
        if (viewState === 'chatNegotiation') setViewState('main');
    };

    const openNegotiation = (order: IncomingOrder) => {
        setActiveOrder(order);
        setViewState('chatNegotiation');
    };


    // --- Renderers ---

    const renderMainScreen = () => {
        const filteredListings = listings.filter(l => l.sellType === sellType);

        return (
            <div className="content-padding">
                <div className="market-type-selector">
                    <button
                        className={`market-type-btn ${sellType === 'customers' ? 'active' : ''}`}
                        onClick={() => setSellType('customers')}
                    >
                        Sell to Customers
                    </button>
                    <button
                        className={`market-type-btn ${sellType === 'retailers' ? 'active' : ''}`}
                        onClick={() => setSellType('retailers')}
                    >
                        Sell to Retailers
                    </button>
                </div>

                <button className="btn btn-primary add-product-btn" onClick={() => setViewState('addProduct')}>
                    <Plus size={20} className="mr-2" style={{ display: 'inline' }} />
                    Add New Product
                </button>

                <h3 className="section-title">My Listings</h3>
                {filteredListings.length === 0 ? (
                    <p className="text-secondary text-center my-4">No {sellType} listings found.</p>
                ) : (
                    <div className="listings-scroll">
                        {filteredListings.map(listing => (
                            <div key={listing.id} className="listing-card" onClick={() => setViewState('productDetail')}>
                                <div className="listing-img-box">
                                    <img src={listing.imageSrc} alt={listing.cropName} />
                                </div>
                                <div className="listing-info">
                                    <div className="listing-header">
                                        <h4>{listing.cropName}</h4>
                                        <span className={`badge-tag ${listing.isOrganic ? 'organic' : 'regular'}`}>
                                            {listing.isOrganic ? 'Organic' : 'Regular'}
                                        </span>
                                    </div>
                                    <p>{listing.grade} • {listing.quantity} kg</p>
                                    <div className="listing-price-row">
                                        <span className="price">₹{listing.pricePerKg}/kg</span>
                                        <span className={`status-badge ${listing.status === 'Active' ? 'active' : 'sold_out'}`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="section-title">Incoming Orders & Bids</h3>
                {orders.length === 0 ? (
                    <p className="text-secondary text-center my-4">No pending orders.</p>
                ) : (
                    orders.map(order => {
                        const relatedListing = listings.find(l => l.id === order.listingId);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="buyer-info">
                                        <div className="buyer-avatar-circle">{order.buyerAvatar}</div>
                                        <div>
                                            <h5>{order.buyerName}</h5>
                                            <p>{order.location}</p>
                                        </div>
                                    </div>
                                    <span className="time-ago">{order.timestamp}</span>
                                </div>
                                <div className="order-details">
                                    <p className="bid-info">
                                        {sellType === 'retailers' ? 'Bidding ' : 'Offering '}
                                        <strong>₹{order.bidPrice}/kg</strong> for {relatedListing?.cropName} ({order.requestedQuantity}kg)</p>
                                    <p className="original-price">Your Price: ₹{relatedListing?.pricePerKg}/kg</p>
                                </div>
                                <div className="order-actions">
                                    {sellType === 'retailers' && (
                                        <button className="btn-negotiate" onClick={() => openNegotiation(order)}>
                                            💬 Negotiate
                                        </button>
                                    )}
                                    <div className="action-buttons">
                                        <button className="btn-reject-bid" onClick={() => handleRejectOrder(order.id)}><XCircle size={22} /></button>
                                        <button className="btn-accept-bid" onClick={() => handleAcceptOrder(order.id)}><CheckCircle2 size={18} /> Accept</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}


                <h3 className="section-title">Payments & UPI</h3>
                <div className="payments-grid">
                    <div className="payment-stat-card" onClick={() => setViewState('paymentHistory')}>
                        <div className="payment-icon-wrap received">
                            <IndianRupee size={22} />
                        </div>
                        <div className="stat-text">
                            <span className="val">₹{transactions.filter(t => t.status === 'Received').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}</span>
                            <span className="lbl">Received</span>
                        </div>
                    </div>
                    <div className="payment-stat-card" onClick={() => setViewState('paymentHistory')}>
                        <div className="payment-icon-wrap pending">
                            <Clock size={22} />
                        </div>
                        <div className="stat-text">
                            <span className="val">₹{transactions.filter(t => t.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}</span>
                            <span className="lbl">Pending</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderAddProductForm = () => (
        <div className="content-padding">
            <button className="flex items-center text-primary-dark font-bold mb-4" onClick={() => setViewState('main')}>
                <ArrowLeft size={20} className="mr-2" /> Back to Market
            </button>
            <h2 className="text-2xl font-bold text-primary-dark">Add New Product</h2>
            <p className="text-secondary mb-6">Selling to {sellType === 'customers' ? 'Customers directly' : 'Retailers in bulk'}</p>

            <div className="add-product-form-container">
                <div className="form-group">
                    <label>Crop Name</label>
                    <input className="input-modern" placeholder="e.g. Organic Tomatoes" value={formState.cropName} onChange={e => setFormState({ ...formState, cropName: e.target.value })} />
                </div>
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label>Quantity (kg)</label>
                        <input className="input-modern" type="number" placeholder="50" value={formState.quantity} onChange={e => setFormState({ ...formState, quantity: e.target.value })} />
                    </div>
                    <div className="flex-1">
                        <label>Price/kg (₹)</label>
                        <input className="input-modern" type="number" placeholder="40" value={formState.pricePerKg} onChange={e => setFormState({ ...formState, pricePerKg: e.target.value })} />
                    </div>
                </div>
                {sellType === 'retailers' && (
                    <div className="form-group">
                        <label>Minimum Order Quantity (kg)</label>
                        <input className="input-modern" type="number" placeholder="Enter MOQ for retailers" value={formState.minOrderQuantity} onChange={e => setFormState({ ...formState, minOrderQuantity: e.target.value })} />
                    </div>
                )}
                <div className="toggle-row" onClick={() => setFormState({ ...formState, isOrganic: !formState.isOrganic })}>
                    <span>Is this Organic?</span>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${formState.isOrganic ? 'bg-primary' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${formState.isOrganic ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Location / Mandi</label>
                    <input className="input-modern" placeholder="e.g. Pune Mandi" value={formState.location} onChange={e => setFormState({ ...formState, location: e.target.value })} />
                </div>

                <button className="btn btn-primary submit-form-btn mt-4" onClick={handleAddProduct}>
                    List Product
                </button>
            </div>
        </div>
    );

    const renderChatNegotiation = () => {
        if (!activeOrder) return null;
        const relatedListing = listings.find(l => l.id === activeOrder.listingId);

        return (
            <div className="negotiation-view">
                <div className="negotiation-header">
                    <button onClick={() => setViewState('main')} className="mr-4">
                        <ArrowLeft size={24} color="#1F2937" />
                    </button>
                    <div>
                        <h3 className="font-bold text-lg leading-tight m-0">{activeOrder.buyerName}</h3>
                        <p className="text-secondary text-sm m-0">Negotiating: {relatedListing?.cropName}</p>
                    </div>
                </div>

                <div className="negotiation-messages">
                    <div className="text-center text-xs text-secondary my-2">Today, {activeOrder.timestamp}</div>
                    <div className="neg-bubble buyer">
                        Hello, I am interested in your {relatedListing?.cropName}. I want to buy {activeOrder.requestedQuantity}kg.
                    </div>
                    <div className="neg-bubble buyer">
                        Your listed price is ₹{relatedListing?.pricePerKg}/kg, but I can offer <strong>₹{activeOrder.bidPrice}/kg</strong> for this quantity. Can we close the deal?
                    </div>
                    {/* Mock static responses for UI demo */}
                    <div className="neg-bubble seller">
                        Hi {activeOrder.buyerName}. The quality is premium {relatedListing?.grade}. How about we meet in the middle at ₹{(relatedListing!.pricePerKg + activeOrder.bidPrice) / 2}/kg?
                    </div>
                </div>

                <div className="negotiation-footer">
                    <div className="action-row mb-4">
                        <button className="btn bg-red-100 text-red-600 border border-red-200 py-3" onClick={() => handleRejectOrder(activeOrder.id)}>
                            <XCircle size={18} /> Reject Bid
                        </button>
                        <button className="btn bg-green-600 text-white py-3 shadow-md" onClick={() => handleAcceptOrder(activeOrder.id)}>
                            <CheckCircle2 size={18} /> Accept Deal
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" className="input-modern py-3 bg-gray-100" placeholder="Type counter offer..." />
                        <button className="bg-primary hover:bg-primary-dark transition-colors w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    const renderPaymentHistory = () => (
        <div className="content-padding">
            <button className="flex items-center text-primary-dark font-bold mb-4" onClick={() => setViewState('main')}>
                <ArrowLeft size={20} className="mr-2" /> Back to Market
            </button>
            <h2 className="text-2xl font-bold text-primary-dark mb-6">Payment History</h2>

            <div className="transaction-list">
                {transactions.map(t => (
                    <div key={t.id} className="transaction-item">
                        <div className="transaction-info">
                            <h4>{t.buyerName}</h4>
                            <p>{t.date}</p>
                        </div>
                        <div className="transaction-amount">
                            <span className="amt">₹{t.amount.toLocaleString('en-IN')}</span>
                            <span className={`stat ${t.status.toLowerCase()}`}>{t.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="market-container">
            {viewState !== 'chatNegotiation' && <TopBar title="Farmer Marketplace" />}

            {viewState === 'main' && renderMainScreen()}
            {viewState === 'addProduct' && renderAddProductForm()}
            {viewState === 'chatNegotiation' && renderChatNegotiation()}
            {viewState === 'paymentHistory' && renderPaymentHistory()}

        </div>
    );
};

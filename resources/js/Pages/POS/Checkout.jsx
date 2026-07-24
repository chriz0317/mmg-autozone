import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Checkout({ auth, transactions = [], estimates = [], customers, flash, errors }) {
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState('estimates'); // 'estimates' or 'history'
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, Card, GCash
    const [searchQuery, setSearchQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['transactions', 'estimates', 'customers'], preserveScroll: true, preserveState: true });
        }, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredTransactions = transactions.filter(t => 
        (t.vehicle_model || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toString().includes(searchQuery)
    );
    const filteredEstimates = estimates.filter(e => (e.estimate_no + e.customer_name).toLowerCase().includes(searchQuery.toLowerCase()));

    // Add to cart function
    const addToCart = (item, type) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id && i.type === type);
            if (existing) {
                // If product, check stock
                if (type === 'product' && existing.quantity >= item.stock_quantity) {
                    alert(`Not enough stock. Only ${item.stock_quantity} available.`);
                    return prev;
                }
                return prev.map(i => i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i);
            }
            // New item
            if (type === 'product' && item.stock_quantity < 1) {
                alert('Out of stock!');
                return prev;
            }
            return [...prev, { 
                id: item.id, 
                type, 
                name: item.name, 
                price: Number(item.price), 
                quantity: 1, 
                originalItem: item,
                additionalChargeDesc: '',
                additionalChargeAmount: 0
            }];
        });
    };

    // Remove or decrement
    const updateQuantity = (id, type, delta) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.id === id && i.type === type) {
                    const newQ = i.quantity + delta;
                    if (newQ > 0) {
                        if (type === 'product' && newQ > i.originalItem.stock_quantity) {
                            alert(`Not enough stock. Only ${i.originalItem.stock_quantity} available.`);
                            return i;
                        }
                        return { ...i, quantity: newQ };
                    }
                    return null;
                }
                return i;
            }).filter(Boolean);
        });
    };

    const updateAdditionalCharge = (id, type, desc, amount) => {
        setCart(prev => prev.map(i => {
            if (i.id === id && i.type === type) {
                return { ...i, additionalChargeDesc: desc, additionalChargeAmount: Number(amount) || 0 };
            }
            return i;
        }));
    };

    const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity) + (item.additionalChargeAmount || 0), 0), [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) return alert('Cart is empty.');
        
        setIsProcessing(true);
        router.post(auth.user.role === 'admin' ? '/admin/pos/checkout' : '/pos/checkout', {
            items: cart.map(i => ({ 
                id: i.id, 
                type: i.type, 
                quantity: i.quantity, 
                price: i.price,
                additionalChargeDesc: i.additionalChargeDesc,
                additionalChargeAmount: i.additionalChargeAmount
            })),
            total_amount: totalAmount,
            payment_method: paymentMethod,
            customer_id: selectedCustomer || null,
            vehicle_model: vehicleModel
        }, {
            onSuccess: () => {
                setCart([]);
                setVehicleModel('');
                setSelectedCustomer('');
                setIsProcessing(false);
                alert('Transaction Completed Successfully!');
            },
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Point of Sale" />

            {/* Error/Success Banners */}
            {flash?.success && <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-500 p-4 mb-4 rounded-r-lg">{flash.success}</div>}
            {errors?.error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4 mb-4 rounded-r-lg">{errors.error}</div>}
            {Object.keys(errors).length > 0 && !errors.error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4 mb-4 rounded-r-lg">Please check the form for errors.</div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
                {/* ── LEFT: Item Selection ── */}
                <div className="flex-1 flex flex-col border border-[#1f1f1f] bg-[#111] rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[#1f1f1f] bg-[#0a0a0a]">
                        <input 
                            type="text" 
                            placeholder="Search products or services..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316] transition-colors"
                        />
                        <div className="flex gap-4 mt-6">
                            <button 
                                onClick={() => setActiveTab('estimates')}
                                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'estimates' ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-[#111] text-[#6b7280] border border-[#2a2a2a] hover:border-[#f97316]'}`}
                            >
                                Active Estimates
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'history' ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-[#111] text-[#6b7280] border border-[#2a2a2a] hover:border-[#f97316]'}`}
                            >
                                Transaction History
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {activeTab === 'estimates' && filteredEstimates.map(estimate => (
                                <div key={estimate.id} className="relative flex flex-col text-left bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden hover:border-[#f97316] transition-all group">
                                    <button 
                                        onClick={() => addToCart({ ...estimate, name: 'Quote: ' + estimate.estimate_no, price: estimate.net_due || 0 }, 'estimate')}
                                        className="flex-1 p-4 flex flex-col text-left hover:bg-[#1a1a1a]"
                                    >
                                        <div className="absolute top-0 right-0 px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-bl-lg">FORMAL QUOTE</div>
                                        <span className="text-xs font-bold text-[#6b7280] mb-1">{estimate.estimate_no}</span>
                                        <span className="text-sm font-bold text-white mb-2">{estimate.customer_name}</span>
                                        <span className="text-xs text-[#9ca3af] mb-3 flex-1">{estimate.vehicle_model}</span>
                                        <span className="text-[#f97316] font-black text-lg">₱{Number(estimate.net_due || 0).toLocaleString()}</span>
                                    </button>
                                    <div className="p-2 border-t border-[#1f1f1f] bg-[#0a0a0a]">
                                        <a href={`/admin/repair-estimates/${estimate.id}/pdf`} target="_blank" rel="noreferrer" className="w-full text-center block text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa] py-1">
                                            🖨️ Print Quotation
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'history' && (
                                <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#1a1a1a] border-b border-[#2a2a2a] text-xs uppercase tracking-widest text-[#6b7280]">
                                                <th className="p-4 font-black">Txn ID</th>
                                                <th className="p-4 font-black">Date</th>
                                                <th className="p-4 font-black">Vehicle</th>
                                                <th className="p-4 font-black">Payment</th>
                                                <th className="p-4 font-black text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-[#6b7280]">No transactions found.</td>
                                                </tr>
                                            ) : (
                                                filteredTransactions.map(txn => (
                                                    <tr key={txn.id} className="border-b border-[#1f1f1f] hover:bg-[#161616] transition-colors">
                                                        <td className="p-4 font-bold text-white">#{txn.id}</td>
                                                        <td className="p-4 text-[#9ca3af]">{new Date(txn.created_at).toLocaleDateString()}</td>
                                                        <td className="p-4 text-[#9ca3af]">{txn.vehicle_model || '-'}</td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/30">
                                                                {txn.payment_method}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-black text-[#f97316] text-right">₱{Number(txn.total_amount).toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Cart & Checkout ── */}
                <div className="w-full lg:w-[450px] bg-[#111] flex flex-col border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[#1f1f1f] bg-[#0a0a0a]">
                        <h2 className="text-xl font-black text-white tracking-wide">Current Order</h2>
                    </div>    
                    <div className="space-y-3 p-6">
                            <select 
                                value={selectedCustomer} 
                                onChange={e => setSelectedCustomer(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                ))}
                            </select>
                            <input 
                                type="text"
                                placeholder="Vehicle Model (e.g. Honda Civic)"
                                value={vehicleModel}
                                onChange={e => setVehicleModel(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                            />
                        </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center text-[#6b7280] text-sm mt-10">Cart is empty</div>
                        ) : (
                            cart.map(item => (
                                <div key={`${item.type}-${item.id}`} className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{item.name}</p>
                                            <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">{item.type}</span>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id, item.type)} className="text-[#ef4444] hover:text-red-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center gap-3 bg-[#111] rounded-lg border border-[#2a2a2a] px-2 py-1">
                                            <button onClick={() => updateQuantity(item.id, item.type, -1)} className="text-[#6b7280] hover:text-white px-1">-</button>
                                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.type, 1)} className="text-[#6b7280] hover:text-white px-1">+</button>
                                        </div>
                                        <span className="text-sm font-bold text-white">₱{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                    
                                    {/* Additional Charges Section for Intakes */}
                                    {item.type === 'intake' && (
                                        <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                                            <p className="text-[10px] uppercase tracking-wider text-[#6b7280] mb-2">Additional Charges</p>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Description (e.g., Extra oil)"
                                                    value={item.additionalChargeDesc || ''}
                                                    onChange={e => updateAdditionalCharge(item.id, item.type, e.target.value, item.additionalChargeAmount)}
                                                    className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                                                />
                                                <input 
                                                    type="number" 
                                                    placeholder="Amount (₱)"
                                                    value={item.additionalChargeAmount || ''}
                                                    onChange={e => updateAdditionalCharge(item.id, item.type, item.additionalChargeDesc, e.target.value)}
                                                    className="w-24 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-[#1f1f1f] bg-[#111]">
                        <div className="flex justify-between mb-4 text-[#9ca3af]">
                            <span>Subtotal</span>
                            <span>₱{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-2xl font-black text-white">
                            <span>Total</span>
                            <span className="text-[#f97316]">₱{totalAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {['Cash', 'Card', 'GCash'].map(method => (
                                <button 
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${paymentMethod === method ? 'bg-[#2a2a2a] border-[#f97316] text-[#f97316]' : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#6b7280] hover:border-[#4b5563]'}`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isProcessing}
                            className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-wider transition-all ${cart.length === 0 || isProcessing ? 'bg-[#2a2a2a] text-[#6b7280] cursor-not-allowed' : 'bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:scale-[1.02] shadow-lg shadow-orange-500/20'}`}
                        >
                            {isProcessing ? 'Processing...' : 'Charge ₱' + totalAmount.toLocaleString()}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

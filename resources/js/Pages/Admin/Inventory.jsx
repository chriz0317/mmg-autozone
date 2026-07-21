import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Inventory({ items, flash }) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        type: 'product',
        stock_quantity: 0,
        price: 0,
        cost: 0
    });

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setData({
                name: item.name,
                type: item.type,
                stock_quantity: item.stock_quantity,
                price: Number(item.price),
                cost: Number(item.cost)
            });
        } else {
            setEditingItem(null);
            reset();
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(`/admin/inventory/${editingItem.id}`, {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post('/admin/inventory', {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            destroy(`/admin/inventory/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Inventory Management" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-wide">Inventory Management</h1>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg hover:scale-105 transition-transform"
                    >
                        + Add Item
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-500 p-4 mb-6 rounded-r-lg">
                        {flash.success}
                    </div>
                )}

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a1a1a] border-b border-[#2a2a2a] text-xs uppercase tracking-widest text-[#6b7280]">
                                <th className="p-4 font-black">Item Name</th>
                                <th className="p-4 font-black">Type</th>
                                <th className="p-4 font-black">Stock</th>
                                <th className="p-4 font-black">Cost</th>
                                <th className="p-4 font-black">Selling Price</th>
                                <th className="p-4 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#6b7280]">No inventory items found. Add some!</td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} className="border-b border-[#1f1f1f] hover:bg-[#161616] transition-colors">
                                        <td className="p-4 font-bold text-white">{item.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.type === 'product' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'bg-purple-500/10 text-purple-500 border border-purple-500/30'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-black ${item.stock_quantity < 5 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {item.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#9ca3af]">₱{Number(item.cost).toLocaleString()}</td>
                                        <td className="p-4 font-bold text-[#f97316]">₱{Number(item.price).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openModal(item)} className="text-[#3b82f6] hover:underline mr-4 text-sm font-bold">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-[#ef4444] hover:underline text-sm font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center">
                            <h2 className="text-xl font-black text-white tracking-wide">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-[#6b7280] hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Item Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Item Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]">
                                    <option value="product">Product (Sold directly in POS)</option>
                                    <option value="material">Material (Consumed by Services)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Stock Quantity</label>
                                <input type="number" min="0" value={data.stock_quantity} onChange={e => setData('stock_quantity', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Cost (₱)</label>
                                    <input type="number" min="0" step="0.01" value={data.cost} onChange={e => setData('cost', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Selling Price (₱)</label>
                                    <input type="number" min="0" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm border border-[#2a2a2a] hover:bg-[#222] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="flex-1 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

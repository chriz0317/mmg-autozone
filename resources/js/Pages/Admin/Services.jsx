import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Services({ services, materials, flash }) {
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        description: '',
        price: 0,
        materials: [] // { inventory_item_id, quantity_required }
    });

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setData({
                name: service.name,
                description: service.description || '',
                price: Number(service.price),
                materials: service.materials.map(m => ({
                    inventory_item_id: m.inventory_item_id,
                    quantity_required: m.quantity_required
                }))
            });
        } else {
            setEditingService(null);
            reset();
        }
        setShowModal(true);
    };

    const handleAddMaterial = () => {
        setData('materials', [...data.materials, { inventory_item_id: materials[0]?.id || '', quantity_required: 1 }]);
    };

    const handleRemoveMaterial = (index) => {
        const newMats = [...data.materials];
        newMats.splice(index, 1);
        setData('materials', newMats);
    };

    const handleMaterialChange = (index, field, value) => {
        const newMats = [...data.materials];
        newMats[index][field] = value;
        setData('materials', newMats);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            put(`/admin/services/${editingService.id}`, { onSuccess: () => setShowModal(false) });
        } else {
            post('/admin/services', { onSuccess: () => setShowModal(false) });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            destroy(`/admin/services/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6 md:p-10">
            <Head title="Service Configurator" />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="text-[#6b7280] text-sm hover:text-white mb-2 inline-block">← Back to Dashboard</Link>
                        <h1 className="text-3xl font-black text-white tracking-wide">Service Configurator</h1>
                        <p className="text-[#9ca3af] text-sm mt-1">Define services and the materials they consume.</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg hover:scale-105 transition-transform"
                    >
                        + Add Service
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-500 p-4 mb-6 rounded-r-lg">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-[#111] border border-[#1f1f1f] p-6 rounded-2xl relative group">
                            <h2 className="text-xl font-bold text-white mb-2">{service.name}</h2>
                            <p className="text-sm text-[#6b7280] mb-4 h-10 line-clamp-2">{service.description}</p>
                            <p className="text-[#f97316] font-black text-2xl mb-6">₱{Number(service.price).toLocaleString()}</p>
                            
                            <div className="mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2 border-b border-[#2a2a2a] pb-2">Materials Consumed:</h3>
                                {service.materials.length > 0 ? (
                                    <ul className="space-y-1">
                                        {service.materials.map((m, i) => (
                                            <li key={i} className="text-sm text-[#9ca3af] flex justify-between">
                                                <span>{m.inventory_item?.name || 'Unknown'}</span>
                                                <span className="text-[#d1d5db]">x {m.quantity_required}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-[#4b5563] italic">No materials required.</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => openModal(service)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-2 rounded-lg font-bold text-sm hover:border-[#f97316] transition-colors">Edit</button>
                                <button onClick={() => handleDelete(service.id)} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-500/20 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center sticky top-0 bg-[#111] z-10">
                            <h2 className="text-xl font-black text-white tracking-wide">{editingService ? 'Edit Service' : 'New Service'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-[#6b7280] hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Service Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Description</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows="3" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]"></textarea>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">Selling Price (₱)</label>
                                    <input type="number" min="0" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316]" />
                                </div>
                            </div>

                            <div className="border-t border-[#1f1f1f] pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b7280]">Required Materials</label>
                                    <button type="button" onClick={handleAddMaterial} className="text-[#f97316] text-xs font-bold hover:underline">+ Add Material</button>
                                </div>
                                
                                {data.materials.length === 0 ? (
                                    <p className="text-sm text-[#4b5563] italic">No materials assigned.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {data.materials.map((mat, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <select value={mat.inventory_item_id} onChange={e => handleMaterialChange(idx, 'inventory_item_id', e.target.value)} required className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#f97316]">
                                                    <option value="">Select Material...</option>
                                                    {materials.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                                <input type="number" min="1" value={mat.quantity_required} onChange={e => handleMaterialChange(idx, 'quantity_required', e.target.value)} required placeholder="Qty" className="w-24 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#f97316]" />
                                                <button type="button" onClick={() => handleRemoveMaterial(idx)} className="text-red-500 hover:text-red-400 px-2">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm border border-[#2a2a2a] hover:bg-[#222] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="flex-1 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Save Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

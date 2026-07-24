import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RepairEstimatesCreate({ intake }) {
    const { data, setData, post, processing, errors } = useForm({
        intake_id: intake?.id || null,
        customer_name: intake?.customer || '',
        address: '',
        contact_no: intake?.contact_no || '',
        insurance: '',
        reference_no: intake?.reference_number || '',
        days_of_repair: '10 WORKING DAYS',
        prepared_by: '',
        vehicle_model: intake?.vehicle || '',
        plate_no: intake?.plate_no || '',
        color: '',
        frame_no: '',
        date: new Date().toISOString().split('T')[0],
        
        items: [],
        
        subtotal_parts: 0,
        subtotal_labor: 0,
        vat_percentage: 12,
        vat_amount: 0,
        deductible: 0,
        depreciation: 0,
        discount_amount: 0,
        discount_notes: '',
        net_due: 0
    });

    const [newItem, setNewItem] = useState({
        qty: 1, description: '', unit: 'pc', parts_cost: '', labor_cost: ''
    });

    const addItem = () => {
        if (!newItem.description) return;
        setData('items', [...data.items, { ...newItem, parts_cost: Number(newItem.parts_cost) || 0, labor_cost: Number(newItem.labor_cost) || 0 }]);
        setNewItem({ qty: 1, description: '', unit: 'pc', parts_cost: '', labor_cost: '' });
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    // Calculate totals automatically
    useEffect(() => {
        let parts = 0;
        let labor = 0;
        data.items.forEach(item => {
            parts += Number(item.parts_cost) || 0;
            labor += Number(item.labor_cost) || 0;
        });
        
        const sub_total = parts + labor;
        const vat = (data.vat_percentage / 100) * sub_total;
        
        const total = sub_total + vat;
        const net = total - Number(data.deductible) - Number(data.depreciation) - Number(data.discount_amount);
        
        setData(d => ({
            ...d,
            subtotal_parts: parts,
            subtotal_labor: labor,
            vat_amount: vat,
            net_due: net
        }));
    }, [data.items, data.vat_percentage, data.deductible, data.depreciation, data.discount_amount]);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/repair-estimates');
    };

    return (
        <AdminLayout>
            <form onSubmit={submit} className="max-w-6xl mx-auto space-y-6 pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Create Repair Estimate</h2>
                        <p className="text-[#9ca3af] mt-2">Build a formal quotation with parts, labor, and deductions.</p>
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Estimate'}
                    </button>
                </div>

                {/* Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4 shadow-xl">
                        <h3 className="text-sm font-black tracking-widest uppercase text-orange-500 mb-4 border-b border-[#2a2a2a] pb-2">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Customer Name *</label>
                                <input required type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Address</label>
                                <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Contact No</label>
                                <input type="text" value={data.contact_no} onChange={e => setData('contact_no', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Date</label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Insurance</label>
                                <input type="text" value={data.insurance} onChange={e => setData('insurance', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" placeholder="-" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Reference No</label>
                                <input type="text" value={data.reference_no} onChange={e => setData('reference_no', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" placeholder="-" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4 shadow-xl">
                        <h3 className="text-sm font-black tracking-widest uppercase text-orange-500 mb-4 border-b border-[#2a2a2a] pb-2">Vehicle Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Vehicle Model *</label>
                                <input required type="text" value={data.vehicle_model} onChange={e => setData('vehicle_model', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" placeholder="2023 TOYOTA AVANZA" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Plate No</label>
                                <input type="text" value={data.plate_no} onChange={e => setData('plate_no', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Color</label>
                                <input type="text" value={data.color} onChange={e => setData('color', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Frame No</label>
                                <input type="text" value={data.frame_no} onChange={e => setData('frame_no', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Prepared By</label>
                                <input type="text" value={data.prepared_by} onChange={e => setData('prepared_by', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Days of Repair</label>
                                <input type="text" value={data.days_of_repair} onChange={e => setData('days_of_repair', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl space-y-6">
                    <h3 className="text-sm font-black tracking-widest uppercase text-orange-500 border-b border-[#2a2a2a] pb-2">Line Items</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white">
                            <thead className="text-xs uppercase bg-[#1a1a1a] text-[#6b7280]">
                                <tr>
                                    <th className="p-3 text-center">Qty.</th>
                                    <th className="p-3 text-center">Unit</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 text-right">Parts Cost</th>
                                    <th className="p-3 text-right">Labor Cost</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((it, i) => (
                                    <tr key={i} className="border-b border-[#1f1f1f]">
                                        <td className="p-3 text-center font-bold text-white">{it.qty}</td>
                                        <td className="p-3 text-center font-bold text-[#6b7280]">{it.unit}</td>
                                        <td className="p-3 font-bold">{it.description}</td>
                                        <td className="p-3 text-right text-orange-400">{Number(it.parts_cost) > 0 ? Number(it.parts_cost).toLocaleString() : ''}</td>
                                        <td className="p-3 text-right text-orange-400">{Number(it.labor_cost) > 0 ? Number(it.labor_cost).toLocaleString() : ''}</td>
                                        <td className="p-3 text-right">
                                            <button type="button" onClick={() => removeItem(i)} className="text-red-500 font-black">X</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-[#1a1a1a]">
                                    <td className="p-3"><input type="number" min="1" value={newItem.qty} onChange={e=>setNewItem({...newItem, qty: e.target.value})} className="w-20 bg-[#2a2a2a] text-white p-2 rounded text-xs text-center mx-auto block" /></td>
                                    <td className="p-3"><input type="text" placeholder="e.g. pc" value={newItem.unit} onChange={e=>setNewItem({...newItem, unit: e.target.value})} className="w-20 bg-[#2a2a2a] text-white p-2 rounded text-xs text-center mx-auto block" /></td>
                                    <td className="p-3"><input type="text" placeholder="e.g. HOOD PANEL" value={newItem.description} onChange={e=>setNewItem({...newItem, description: e.target.value})} className="w-full bg-[#2a2a2a] text-white p-2 rounded text-xs" /></td>
                                    <td className="p-3"><input type="number" placeholder="0.00" value={newItem.parts_cost} onChange={e=>setNewItem({...newItem, parts_cost: e.target.value})} className="w-full bg-[#2a2a2a] text-white p-2 rounded text-xs text-right" /></td>
                                    <td className="p-3"><input type="number" placeholder="0.00" value={newItem.labor_cost} onChange={e=>setNewItem({...newItem, labor_cost: e.target.value})} className="w-full bg-[#2a2a2a] text-white p-2 rounded text-xs text-right" /></td>
                                    <td className="p-3 text-right"><button type="button" onClick={addItem} className="px-3 py-2 bg-green-600 rounded text-xs font-black text-white hover:bg-green-500">ADD</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deductions and Totals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl space-y-4">
                        <h3 className="text-sm font-black tracking-widest uppercase text-orange-500 mb-4 border-b border-[#2a2a2a] pb-2">Deductions & Discounts</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">VAT Percentage (%)</label>
                                <input type="number" value={data.vat_percentage} onChange={e => setData('vat_percentage', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm text-right" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Deductible (₱)</label>
                                <input type="number" value={data.deductible} onChange={e => setData('deductible', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm text-right" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Depreciation (₱)</label>
                                <input type="number" value={data.depreciation} onChange={e => setData('depreciation', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm text-right" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Discount Amount (₱)</label>
                                <input type="number" value={data.discount_amount} onChange={e => setData('discount_amount', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm text-right" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Discount Notes</label>
                                <input type="text" placeholder="e.g. 20% on Labor" value={data.discount_notes} onChange={e => setData('discount_notes', e.target.value)} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-black tracking-widest uppercase text-orange-500 mb-4 border-b border-[#2a2a2a] pb-2">Estimate Totals</h3>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>TOTAL PARTS</span>
                                <span>{data.subtotal_parts.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>LABOR</span>
                                <span>{data.subtotal_labor.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>{data.vat_percentage}% VAT</span>
                                <span>{data.vat_amount.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                            <div className="pt-2 border-t border-[#1f1f1f] flex justify-between font-bold text-white">
                                <span>TOTAL</span>
                                <span>{(data.subtotal_parts + data.subtotal_labor + data.vat_amount).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                            {Number(data.deductible) > 0 && (
                                <div className="flex justify-between text-red-400">
                                    <span>LESS: DEDUCTIBLE</span>
                                    <span>({Number(data.deductible).toLocaleString(undefined, {minimumFractionDigits:2})})</span>
                                </div>
                            )}
                            {Number(data.depreciation) > 0 && (
                                <div className="flex justify-between text-red-400">
                                    <span>LESS: DEPRECIATION</span>
                                    <span>({Number(data.depreciation).toLocaleString(undefined, {minimumFractionDigits:2})})</span>
                                </div>
                            )}
                            {Number(data.discount_amount) > 0 && (
                                <div className="flex justify-between text-red-400">
                                    <span>DISCOUNT {data.discount_notes && `(${data.discount_notes})`}</span>
                                    <span>({Number(data.discount_amount).toLocaleString(undefined, {minimumFractionDigits:2})})</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-[#1f1f1f] flex justify-between font-black text-xl text-green-400">
                                <span>NET DUE</span>
                                <span>₱ {data.net_due.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RepairEstimatesIndex({ estimates }) {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Repair Estimates</h2>
                        <p className="text-[#9ca3af] mt-2">Manage formal quotations and repair estimates.</p>
                    </div>
                    <Link 
                        href="/admin/repair-estimates/create"
                        className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider transition-colors shadow-lg shadow-orange-900/20"
                    >
                        + Create Formal Estimate
                    </Link>
                </div>

                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-[#d1d5db]">
                            <thead className="text-xs uppercase bg-[#1a1a1a] text-[#6b7280]">
                                <tr>
                                    <th className="p-4 font-black tracking-widest">Est. No</th>
                                    <th className="p-4 font-black tracking-widest">Customer</th>
                                    <th className="p-4 font-black tracking-widest">Vehicle</th>
                                    <th className="p-4 font-black tracking-widest text-right">Net Due (₱)</th>
                                    <th className="p-4 font-black tracking-widest">Date</th>
                                    <th className="p-4 font-black tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimates.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-[#6b7280]">
                                            No estimates found. Click "Create Formal Estimate" to generate one.
                                        </td>
                                    </tr>
                                ) : (
                                    estimates.map((est) => (
                                        <tr key={est.id} className="border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition-colors">
                                            <td className="p-4 font-bold text-white">#{est.estimate_no}</td>
                                            <td className="p-4">{est.customer_name}</td>
                                            <td className="p-4">{est.vehicle_model} {est.plate_no && `(${est.plate_no})`}</td>
                                            <td className="p-4 text-right font-black text-orange-400">
                                                {Number(est.net_due).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="p-4">{new Date(est.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-right space-x-4">
                                                <a 
                                                    href={`/admin/repair-estimates/${est.id}/pdf`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="font-bold text-xs uppercase tracking-widest text-[#3b82f6] hover:underline"
                                                >
                                                    Print PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

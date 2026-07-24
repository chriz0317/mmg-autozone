import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RepairEstimatesIndex({ estimates, intakes = [] }) {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8">
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

                {/* Active Vehicles Section (Intakes) */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black tracking-widest text-[#f97316] uppercase">Vehicles In Shop</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {intakes.length === 0 ? (
                            <p className="text-[#6b7280] text-sm">No vehicles currently in the shop.</p>
                        ) : (
                            intakes.map(intake => (
                                <div key={intake.id} className="bg-[#111111] border border-[#2a2a2a] p-4 rounded-xl flex flex-col justify-between hover:border-[#4a4a4a] transition-colors">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono text-[#6b7280]">{intake.reference_number}</span>
                                            {intake.repair_estimate ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-black tracking-widest uppercase rounded">Est Generated</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase rounded">Needs Estimate</span>
                                            )}
                                        </div>
                                        <h4 className="text-white font-bold">{intake.customer || 'Guest Customer'}</h4>
                                        <p className="text-sm text-[#9ca3af]">{intake.vehicle}</p>
                                        <p className="text-xs text-[#6b7280] mt-1 line-clamp-1">{intake.complaints || intake.scope_of_works}</p>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex justify-end gap-3">
                                        {intake.repair_estimate ? (
                                            <a 
                                                href={`/admin/repair-estimates/${intake.repair_estimate.id}/pdf`}
                                                target="_blank" rel="noreferrer"
                                                className="text-xs font-black text-green-500 hover:underline uppercase tracking-widest"
                                            >
                                                Print PDF (₱{Number(intake.repair_estimate.net_due).toLocaleString()})
                                            </a>
                                        ) : (
                                            <Link 
                                                href={`/admin/repair-estimates/create?intake_id=${intake.id}`}
                                                className="text-xs font-black text-orange-500 hover:underline uppercase tracking-widest"
                                            >
                                                Create Estimate
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Generated Estimates Table */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black tracking-widest text-[#f97316] uppercase">All Generated Estimates</h3>
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
            </div>
        </AdminLayout>
    );
}

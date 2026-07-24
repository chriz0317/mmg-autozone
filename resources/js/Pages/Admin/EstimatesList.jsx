import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function EstimatesList({ auth, estimates }) {
    const [selectedEstimate, setSelectedEstimate] = useState(null);
    const { data, setData, patch, processing } = useForm({
        status: 'Pending',
        estimated_cost: '',
        admin_remarks: ''
    });

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const openReviewModal = (est) => {
        setSelectedEstimate(est);
        setData({
            status: est.status,
            estimated_cost: est.estimated_cost || '',
            admin_remarks: est.admin_remarks || ''
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        patch(`/admin/estimates/${selectedEstimate.id}`, {
            onSuccess: () => setSelectedEstimate(null)
        });
    };

    return (
        <AdminLayout>
            <Head title="Estimates - Admin Dashboard" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-[#1f1f1f] bg-[#111111] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs uppercase tracking-widest border-b border-[#1f1f1f] bg-[#0a0a0a] text-[#6b7280]">
                                        <th className="p-4 font-black">ID</th>
                                        <th className="p-4 font-black">Customer</th>
                                        <th className="p-4 font-black">Vehicle</th>
                                        <th className="p-4 font-black">Date</th>
                                        <th className="p-4 font-black">Status</th>
                                        <th className="p-4 font-black text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estimates.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-sm text-[#6b7280]">
                                                No estimates requested yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        estimates.map((est) => (
                                            <tr key={est.id} className="border-b border-[#1f1f1f] transition-colors hover:bg-[#1a1a1a]">
                                                <td className="p-4 font-bold text-white">#{est.id}</td>
                                                <td className="p-4 text-sm text-[#9ca3af]">{est.user?.name}</td>
                                                <td className="p-4 text-sm text-[#9ca3af]">{est.vehicle_model}</td>
                                                <td className="p-4 text-sm text-[#9ca3af]">
                                                    {new Date(est.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                                        ${est.status === 'Approved' ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.3)]' :
                                                          est.status === 'Rejected' ? 'bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-[rgba(239,68,68,0.3)]' :
                                                          est.status === 'Reviewed' ? 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]' :
                                                          'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.3)]'}`}
                                                    >
                                                        {est.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => openReviewModal(est)} className="font-bold text-xs uppercase tracking-widest text-[#f97316] hover:underline">
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            {/* Modal */}
            {selectedEstimate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center">
                            <h2 className="text-xl font-black text-white">Review Estimate #{selectedEstimate.id}</h2>
                            <button onClick={() => setSelectedEstimate(null)} className="text-[#6b7280] hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Issue Description</h3>
                                <p className="text-sm text-[#d1d5db] mb-6 whitespace-pre-wrap leading-relaxed">{selectedEstimate.issue_description}</p>
                                
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Photos</h3>
                                {selectedEstimate.photos && selectedEstimate.photos.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedEstimate.photos.map((p, i) => (
                                            <a key={i} href={p} target="_blank" rel="noreferrer" className="block aspect-video rounded-lg overflow-hidden border border-[#2a2a2a]">
                                                <img src={p} alt="Damage" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#6b7280]">No photos provided.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Shop Decision</h3>
                                <form onSubmit={submitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#9ca3af] mb-1">Status</label>
                                        <select 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white outline-none focus:border-[#f97316]"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewed">Reviewed (Need more info)</option>
                                            <option value="Approved">Approved (Ready for drop-off)</option>
                                            <option value="unavailable">Service Unavailable</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#9ca3af] mb-1">Baseline Cost Estimate (₱)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={data.estimated_cost} 
                                            onChange={e => setData('estimated_cost', e.target.value)}
                                            placeholder="e.g. 15000.00"
                                            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white outline-none focus:border-[#f97316]"
                                        />
                                        <p className="text-[10px] text-[#6b7280] mt-1">Leave empty if you cannot determine the cost.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#9ca3af] mb-1">Shop Remarks to Customer</label>
                                        <textarea 
                                            rows="4"
                                            value={data.admin_remarks} 
                                            onChange={e => setData('admin_remarks', e.target.value)}
                                            placeholder="Please bring your car on Monday. The bumper will need replacement..."
                                            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white outline-none focus:border-[#f97316] resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 border-t border-[#1f1f1f] flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="w-full sm:w-auto">
                                            {selectedEstimate.status === 'Approved' && (
                                                <a href={`/intake?estimate_id=${selectedEstimate.id}`} target="_blank" rel="noreferrer" className="block px-4 py-2 text-center rounded-lg text-sm font-bold text-white bg-[#22c55e] hover:bg-[#16a34a] transition-colors">
                                                    Create Intake Form
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex w-full sm:w-auto justify-end gap-3">
                                            <button type="button" onClick={() => setSelectedEstimate(null)} className="px-4 py-2 text-sm font-bold text-[#9ca3af] hover:text-white">
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={processing} className="px-6 py-2 rounded-lg text-sm font-black text-white bg-[#f97316] hover:bg-[#ea580c] transition-colors disabled:opacity-50">
                                                {processing ? 'Saving...' : 'Save & Notify'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

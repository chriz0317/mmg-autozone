import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function ServicesList({ auth, serviceRequests }) {
    const [activeTab, setActiveTab] = useState('photo_estimate');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const { data, setData, patch, processing } = useForm({
        status: 'Pending',
        estimated_cost: '',
        admin_remarks: ''
    });

    const filteredRequests = serviceRequests.filter(req => req.service_type === activeTab);

    const openReviewModal = (req) => {
        setSelectedRequest(req);
        setData({
            status: req.status,
            estimated_cost: req.estimated_cost || '',
            admin_remarks: req.admin_remarks || ''
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        patch(`/admin/services/${selectedRequest.id}`, {
            onSuccess: () => setSelectedRequest(null)
        });
    };

    return (
        <AdminLayout>
            <Head title="Service Requests - Admin Dashboard" />

            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['photo_estimate', 'repair', 'repaint'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#f97316] text-white' : 'bg-[#1a1a1a] text-[#6b7280] hover:text-white border border-[#2a2a2a]'}`}
                        >
                            {tab === 'photo_estimate' && '📸 Photo Estimates'}
                            {tab === 'repair' && '🔧 Auto Repair'}
                            {tab === 'repaint' && '🎨 Auto Repaint'}
                        </button>
                    ))}
                </div>

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
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-sm text-[#6b7280]">
                                            No requests in this category yet.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="border-b border-[#1f1f1f] transition-colors hover:bg-[#1a1a1a]">
                                            <td className="p-4 font-bold text-white">#{req.id}</td>
                                            <td className="p-4 text-sm text-[#9ca3af]">
                                                {req.name || req.user?.name || 'Guest'}
                                                {req.contact_no && <div className="text-xs text-[#6b7280]">{req.contact_no}</div>}
                                            </td>
                                            <td className="p-4 text-sm text-[#9ca3af]">{req.vehicle_model} {req.plate_no && `(${req.plate_no})`}</td>
                                            <td className="p-4 text-sm text-[#9ca3af]">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                                    req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    req.status === 'Reviewed' ? 'bg-blue-500/20 text-blue-400' :
                                                    req.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {req.status === 'Rejected' ? 'Service Unavailable' : req.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openReviewModal(req)} className="font-bold text-xs uppercase tracking-widest text-[#f97316] hover:underline">
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
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-black text-white capitalize">
                                {selectedRequest.service_type.replace('_', ' ')} Request #{selectedRequest.id}
                            </h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-[#6b7280] hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Request Details Section */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Customer Details</h3>
                                    <p className="text-sm text-[#d1d5db]">Name: {selectedRequest.name || selectedRequest.user?.name || 'Guest'}</p>
                                    <p className="text-sm text-[#d1d5db]">Contact: {selectedRequest.contact_no || 'N/A'}</p>
                                    <p className="text-sm text-[#d1d5db]">Email: {selectedRequest.email || selectedRequest.user?.email || 'N/A'}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Vehicle</h3>
                                    <p className="text-sm text-[#d1d5db]">{selectedRequest.vehicle_model} {selectedRequest.plate_no && `(${selectedRequest.plate_no})`}</p>
                                </div>

                                {selectedRequest.preferred_date && (
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Preferred Drop-off Date</h3>
                                        <p className="text-sm text-[#d1d5db]">{new Date(selectedRequest.preferred_date).toLocaleDateString()}</p>
                                    </div>
                                )}

                                {selectedRequest.service_type === 'repaint' && (
                                    <>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Areas to Repaint</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRequest.areas && selectedRequest.areas.map((area, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-[rgba(249,115,22,0.1)] text-[#f97316] rounded text-xs">{area}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {selectedRequest.color_preference && (
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Color Preference</h3>
                                                <p className="text-sm text-[#d1d5db]">{selectedRequest.color_preference}</p>
                                            </div>
                                        )}
                                        {selectedRequest.additional_notes && (
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Additional Notes</h3>
                                                <p className="text-sm text-[#d1d5db] whitespace-pre-wrap">{selectedRequest.additional_notes}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {(selectedRequest.service_type === 'photo_estimate' || selectedRequest.service_type === 'repair') && selectedRequest.issue_description && (
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Issue Description</h3>
                                        <p className="text-sm text-[#d1d5db] whitespace-pre-wrap leading-relaxed">{selectedRequest.issue_description}</p>
                                    </div>
                                )}
                                
                                {selectedRequest.service_type === 'photo_estimate' && (
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Photos</h3>
                                        {selectedRequest.photos && selectedRequest.photos.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedRequest.photos.map((p, i) => (
                                                    <a key={i} href={p} target="_blank" rel="noreferrer" className="block aspect-video rounded-lg overflow-hidden border border-[#2a2a2a]">
                                                        <img src={p} alt="Damage" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-[#6b7280]">No photos provided.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action Section */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Shop Decision</h3>
                                <form onSubmit={submitReview} className="space-y-4 bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f1f]">
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
                                            <option value="Rejected">Service Unavailable</option>
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
                                        <p className="text-[10px] text-orange-400 mt-1 font-semibold leading-tight">
                                            ⚠️ Note: Estimates given based on photos are NOT final. The actual cost may vary upon physical inspection. Leave empty if you cannot determine the cost yet.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#9ca3af] mb-1">Shop Remarks to Customer</label>
                                        <textarea 
                                            rows="4"
                                            value={data.admin_remarks} 
                                            onChange={e => setData('admin_remarks', e.target.value)}
                                            placeholder="Please bring your car on Monday..."
                                            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white outline-none focus:border-[#f97316] resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 border-t border-[#1f1f1f] flex justify-end gap-3">
                                        <button type="button" onClick={() => setSelectedRequest(null)} className="px-4 py-2 text-sm font-bold text-[#9ca3af] hover:text-white">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={processing} className="px-6 py-2 rounded-lg text-sm font-black text-white bg-[#f97316] hover:bg-[#ea580c] transition-colors disabled:opacity-50">
                                            {processing ? 'Saving...' : 'Save & Notify'}
                                        </button>
                                    </div>
                                </form>
                                {selectedRequest.status === 'Approved' && (
                                    <div className="mt-4">
                                        <a href={`/intake?estimate_id=${selectedRequest.id}`} target="_blank" rel="noreferrer" className="block w-full px-4 py-3 text-center rounded-xl text-sm font-black text-white bg-[#22c55e] hover:bg-[#16a34a] transition-colors shadow-lg shadow-green-900/20">
                                            📋 Create Job Order Intake Form
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

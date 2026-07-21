import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ServiceRequestDetails({ serviceRequest }) {
    return (
        <div className="min-h-screen font-sans antialiased bg-[#0a0a0a] text-white">
            <Head title={`${serviceRequest.service_type.replace('_', ' ').toUpperCase()} #${serviceRequest.id} — MMG Autozone`} />

            <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f] bg-[#111111]">
                <div className="flex items-center gap-3">
                    <img src="/images/bg2.png" alt="MMG Badge" className="w-10 h-10 object-cover rounded-full bg-white p-0.5" />
                    <h1 className="text-xl font-black tracking-widest text-white">MMG AUTOZONE</h1>
                </div>
                <Link href="/home" className="text-sm font-bold tracking-wider text-[#9ca3af] hover:text-white transition-colors">
                    Back to Home
                </Link>
            </div>

            <main className="max-w-4xl mx-auto py-10 px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2 capitalize">
                            {serviceRequest.service_type.replace('_', ' ')} Request #{serviceRequest.id}
                        </h2>
                        <p className="text-[#9ca3af] text-sm">Requested on {new Date(serviceRequest.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border self-start md:self-auto
                        ${serviceRequest.status === 'Approved' ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.3)]' :
                          serviceRequest.status === 'Rejected' ? 'bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-[rgba(239,68,68,0.3)]' :
                          serviceRequest.status === 'Reviewed' ? 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]' :
                          'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.3)]'}`}
                    >
                        {serviceRequest.status}
                    </div>
                </div>

                {serviceRequest.status === 'Approved' && (
                    <div className="mb-8 p-6 rounded-2xl border border-[#10b981] bg-[rgba(16,185,129,0.05)]">
                        <h3 className="text-xl font-black text-[#10b981] mb-2">Request Approved!</h3>
                        <p className="text-[#d1d5db] text-sm leading-relaxed mb-4">
                            Your request has been reviewed. The preliminary non-binding cost estimate is:
                        </p>
                        {serviceRequest.estimated_cost && (
                            <p className="text-4xl font-black text-white mb-4">
                                ₱{new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(serviceRequest.estimated_cost)}
                            </p>
                        )}
                        <p className="text-sm text-[#9ca3af] bg-[#111111] p-4 rounded-xl border border-[#1f1f1f]">
                            <strong>Shop Remarks:</strong> {serviceRequest.admin_remarks || 'No remarks provided.'}
                        </p>
                        <div className="mt-6">
                            <p className="text-[#10b981] font-bold text-sm">
                                You may now bring your vehicle to MMG Autozone for a physical inspection and final quotation.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#6b7280] mb-4">Request Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-[#6b7280]">Vehicle</p>
                                <p className="font-bold">{serviceRequest.vehicle_model} {serviceRequest.plate_no && `(${serviceRequest.plate_no})`}</p>
                            </div>
                            
                            {serviceRequest.preferred_date && (
                                <div>
                                    <p className="text-xs text-[#6b7280]">Preferred Drop-off Date</p>
                                    <p className="font-bold">{new Date(serviceRequest.preferred_date).toLocaleDateString()}</p>
                                </div>
                            )}

                            {serviceRequest.service_type === 'repaint' && (
                                <>
                                    <div>
                                        <p className="text-xs text-[#6b7280]">Areas to Repaint</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {serviceRequest.areas && serviceRequest.areas.map((area, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-[rgba(249,115,22,0.1)] text-[#f97316] rounded text-xs">{area}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {serviceRequest.color_preference && (
                                        <div>
                                            <p className="text-xs text-[#6b7280]">Color Preference</p>
                                            <p className="font-bold">{serviceRequest.color_preference}</p>
                                        </div>
                                    )}
                                    {serviceRequest.additional_notes && (
                                        <div>
                                            <p className="text-xs text-[#6b7280]">Additional Notes</p>
                                            <p className="text-sm mt-1 text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{serviceRequest.additional_notes}</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {(serviceRequest.service_type === 'photo_estimate' || serviceRequest.service_type === 'repair') && serviceRequest.issue_description && (
                                <div>
                                    <p className="text-xs text-[#6b7280]">Issue Description</p>
                                    <p className="text-sm mt-1 text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{serviceRequest.issue_description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {serviceRequest.service_type === 'photo_estimate' && (
                        <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#6b7280] mb-4">Uploaded Photos</h3>
                            {serviceRequest.photos && serviceRequest.photos.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {serviceRequest.photos.map((photo, idx) => (
                                        <a key={idx} href={photo} target="_blank" rel="noreferrer" className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] group block">
                                            <img src={photo} alt="Vehicle damage" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#6b7280]">No photos uploaded.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

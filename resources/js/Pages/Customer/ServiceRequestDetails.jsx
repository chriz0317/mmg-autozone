import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Read-only car diagram zones (matches EstimateForm.jsx)
const CAR_ZONES = [
    { id: 'front_bumper',      x: 68,  y: 8,   w: 164, h: 50,  rx: 15 },
    { id: 'hood',              x: 68,  y: 58,  w: 164, h: 110, rx: 4  },
    { id: 'left_fender',       x: 20,  y: 58,  w: 52,  h: 110, rx: 4  },
    { id: 'right_fender',      x: 228, y: 58,  w: 52,  h: 110, rx: 4  },
    { id: 'windshield',        x: 68,  y: 168, w: 164, h: 65,  rx: 4  },
    { id: 'left_front_door',   x: 20,  y: 168, w: 52,  h: 130, rx: 4  },
    { id: 'right_front_door',  x: 228, y: 168, w: 52,  h: 130, rx: 4  },
    { id: 'roof',              x: 68,  y: 233, w: 164, h: 65,  rx: 4  },
    { id: 'left_rear_door',    x: 20,  y: 298, w: 52,  h: 110, rx: 4  },
    { id: 'right_rear_door',   x: 228, y: 298, w: 52,  h: 110, rx: 4  },
    { id: 'rear_windshield',   x: 68,  y: 298, w: 164, h: 55,  rx: 4  },
    { id: 'trunk',             x: 68,  y: 353, w: 164, h: 95,  rx: 4  },
    { id: 'left_rear_fender',  x: 20,  y: 408, w: 52,  h: 40,  rx: 4  },
    { id: 'right_rear_fender', x: 228, y: 408, w: 52,  h: 40,  rx: 4  },
    { id: 'rear_bumper',       x: 68,  y: 448, w: 164, h: 44,  rx: 15 },
];

const SEVERITY_OPTIONS = [
    { id: 'light_scratch', label: 'Light Scratch', emoji: '〰️', color: '#f59e0b' },
    { id: 'dent',          label: 'Dent / Crease', emoji: '⚡', color: '#f97316' },
    { id: 'severe',        label: 'Severe Damage',  emoji: '💥', color: '#ef4444' },
];

const getZoneFill = (zoneId, damageMarkers) => {
    const m = damageMarkers?.find(d => d.area_id === zoneId);
    if (!m) return 'rgba(255,255,255,0.03)';
    if (m.severity === 'light_scratch') return 'rgba(245,158,11,0.5)';
    if (m.severity === 'dent')          return 'rgba(249,115,22,0.6)';
    return                                     'rgba(239,68,68,0.65)';
};
const getZoneStroke = (zoneId, damageMarkers) => {
    const m = damageMarkers?.find(d => d.area_id === zoneId);
    if (!m) return '#2a2a2a';
    if (m.severity === 'light_scratch') return '#f59e0b';
    if (m.severity === 'dent')          return '#f97316';
    return                                     '#ef4444';
};

function fmt(n) { return Number(n || 0).toLocaleString('en-PH'); }

export default function ServiceRequestDetails({ serviceRequest }) {
    const hasDiagram = serviceRequest.damage_markers?.length > 0;
    const hasBreakdown = serviceRequest.estimate_breakdown?.items?.length > 0;

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


                {/* ── DAMAGE DIAGRAM + ESTIMATE BREAKDOWN ── */}
                {(hasDiagram || hasBreakdown) && (
                    <div className="mb-8 rounded-2xl overflow-hidden border border-[#f97316]/40 shadow-[0_0_40px_rgba(249,115,22,0.06)]">
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#1a0f00,#111111)', borderBottom: '1px solid rgba(249,115,22,0.2)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-lg">📊</div>
                                <div>
                                    <h3 className="text-sm font-black text-white tracking-widest uppercase">Damage Assessment & Estimate</h3>
                                    <p className="text-[10px] text-[#f97316] font-bold uppercase tracking-widest">MMG Autozone Standard Rate · Rule-Based Pricing</p>
                                </div>
                            </div>
                            {serviceRequest.auto_approved && (
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/30">
                                    ✅ Auto-Approved
                                </span>
                            )}
                        </div>

                        <div className="p-6 space-y-6" style={{ background: '#0d0d0d' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Read-only diagram */}
                                {hasDiagram && (
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Marked Damage Areas</p>
                                        <div className="flex justify-center">
                                            <svg viewBox="0 0 300 500" className="w-full max-w-[170px]">
                                                <path d="M150,5 C185,5 235,15 245,40 L248,168 L248,298 L248,420 C248,465 210,495 150,495 C90,495 52,465 52,420 L52,298 L52,168 L55,40 C65,15 115,5 150,5 Z" fill="#141414" stroke="#2a2a2a" strokeWidth="1.5" />
                                                {CAR_ZONES.map(zone => (
                                                    <g key={zone.id}>
                                                        <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={zone.rx ?? 4}
                                                            fill={getZoneFill(zone.id, serviceRequest.damage_markers)}
                                                            stroke={getZoneStroke(zone.id, serviceRequest.damage_markers)}
                                                            strokeWidth={serviceRequest.damage_markers?.find(d => d.area_id === zone.id) ? 2 : 1}
                                                        />
                                                        {serviceRequest.damage_markers?.find(d => d.area_id === zone.id) && (
                                                            <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 5} textAnchor="middle" fontSize="12" className="pointer-events-none select-none">
                                                                {SEVERITY_OPTIONS.find(s => s.id === serviceRequest.damage_markers.find(d => d.area_id === zone.id).severity)?.emoji}
                                                            </text>
                                                        )}
                                                    </g>
                                                ))}
                                            </svg>
                                        </div>
                                        <div className="mt-3 space-y-1.5">
                                            {serviceRequest.damage_markers?.map((m, i) => {
                                                const opt = SEVERITY_OPTIONS.find(s => s.id === m.severity);
                                                return (
                                                    <div key={i} className="flex items-center gap-2 text-xs">
                                                        <span>{opt?.emoji}</span>
                                                        <span className="text-white font-semibold">{m.area_label}</span>
                                                        <span className="text-[#6b7280]">·</span>
                                                        <span style={{ color: opt?.color }} className="font-bold">{opt?.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Itemized breakdown */}
                                {hasBreakdown && (
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">Itemized Price Breakdown</p>
                                        <div className="rounded-xl overflow-hidden border border-[#1f1f1f]">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="bg-[#111111] text-[#6b7280]">
                                                        <th className="px-3 py-2 font-black">Area</th>
                                                        <th className="px-3 py-2 font-black text-right">Parts</th>
                                                        <th className="px-3 py-2 font-black text-right">Labor</th>
                                                        <th className="px-3 py-2 font-black text-right">Range</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {serviceRequest.estimate_breakdown.items.map((item, i) => {
                                                        const opt = SEVERITY_OPTIONS.find(s => s.id === item.severity);
                                                        return (
                                                            <tr key={i} className="border-t border-[#1f1f1f] hover:bg-[#111111] transition-colors">
                                                                <td className="px-3 py-2.5">
                                                                    <span className="text-white font-semibold">{item.area_label}</span>
                                                                    <br />
                                                                    <span className="text-[10px]" style={{ color: opt?.color }}>{opt?.emoji} {opt?.label}</span>
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right text-[#9ca3af]">
                                                                    ₱{fmt(item.parts_min)}–{fmt(item.parts_max)}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right text-[#9ca3af]">
                                                                    ₱{fmt(item.labor_min)}–{fmt(item.labor_max)}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right font-black text-[#f97316]">
                                                                    ₱{fmt(item.subtotal_min)}–{fmt(item.subtotal_max)}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex items-center justify-between bg-[#111111] border border-[#f97316]/20 rounded-xl p-4 mt-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Estimated Total Range</p>
                                                <p className="text-[9px] text-[#6b7280] mt-0.5">Subject to physical inspection</p>
                                            </div>
                                            <p className="text-xl font-black text-white">
                                                ₱{fmt(serviceRequest.estimate_breakdown.total_min)}
                                                <span className="text-[#6b7280] text-base"> – </span>
                                                ₱{fmt(serviceRequest.estimate_breakdown.total_max)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Non-binding disclaimer */}
                            <div className="flex items-start gap-3 p-4 rounded-xl border-l-4 border-[#f97316] bg-[rgba(249,115,22,0.05)]">
                                <span className="text-[#f97316] text-lg flex-shrink-0">⚠️</span>
                                <p className="text-xs text-[#9ca3af] leading-relaxed">
                                    <strong className="text-[#f97316]">Non-Binding Estimate.</strong> These prices are based on the MMG Autozone standard rate list and are for reference only. Final costs will be confirmed after a physical inspection at the shop.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STATUS PANELS ── */}
                {serviceRequest.status === 'Approved' && (
                    <div className="mb-8 p-6 rounded-2xl border border-[#10b981] bg-[rgba(16,185,129,0.05)]">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-3xl">✅</span>
                            <div>
                                <h3 className="text-xl font-black text-[#10b981] mb-1">
                                    {serviceRequest.auto_approved ? 'Auto-Approved!' : 'Request Approved!'}
                                </h3>
                                <p className="text-[#d1d5db] text-sm leading-relaxed">
                                    {serviceRequest.auto_approved
                                        ? 'Your repair qualifies for auto-approval based on the damage assessment. You may bring your vehicle to the shop!'
                                        : 'A mechanic has reviewed your request. You may now bring your vehicle to the shop.'}
                                </p>
                            </div>
                        </div>
                        {serviceRequest.estimated_cost && (
                            <p className="text-4xl font-black text-white mb-4">
                                ₱{new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(serviceRequest.estimated_cost)}
                                <span className="text-base font-normal text-[#6b7280] ml-2">(starting estimate)</span>
                            </p>
                        )}
                        {serviceRequest.admin_remarks && (
                            <p className="text-sm text-[#9ca3af] bg-[#111111] p-4 rounded-xl border border-[#1f1f1f] mb-4">
                                <strong className="text-white">Shop Remarks:</strong> {serviceRequest.admin_remarks}
                            </p>
                        )}
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

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

// ─── Helpers ────────────────────────────────────────────────────────────────
function daysRunning(createdAt) {
    const ms = Date.now() - new Date(createdAt).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function DaysBadge({ days }) {
    const color =
        days >= 8 ? { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444', border: 'rgba(239,68,68,0.35)'  } :
        days >= 4 ? { bg: 'rgba(234,179,8,0.12)',  text: '#eab308', border: 'rgba(234,179,8,0.35)'  } :
                    { bg: 'rgba(107,114,128,0.12)', text: '#9ca3af', border: 'rgba(107,114,128,0.3)' };

    const label = days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`;

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border"
            style={{ background: color.bg, color: color.text, borderColor: color.border }}>
            {days >= 8 && '⚠ '}
            {label}
        </span>
    );
}

function StatusBadge({ status }) {
    const map = {
        'Pending':          { bg: 'rgba(249,115,22,0.1)',  text: '#f97316', border: 'rgba(249,115,22,0.3)'  },
        'In Progress':      { bg: 'rgba(59,130,246,0.1)',  text: '#3b82f6', border: 'rgba(59,130,246,0.3)'  },
        'Ready for Pickup': { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.3)'  },
    };
    const c = map[status] ?? { bg: 'rgba(107,114,128,0.1)', text: '#9ca3af', border: 'rgba(107,114,128,0.3)' };
    return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
            style={{ background: c.bg, color: c.text, borderColor: c.border }}>
            {status}
        </span>
    );
}

// ─── Summary Cards ───────────────────────────────────────────────────────────
function SummaryCard({ label, value, color, icon }) {
    return (
        <div className="rounded-2xl p-5 border flex items-center gap-4"
            style={{ background: '#111111', borderColor: '#1f1f1f' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: '#6b7280' }}>{label}</p>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function UnitIn({ intakes, flash }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [releasingId, setReleasingId] = useState(null);

    const filtered = intakes.filter(u => {
        const matchesSearch =
            (u.customer ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (u.vehicle ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (u.plate_no ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (u.reference_number ?? '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleRelease = (intake) => {
        if (!confirm(`Release vehicle for ${intake.customer ?? 'this customer'}?\n\n${intake.reference_number} — ${intake.vehicle}\n\nThis will remove it from the Unit In tracker.`)) return;
        setReleasingId(intake.id);
        router.post(`/admin/intakes/${intake.id}/release`, {}, {
            onFinish: () => setReleasingId(null),
        });
    };

    // Computed stats
    const total   = intakes.length;
    const urgent  = intakes.filter(u => daysRunning(u.created_at) >= 8).length;
    const ready   = intakes.filter(u => u.status === 'Ready for Pickup').length;
    const inProg  = intakes.filter(u => u.status === 'In Progress').length;

    return (
        <AdminLayout>
            <Head title="Unit In — Workshop Tracker" />

            <div className="space-y-6">
                {/* Flash */}
                {flash?.success && (
                    <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 p-4 rounded-r-xl text-sm font-semibold">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard label="Units in Shop"        value={total}  color="#f97316" icon="🚗" />
                    <SummaryCard label="In Progress"          value={inProg} color="#3b82f6" icon="🔧" />
                    <SummaryCard label="Ready for Pickup"     value={ready}  color="#10b981" icon="✅" />
                    <SummaryCard label="Urgent (8+ days)"     value={urgent} color="#ef4444" icon="⚠️" />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search by customer, vehicle, plate, or reference…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none border"
                        style={{ background: '#111111', borderColor: '#2a2a2a', caretColor: '#f97316' }}
                        onFocus={e => e.target.style.borderColor = '#f97316'}
                        onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl text-sm text-white outline-none border"
                        style={{ background: '#111111', borderColor: '#2a2a2a' }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                    </select>
                </div>

                {/* Table */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest border-b text-[#6b7280]"
                                    style={{ background: '#0a0a0a', borderColor: '#1f1f1f' }}>
                                    <th className="p-4 font-black">Reference</th>
                                    <th className="p-4 font-black">Customer</th>
                                    <th className="p-4 font-black">Vehicle</th>
                                    <th className="p-4 font-black">Check-in Date</th>
                                    <th className="p-4 font-black">Days Running</th>
                                    <th className="p-4 font-black">Status</th>
                                    <th className="p-4 font-black">Remarks</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-5xl">🏁</span>
                                                <p className="text-[#6b7280] text-sm font-semibold">
                                                    {intakes.length === 0
                                                        ? 'No vehicles in the workshop right now.'
                                                        : 'No vehicles match your filters.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(intake => {
                                        const days = daysRunning(intake.created_at);
                                        const isReleasing = releasingId === intake.id;
                                        const checkinDate = new Date(intake.created_at).toLocaleDateString('en-PH', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        });
                                        const remarks = intake.scope_of_works || intake.complaints || '—';

                                        return (
                                            <tr key={intake.id}
                                                className="border-b transition-colors hover:bg-[#161616]"
                                                style={{ borderColor: '#1f1f1f' }}>
                                                {/* Reference */}
                                                <td className="p-4">
                                                    <a href={`/receipt/${intake.reference_number}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="font-black text-sm hover:text-[#f97316] transition-colors"
                                                        style={{ color: '#f97316' }}>
                                                        {intake.reference_number}
                                                    </a>
                                                </td>

                                                {/* Customer */}
                                                <td className="p-4">
                                                    <p className="font-bold text-white text-sm">{intake.customer ?? '—'}</p>
                                                    {intake.contact_no && (
                                                        <p className="text-xs text-[#6b7280] mt-0.5">{intake.contact_no}</p>
                                                    )}
                                                </td>

                                                {/* Vehicle */}
                                                <td className="p-4">
                                                    <p className="text-sm text-[#d1d5db] font-semibold">{intake.vehicle ?? '—'}</p>
                                                    {intake.plate_no && (
                                                        <p className="text-xs text-[#6b7280] mt-0.5 font-mono">{intake.plate_no}</p>
                                                    )}
                                                </td>

                                                {/* Check-in Date */}
                                                <td className="p-4 text-sm text-[#9ca3af] whitespace-nowrap">
                                                    {checkinDate}
                                                </td>

                                                {/* Days Running */}
                                                <td className="p-4">
                                                    <DaysBadge days={days} />
                                                </td>

                                                {/* Status */}
                                                <td className="p-4">
                                                    <StatusBadge status={intake.status} />
                                                </td>

                                                {/* Remarks */}
                                                <td className="p-4 max-w-[220px]">
                                                    <p className="text-xs text-[#9ca3af] line-clamp-2">{remarks}</p>
                                                </td>

                                                {/* Actions */}
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <a href={`/receipt/${intake.reference_number}`}
                                                            target="_blank" rel="noreferrer"
                                                            className="text-xs font-bold text-[#3b82f6] hover:underline whitespace-nowrap">
                                                            📋 Checklist
                                                        </a>
                                                        <a href={`/admin/repair-estimates/create?intake_id=${intake.id}`}
                                                            className="text-xs font-bold text-orange-500 hover:underline whitespace-nowrap">
                                                            📝 Estimate
                                                        </a>
                                                        <button
                                                            onClick={() => handleRelease(intake)}
                                                            disabled={isReleasing}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-black text-white transition-all disabled:opacity-50 hover:scale-105 whitespace-nowrap"
                                                            style={{
                                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                                boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                                                            }}>
                                                            {isReleasing ? 'Releasing…' : '✓ Release'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    {filtered.length > 0 && (
                        <div className="px-4 py-3 border-t text-xs text-[#4b5563] font-semibold"
                            style={{ borderColor: '#1f1f1f' }}>
                            Showing {filtered.length} of {intakes.length} unit{intakes.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function AdminDashboard({ auth, intakes = [], transactions = [], logs = [], stats, mechanics = [] }) {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedIntake, setSelectedIntake] = useState(null);

    const { data, setData, post, processing } = useForm({
        mechanic_id: ''
    });

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['intakes', 'stats', 'transactions', 'logs'], preserveScroll: true, preserveState: true });
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    const openAssignModal = (intake) => {
        setSelectedIntake(intake);
        setData('mechanic_id', intake.mechanic_id || '');
    };

    const handleAssign = (e) => {
        e.preventDefault();
        post(`/admin/intakes/${selectedIntake.id}/assign`, {
            onSuccess: () => setSelectedIntake(null)
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };
    const pendingIntakes = intakes.filter(intake => intake.status !== 'Completed');
    const completedIntakes = intakes.filter(intake => intake.status === 'Completed');

    const displayIntakes = activeTab === 'pending' ? pendingIntakes : completedIntakes;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard - MMG Autozone" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl shadow-sm flex items-center justify-between border-l-4" style={{ background: '#111111', borderTop: '1px solid #1f1f1f', borderRight: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', borderLeftColor: '#f97316' }}>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Total Intakes</p>
                            <p className="text-3xl font-black text-white">{stats?.total || intakes.length}</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm flex items-center justify-between border-l-4" style={{ background: '#111111', borderTop: '1px solid #1f1f1f', borderRight: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', borderLeftColor: '#ef4444' }}>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Pending Repairs</p>
                            <p className="text-3xl font-black text-white">{stats?.pending || pendingIntakes.length}</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm flex items-center justify-between border-l-4" style={{ background: '#111111', borderTop: '1px solid #1f1f1f', borderRight: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', borderLeftColor: '#10b981' }}>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Completed</p>
                            <p className="text-3xl font-black text-white">{stats?.completed || completedIntakes.length}</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm flex items-center justify-between border-l-4" style={{ background: '#111111', borderTop: '1px solid #1f1f1f', borderRight: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f', borderLeftColor: '#3b82f6' }}>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Total Revenue</p>
                            <p className="text-2xl font-black text-[#3b82f6]">₱{Number(stats?.revenue || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/pos" className="group p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' }}>
                        <svg className="w-10 h-10 text-white mb-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <h3 className="text-xl font-black text-white tracking-wide">Point of Sale</h3>
                        <p className="text-sm text-white/80 mt-1">Open cash register & checkout</p>
                    </Link>
                    
                    <Link href="/admin/inventory" className="group p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}>
                        <svg className="w-10 h-10 text-white mb-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <h3 className="text-xl font-black text-white tracking-wide">Inventory</h3>
                        <p className="text-sm text-white/80 mt-1">Manage products & materials</p>
                    </Link>

                    <Link href="/admin/estimates" className="group p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', boxShadow: '0 4px 12px rgba(139,92,246,0.2)' }}>
                        <svg className="w-10 h-10 text-white mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <h3 className="text-xl font-black text-white tracking-wide">Photo Estimates</h3>
                        <p className="text-sm text-white/80 mt-1">Review customer requests</p>
                    </Link>
                </div>

                <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: '#111111', border: '1px solid #1f1f1f' }}>
                    <div className="px-6 py-4 flex gap-4 border-b" style={{ borderColor: '#1f1f1f', background: '#0a0a0a' }}>
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`font-bold px-4 py-2 rounded-lg transition uppercase tracking-wider text-xs ${activeTab === 'pending' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            style={activeTab === 'pending' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                        >
                            Active Repairs
                        </button>
                        <button 
                            onClick={() => setActiveTab('completed')}
                            className={`font-bold px-4 py-2 rounded-lg transition uppercase tracking-wider text-xs ${activeTab === 'completed' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            style={activeTab === 'completed' ? { background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' } : {}}
                        >
                            Intake History
                        </button>
                        <button 
                            onClick={() => setActiveTab('logs')}
                            className={`font-bold px-4 py-2 rounded-lg transition uppercase tracking-wider text-xs ${activeTab === 'logs' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            style={activeTab === 'logs' ? { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' } : {}}
                        >
                            System Logs
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {(activeTab === 'pending' || activeTab === 'completed') && (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest border-b" style={{ borderColor: '#1f1f1f', color: '#6b7280', background: '#111111' }}>
                                    <th className="p-4 font-black">Ref No.</th>
                                    <th className="p-4 font-black">Customer</th>
                                    <th className="p-4 font-black">Vehicle</th>
                                    <th className="p-4 font-black">Date</th>
                                    <th className="p-4 font-black">Status</th>
                                    <th className="p-4 font-black text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayIntakes.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-sm" style={{ color: '#6b7280' }}>
                                            No records found in this category.
                                        </td>
                                    </tr>
                                ) : (
                                    displayIntakes.map((intake) => (
                                        <tr key={intake.id} className="border-b transition" style={{ borderColor: '#1f1f1f' }} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="p-4 font-bold text-white">{intake.reference_number}</td>
                                            <td className="p-4 text-sm" style={{ color: '#9ca3af' }}>{intake.customer}</td>
                                            <td className="p-4 text-sm" style={{ color: '#9ca3af' }}>{intake.vehicle} - {intake.plate_no}</td>
                                            <td className="p-4 text-sm" style={{ color: '#9ca3af' }}>
                                                {new Date(intake.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest`}
                                                    style={intake.status === 'Completed' ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' } : { background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                                                    {intake.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openAssignModal(intake)} className="font-bold text-xs uppercase tracking-widest hover:underline mr-4 transition-colors" style={{ color: '#3b82f6' }}>
                                                    Manage
                                                </button>
                                                <a href={`/receipt/${intake.reference_number}`} target="_blank" rel="noreferrer" className="font-bold text-xs uppercase tracking-widest hover:underline mr-4 transition-colors" style={{ color: '#f97316' }}>
                                                    View
                                                </a>
                                                <a href={`/receipt/${intake.reference_number}/pdf`} className="font-bold text-xs uppercase tracking-widest hover:underline transition-colors" style={{ color: '#9ca3af' }}>
                                                    PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        )}
                        
                        {activeTab === 'logs' && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs uppercase tracking-widest border-b" style={{ borderColor: '#1f1f1f', color: '#6b7280', background: '#111111' }}>
                                        <th className="p-4 font-black">Time</th>
                                        <th className="p-4 font-black">User</th>
                                        <th className="p-4 font-black">Action</th>
                                        <th className="p-4 font-black">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-sm" style={{ color: '#6b7280' }}>
                                                No activity logs recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="border-b transition text-sm" style={{ borderColor: '#1f1f1f', color: '#9ca3af' }} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td className="p-4">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="p-4 font-bold text-white">{log.user?.name || 'System'}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs uppercase font-bold border border-blue-500/20">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-4">{log.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Manage Intake Modal */}
            {selectedIntake && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-center bg-[#0a0a0a]">
                            <h2 className="text-xl font-black text-white">Manage Job: {selectedIntake.reference_number}</h2>
                            <button onClick={() => setSelectedIntake(null)} className="text-[#6b7280] hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                            {/* Mechanic Recommendations */}
                            {selectedIntake.mechanic_recommendations && selectedIntake.mechanic_recommendations.length > 0 && (
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                                    <h3 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        Auto-Generated Recommendations
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {selectedIntake.mechanic_recommendations.map((rec, idx) => (
                                            <li key={idx} className="text-sm text-orange-100">{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Accountability Display */}
                            {(selectedIntake.mechanic || selectedIntake.confirmed_by) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
                                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Confirmed By</span>
                                        <p className="font-bold text-white">{selectedIntake.confirmed_by?.name || 'Unknown'}</p>
                                    </div>
                                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
                                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Assigned Mechanic</span>
                                        <p className="font-bold text-white">{selectedIntake.mechanic?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Assignment Form */}
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#9ca3af] mb-1">Assign Mechanic</label>
                                    <select 
                                        value={data.mechanic_id} 
                                        onChange={e => setData('mechanic_id', e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f97316]"
                                        required
                                    >
                                        <option value="">-- Select Mechanic --</option>
                                        {mechanics.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-4 flex flex-wrap justify-between gap-3">
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (confirm('Mark this vehicle as Ready for Pickup and notify the customer?')) {
                                                    router.post(`/admin/intakes/${selectedIntake.id}/ready`, {}, {
                                                        onSuccess: () => setSelectedIntake(null)
                                                    });
                                                }
                                            }}
                                            className="px-6 py-2 rounded-lg text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
                                        >
                                            Mark Ready for Pickup
                                        </button>
                                        <label className="cursor-pointer px-4 py-2 rounded-lg text-sm font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                                            📸 Upload Progress Photos
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (!files.length) return;
                                                    const fd = new FormData();
                                                    files.forEach(f => fd.append('photos[]', f));
                                                    fd.append('_token', document.querySelector('meta[name="csrf-token"]')?.content || '');
                                                    fetch(`/admin/intakes/${selectedIntake.id}/progress-photos`, {
                                                        method: 'POST',
                                                        body: fd,
                                                        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' }
                                                    }).then(r => {
                                                        if (r.ok || r.redirected) {
                                                            alert(`${files.length} photo(s) uploaded successfully!`);
                                                            router.reload({ only: ['intakes'] });
                                                        } else {
                                                            alert('Upload failed. Please try again.');
                                                        }
                                                    });
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <button type="submit" disabled={processing} className="px-6 py-2 rounded-lg text-sm font-black text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:scale-105 transition-transform shadow-lg shadow-orange-500/20 disabled:opacity-50">
                                        {processing ? 'Saving...' : 'Confirm Assignment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// ─── Navbar ────────────────────────────────────────────────────────────────
function CustomerNavbar({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="sticky top-0 z-50 font-sans"
            style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1a1a1a' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link href="/home" className="flex items-center gap-2.5">
                        <img src="/images/bg2.png" alt="MMG Badge"
                            className="w-8 h-8 object-contain"
                            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                        <span className="text-sm font-black tracking-widest text-white">MMG AUTOZONE</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/home" className="text-sm font-medium transition-colors"
                            style={{ color: '#6b7280' }}
                            onMouseEnter={e => e.target.style.color = '#f97316'}
                            onMouseLeave={e => e.target.style.color = '#6b7280'}>
                            Home
                        </Link>
                    </div>

                    {/* User menu */}
                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white transition-all"
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                                style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white' }}>
                                {user?.name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <span className="hidden sm:inline text-sm" style={{ color: '#d1d5db' }}>{user?.name || 'Customer'}</span>
                            <svg className={`w-3.5 h-3.5 transition-transform`} style={{ color: '#6b7280', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl z-20"
                                    style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f1f1f' }}>
                                        <p className="text-xs" style={{ color: '#4b5563' }}>Signed in as</p>
                                        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                                    </div>
                                    <Link href="/customer/dashboard"
                                        className="block w-full text-left px-4 py-3 text-sm font-semibold transition-colors text-white"
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        My Dashboard
                                    </Link>
                                    <button onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm font-semibold transition-colors"
                                        style={{ color: '#ef4444' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="border-t py-12 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: '#0a0a0a', borderColor: '#1f1f1f' }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 opacity-50">
                    <img src="/images/bg2.png" alt="Logo" className="w-6 h-6 grayscale" />
                    <span className="text-xs font-black tracking-widest text-white">MMG AUTOZONE</span>
                </div>
                <p className="text-xs text-center md:text-left" style={{ color: '#4b5563' }}>
                    &copy; {new Date().getFullYear()} MMG Autozone. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default function CustomerDashboard({ auth, estimates }) {
    const user = auth?.user;

    return (
        <div className="min-h-screen font-sans antialiased flex flex-col" style={{ background: '#0a0a0a' }}>
            <Head title="My Dashboard — MMG Autozone" />
            <CustomerNavbar user={user} />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-wide">My Dashboard</h1>
                            <p className="text-sm text-[#9ca3af] mt-1">Manage your estimates and requests</p>
                        </div>
                        <Link href="/home"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-black text-white transition-all shadow-lg hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.2)' }}>
                            + New Request
                        </Link>
                    </div>

                    {estimates && estimates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {estimates.map(est => (
                                <Link key={est.id} href={`/service-requests/${est.id}`} className="block p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f] hover:border-[#f97316] transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-[#6b7280] font-bold uppercase tracking-wider mb-1 capitalize">{est.service_type.replace('_', ' ')} #{est.id}</p>
                                            <p className="font-bold text-white group-hover:text-[#f97316] transition-colors">{est.vehicle_model}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${est.status === 'Approved' ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.3)]' :
                                              est.status === 'Rejected' ? 'bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-[rgba(239,68,68,0.3)]' :
                                              est.status === 'Reviewed' ? 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]' :
                                              'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.3)]'}`}
                                        >
                                            {est.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#9ca3af] line-clamp-2 mb-4">{est.issue_description}</p>
                                    <div className="flex items-center justify-between text-xs font-medium border-t border-[#1f1f1f] pt-4">
                                        <span style={{ color: '#6b7280' }}>{new Date(est.created_at).toLocaleDateString()}</span>
                                        <span className="text-[#f97316] font-bold group-hover:underline">View Details →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#111111] rounded-2xl border border-[#1f1f1f]">
                            <p className="text-[#6b7280] text-sm mb-4">You haven't requested any services yet.</p>
                            <Link href="/home" className="text-[#f97316] font-bold hover:underline">
                                Request your first service
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

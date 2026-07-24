import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { url, props } = usePage();
    const { auth } = props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isActive = (path) => url.startsWith(path);

    return (
        <div className="min-h-screen flex font-sans antialiased text-white" style={{ background: '#0a0a0a' }}>
            {/* Sidebar */}
            <div 
                className={`flex flex-col transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex shrink-0`} 
                style={{ background: '#111111', borderRight: '1px solid #1f1f1f' }}
            >
                <div className="p-4 text-center border-b flex items-center justify-center relative h-[105px] shrink-0" style={{ borderColor: '#1f1f1f' }}>
                    <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden absolute'}`}>
                        <img src="/images/bg2.png" alt="MMG Badge" className="w-12 h-12 object-cover rounded-full bg-white mx-auto mb-2" />
                        <h2 className="text-lg font-black tracking-widest text-white whitespace-nowrap">MMG AUTOZONE</h2>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: '#f97316' }}>ADMIN PORTAL</p>
                    </div>
                    {!isSidebarOpen && (
                        <img src="/images/bg2.png" alt="MMG Badge" className="w-10 h-10 object-cover rounded-full bg-white mx-auto" />
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    <Link 
                        href="/admin" 
                        title="Dashboard"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${url === '/admin' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={url === '/admin' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Dashboard</span>
                    </Link>

                    <Link 
                        href="/admin/services" 
                        title="Service Requests"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${isActive('/admin/services') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={isActive('/admin/services') ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Service Requests</span>
                    </Link>

                    <Link 
                        href="/admin/repair-estimates" 
                        title="Repair Estimates"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${isActive('/admin/repair-estimates') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={isActive('/admin/repair-estimates') ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Repair Estimates</span>
                    </Link>

                    <Link 
                        href="/admin/pos" 
                        title="Point of Sale"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${isActive('/admin/pos') || isActive('/pos') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={isActive('/admin/pos') || isActive('/pos') ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Point of Sale</span>
                    </Link>

                    <Link 
                        href="/admin/analytics" 
                        title="Analytics"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${isActive('/admin/analytics') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={isActive('/admin/analytics') ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Analytics</span>
                    </Link>

                    <Link 
                        href="/admin/unit-in" 
                        title="Unit In"
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-semibold text-sm ${isActive('/admin/unit-in') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={isActive('/admin/unit-in') ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Unit In</span>
                    </Link>
                </nav>

                <div className="p-4 border-t" style={{ borderColor: '#1f1f1f' }}>
                    <button onClick={handleLogout} title="Log Out" className="w-full flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded-xl transition">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className={`font-semibold text-sm transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Global Header */}
                <header className="px-4 md:px-6 h-[105px] flex justify-between items-center shadow-sm shrink-0" style={{ background: '#111111', borderBottom: '1px solid #1f1f1f' }}>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1a] hidden md:block">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-wide truncate">
                            {url === '/admin' && 'Command Center'}
                            {isActive('/admin/services') && 'Service Requests'}
                            {isActive('/admin/repair-estimates') && 'Repair Estimates'}
                            {(isActive('/admin/pos') || isActive('/pos')) && 'Point of Sale'}
                            {isActive('/admin/unit-in') && 'Unit In — Workshop Tracker'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                            {auth?.user?.name || 'Admin'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

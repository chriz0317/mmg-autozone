import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function IntakeNavbar({ auth, activeVehicle = 'sedan' }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="border-b sticky top-0 z-50 font-sans antialiased text-white" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <img src="/images/bg2.png" alt="MMG Badge" className="w-8 h-8 object-cover rounded-full bg-white p-0.5" />
                            <span className="text-lg font-black tracking-widest text-white">MMG AUTOZONE</span>
                        </div>
                        
                        {/* Desktop Vehicle Type Switcher */}
                        <div className="hidden md:flex space-x-1 lg:space-x-2">
                            <Link 
                                href="/intake?type=sedan" 
                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeVehicle === 'sedan' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                                style={activeVehicle === 'sedan' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                            >
                                Sedan
                            </Link>
                            <Link 
                                href="/intake?type=pickup" 
                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeVehicle === 'pickup' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                                style={activeVehicle === 'pickup' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                            >
                                Pick Up
                            </Link>
                            <Link 
                                href="/intake?type=van" 
                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeVehicle === 'van' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                                style={activeVehicle === 'van' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                            >
                                Van
                            </Link>
                            <Link 
                                href="/intake?type=suv-hatchback" 
                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeVehicle === 'suv-hatchback' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                                style={activeVehicle === 'suv-hatchback' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                            >
                                SUV/Hatch
                            </Link>
                            <Link 
                                href="/intake?type=truck" 
                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeVehicle === 'truck' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
                                style={activeVehicle === 'truck' ? { background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' } : {}}
                            >
                                Truck
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Profile Dropdown */}
                    <div className="relative flex-shrink-0">
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 text-sm font-bold hover:text-white px-4 py-2 rounded-full transition outline-none"
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9ca3af' }}
                        >
                            <span className="hidden sm:inline">{auth?.user?.name || 'Staff User'}</span>
                            <span className="sm:hidden">Menu</span>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute right-0 mt-2 w-48 rounded-2xl border py-2 shadow-xl z-20 overflow-hidden transform origin-top-right" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                                    {auth?.user?.role === 'admin' && (
                                        <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium transition" style={{ color: '#d1d5db' }} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link href="/profile" className="block px-4 py-2.5 text-sm font-medium transition" style={{ color: '#d1d5db' }} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        Account Settings
                                    </Link>
                                    <hr className="my-1" style={{ borderColor: '#1f1f1f' }} />
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2.5 text-sm font-bold transition"
                                        style={{ color: '#ef4444' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
            
            {/* Mobile Vehicle Navigation Menu (Horizontal Scroll for 5 items) */}
            <div className="md:hidden px-2 pt-2 pb-3 flex gap-2 border-t overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ background: '#0a0a0a', borderColor: '#1f1f1f' }}>
                <Link href="/intake?type=sedan" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeVehicle === 'sedan' ? 'text-white' : 'text-gray-400 bg-[#111111]'}`} style={activeVehicle === 'sedan' ? { background: '#f97316' } : {}}>Sedan</Link>
                <Link href="/intake?type=pickup" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeVehicle === 'pickup' ? 'text-white' : 'text-gray-400 bg-[#111111]'}`} style={activeVehicle === 'pickup' ? { background: '#f97316' } : {}}>Pick Up</Link>
                <Link href="/intake?type=van" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeVehicle === 'van' ? 'text-white' : 'text-gray-400 bg-[#111111]'}`} style={activeVehicle === 'van' ? { background: '#f97316' } : {}}>Van</Link>
                <Link href="/intake?type=suv-hatchback" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeVehicle === 'suv-hatchback' ? 'text-white' : 'text-gray-400 bg-[#111111]'}`} style={activeVehicle === 'suv-hatchback' ? { background: '#f97316' } : {}}>SUV/Hatch</Link>
                <Link href="/intake?type=truck" className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeVehicle === 'truck' ? 'text-white' : 'text-gray-400 bg-[#111111]'}`} style={activeVehicle === 'truck' ? { background: '#f97316' } : {}}>Truck</Link>
            </div>
        </nav>
    );
}
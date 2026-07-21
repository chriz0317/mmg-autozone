import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PortalSelect() {
    const portals = [
        {
            href: '/customer/login',
            icon: '🚗',
            label: 'Customer',
            sub: 'Request services & track your vehicle',
            accent: '#f97316',
            accentBg: 'rgba(249,115,22,0.1)',
            accentBorder: 'rgba(249,115,22,0.3)',
            badge: 'Customer Portal',
        },
        {
            href: '/staff/login',
            icon: '🔧',
            label: 'Staff',
            sub: 'Process intake forms & manage job orders',
            accent: '#9ca3af',
            accentBg: 'rgba(156,163,175,0.08)',
            accentBorder: 'rgba(156,163,175,0.2)',
            badge: 'Staff Portal',
        },
        {
            href: '/admin/login',
            icon: '⚙️',
            label: 'Admin',
            sub: 'Full system access & management',
            accent: '#fb923c',
            accentBg: 'rgba(249,115,22,0.07)',
            accentBorder: 'rgba(249,115,22,0.2)',
            badge: 'Admin Portal',
        },
    ];

    return (
        <div className="min-h-screen font-sans antialiased flex flex-col relative" style={{ background: '#0a0a0a' }}>
            <Head title="Select Portal — MMG Autozone" />

            {/* Full-screen background image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/Bg1.png"
                    alt="MMG Autozone"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center' }}
                />
                {/* Gradient overlay: more transparent on left to show picture, darker on right for portals */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.95) 50%, rgba(10,10,10,1) 100%)' }} />
            </div>

            {/* Top orange line */}
            <div className="relative z-10" style={{ height: '3px', background: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)' }} />

            {/* Main split layout */}
            <div className="flex flex-1 flex-col lg:flex-row min-h-screen relative z-10">

                {/* ── LEFT: Brand Panel ── */}
                <div className="lg:w-1/2 min-h-[320px] lg:min-h-screen flex items-end">
                    {/* Brand badge + text */}
                    <div className="p-8 lg:p-12 w-full">
                        <img
                            src="/images/bg2.png"
                            alt="MMG Badge"
                            className="w-20 h-20 object-cover rounded-full bg-white mb-5 p-1"
                            style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}
                        />
                        <h1 className="text-3xl lg:text-4xl font-black tracking-widest text-white leading-none mb-2">
                            MMG AUTOZONE
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: '#f97316' }}>
                            Auto Body and Paint Shop
                        </p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                            B14 L14, Road 7, Silcas Village, Binan, Laguna
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: Portal Selection ── */}
                <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-sm backdrop-blur-md p-8 rounded-3xl" style={{ background: 'rgba(17, 17, 17, 0.7)', border: '1px solid rgba(31, 31, 31, 0.8)' }}>
                        <div className="mb-10">
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#f97316' }}>
                                Welcome
                            </p>
                            <h2 className="text-2xl font-black text-white">Select your portal</h2>
                            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Choose how you'd like to sign in</p>
                        </div>

                        <div className="space-y-3">
                            {portals.map((p) => (
                                <Link
                                    key={p.label}
                                    href={p.href}
                                    className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                                    style={{ background: '#111111', border: '1px solid #1f1f1f', textDecoration: 'none' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = p.accentBg;
                                        e.currentTarget.style.borderColor = p.accentBorder;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = '#111111';
                                        e.currentTarget.style.borderColor = '#1f1f1f';
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all"
                                        style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}` }}>
                                        {p.icon}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white">{p.label}</p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>{p.sub}</p>
                                    </div>

                                    {/* Arrow */}
                                    <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                                        style={{ color: p.accent }}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>

                        <p className="text-center text-xs mt-10" style={{ color: '#374151' }}>
                            © {new Date().getFullYear()} MMG Autozone. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

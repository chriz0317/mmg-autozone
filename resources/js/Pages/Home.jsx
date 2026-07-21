// Force Vite rebuild
import React, { useState } from 'react';
import { Head, router, Link, useForm } from '@inertiajs/react';

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
                    <div className="flex items-center gap-2.5">
                        <img src="/images/bg2.png" alt="MMG Badge"
                            className="w-8 h-8 object-contain"
                            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                        <span className="text-sm font-black tracking-widest text-white">MMG AUTOZONE</span>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#services" className="text-sm font-medium transition-colors"
                            style={{ color: '#6b7280' }}
                            onMouseEnter={e => e.target.style.color = '#f97316'}
                            onMouseLeave={e => e.target.style.color = '#6b7280'}>
                            Services
                        </a>
                        <a href="#request" className="text-sm font-medium transition-colors"
                            style={{ color: '#6b7280' }}
                            onMouseEnter={e => e.target.style.color = '#f97316'}
                            onMouseLeave={e => e.target.style.color = '#6b7280'}>
                            Request Service
                        </a>
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

// ─── Shared input field ─────────────────────────────────────────────────────
function FormField({ label, id, type = 'text', value, onChange, placeholder, required }) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
                {label} {required && <span style={{ color: '#f97316' }}>*</span>}
            </label>
            <input
                id={id} type={type} value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder} required={required}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', caretColor: '#f97316' }}
                onFocus={e => e.target.style.border = '1px solid rgba(249,115,22,0.4)'}
                onBlur={e => e.target.style.border = '1px solid #2a2a2a'}
            />
        </div>
    );
}

// ─── Repair Form ────────────────────────────────────────────────────────────
function RepairForm() {
    const { data, setData, post, processing, errors } = useForm({
        service_type: 'repair',
        name: '',
        contact_no: '',
        email: '',
        vehicle_model: '',
        plate_no: '',
        issue_description: '',
        preferred_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/service-requests', {
            onSuccess: () => {
                // Keep it simple and let inertia redirect to back with success message.
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" id="repair_name" value={data.name} onChange={v => setData('name', v)} placeholder="Juan dela Cruz" required />
                <FormField label="Contact No." id="repair_contact" type="tel" value={data.contact_no} onChange={v => setData('contact_no', v)} placeholder="09XX XXX XXXX" required />
            </div>
            <FormField label="Email Address" id="repair_email" type="email" value={data.email} onChange={v => setData('email', v)} placeholder="you@example.com" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Vehicle Make & Model" id="repair_vehicle" value={data.vehicle_model} onChange={v => setData('vehicle_model', v)} placeholder="Toyota Vios 2020" required />
                <FormField label="Plate Number" id="repair_plate" value={data.plate_no} onChange={v => setData('plate_no', v)} placeholder="ABC 1234" />
            </div>

            <div>
                <label htmlFor="repair_desc" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
                    Problem Description <span style={{ color: '#f97316' }}>*</span>
                </label>
                <textarea id="repair_desc" rows={4} value={data.issue_description}
                    onChange={e => setData('issue_description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', caretColor: '#f97316' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(249,115,22,0.4)'}
                    onBlur={e => e.target.style.border = '1px solid #2a2a2a'}
                    placeholder="Describe the issue (engine noise, AC not working, etc.)" required />
            </div>
            <FormField label="Preferred Drop-off Date" id="repair_date" type="date" value={data.preferred_date} onChange={v => setData('preferred_date', v)} />
            
            <button type="submit" disabled={processing}
                className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.25)' }}>
                {processing ? 'Submitting...' : '🔧 Submit Repair Request'}
            </button>
        </form>
    );
}

// ─── Photo Estimate Form ────────────────────────────────────────────────────
function PhotoEstimateForm() {
    const { data, setData, post, processing, errors } = useForm({
        service_type: 'photo_estimate',
        name: '',
        contact_no: '',
        email: '',
        vehicle_model: '',
        plate_no: '',
        issue_description: '',
        photos: []
    });

    const [previewUrls, setPreviewUrls] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/service-requests');
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="mb-2 p-4 rounded-xl border-l-4 border-[#f97316] bg-[rgba(249,115,22,0.1)]">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#f97316] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-xs font-black text-[#f97316] uppercase tracking-widest mb-1">Non-Binding Estimate</h3>
                        <p className="text-xs text-[#d1d5db] leading-relaxed">
                            Online estimates serve solely as a baseline cost. Final repair costs will be confirmed upon physical inspection.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" id="estimate_name" value={data.name} onChange={v => setData('name', v)} placeholder="Juan dela Cruz" required />
                <FormField label="Contact No." id="estimate_contact" type="tel" value={data.contact_no} onChange={v => setData('contact_no', v)} placeholder="09XX XXX XXXX" required />
            </div>
            
            <FormField label="Email Address" id="estimate_email" type="email" value={data.email} onChange={v => setData('email', v)} placeholder="you@example.com" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Vehicle Make & Model" id="estimate_vehicle" value={data.vehicle_model} onChange={v => setData('vehicle_model', v)} placeholder="Toyota Vios 2020" required />
                <FormField label="Plate Number" id="estimate_plate" value={data.plate_no} onChange={v => setData('plate_no', v)} placeholder="ABC 1234" />
            </div>
            {(errors.vehicle_model || errors.plate_no) && (
                <div className="text-red-500 text-xs flex justify-between px-2">
                    <span>{errors.vehicle_model}</span>
                    <span>{errors.plate_no}</span>
                </div>
            )}

            <div>
                <label htmlFor="estimate_desc" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
                    Problem Description <span style={{ color: '#f97316' }}>*</span>
                </label>
                <textarea id="estimate_desc" rows={4} value={data.issue_description}
                    onChange={e => setData('issue_description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', caretColor: '#f97316' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(249,115,22,0.4)'}
                    onBlur={e => e.target.style.border = '1px solid #2a2a2a'}
                    placeholder="Describe the damage..." required />
                {errors.issue_description && <p className="text-red-500 text-xs mt-1">{errors.issue_description}</p>}
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Upload Photos</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#2a2a2a] border-dashed rounded-xl bg-[#111111] hover:border-[#f97316] hover:bg-[#1a1a1a] transition-all relative group">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-[#6b7280] group-hover:text-[#f97316] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-[#9ca3af] justify-center mt-2">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#f97316] hover:text-[#fb923c] focus-within:outline-none">
                                <span>Upload files</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-[#6b7280]">PNG, JPG, GIF up to 5MB each</p>
                    </div>
                </div>
                {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos}</p>}
            </div>

            {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a]">
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            <button type="submit" disabled={processing} className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.25)' }}>
                {processing ? 'Submitting...' : '📸 Submit Photo Estimate'}
            </button>
        </form>
    );
}

// ─── Repaint Form ───────────────────────────────────────────────────────────
const AREAS = ['Hood', 'Roof', 'Front Bumper', 'Rear Bumper', 'Front Left Door', 'Front Right Door', 'Rear Left Door', 'Rear Right Door', 'Left Fender', 'Right Fender', 'Trunk / Tailgate', 'Full Body'];

function RepaintForm() {
    const { data, setData, post, processing, errors } = useForm({
        service_type: 'repaint',
        name: '',
        contact_no: '',
        email: '',
        vehicle_model: '',
        plate_no: '',
        areas: [],
        color_preference: '',
        additional_notes: '',
        preferred_date: '',
    });

    const toggleArea = (area) => {
        setData('areas', data.areas.includes(area) ? data.areas.filter(a => a !== area) : [...data.areas, area]);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/service-requests', {
            onSuccess: () => {
                // Let inertia handle redirect back with flash session
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" id="repaint_name" value={data.name} onChange={v => setData('name', v)} placeholder="Juan dela Cruz" required />
                <FormField label="Contact No." id="repaint_contact" type="tel" value={data.contact_no} onChange={v => setData('contact_no', v)} placeholder="09XX XXX XXXX" required />
            </div>
            <FormField label="Email Address" id="repaint_email" type="email" value={data.email} onChange={v => setData('email', v)} placeholder="you@example.com" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Vehicle Make & Model" id="repaint_vehicle" value={data.vehicle_model} onChange={v => setData('vehicle_model', v)} placeholder="Honda City 2019" required />
                <FormField label="Plate Number" id="repaint_plate" value={data.plate_no} onChange={v => setData('plate_no', v)} placeholder="ABC 1234" />
            </div>

            {/* Area checkboxes */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>
                    Areas to Repaint <span style={{ color: '#f97316' }}>*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AREAS.map(area => {
                        const on = data.areas.includes(area);
                        return (
                            <button key={area} type="button" onClick={() => toggleArea(area)}
                                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all"
                                style={{
                                    background: on ? 'rgba(249,115,22,0.12)' : '#1a1a1a',
                                    border: on ? '1px solid rgba(249,115,22,0.4)' : '1px solid #2a2a2a',
                                    color: on ? '#f97316' : '#6b7280',
                                }}>
                                {on ? '✓ ' : ''}{area}
                            </button>
                        );
                    })}
                </div>
                {errors.areas && <p className="text-red-500 text-xs mt-1">{errors.areas}</p>}
            </div>

            <FormField label="Color Preference" id="repaint_color" value={data.color_preference} onChange={v => setData('color_preference', v)} placeholder="Pearl White, Midnight Black, same color…" />

            <div>
                <label htmlFor="repaint_notes" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>Additional Notes</label>
                <textarea id="repaint_notes" rows={3} value={data.additional_notes}
                    onChange={e => setData('additional_notes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', caretColor: '#f97316' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(249,115,22,0.4)'}
                    onBlur={e => e.target.style.border = '1px solid #2a2a2a'}
                    placeholder="Special instructions or concerns…" />
            </div>

            <FormField label="Preferred Drop-off Date" id="repaint_date" type="date" value={data.preferred_date} onChange={v => setData('preferred_date', v)} />

            <button type="submit" disabled={processing || data.areas.length === 0}
                className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.25)' }}>
                {processing ? 'Submitting...' : '🎨 Submit Repaint Request'}
            </button>
        </form>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Home({ auth, estimates }) {
    const [activeTab, setActiveTab] = useState('repair');

    const scrollToRequest = (tab) => {
        setActiveTab(tab);
        setTimeout(() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    return (
        <div className="min-h-screen font-sans antialiased" style={{ background: '#0a0a0a', color: '#e5e7eb' }}>
            <Head title="Home — MMG Autozone" />

            <CustomerNavbar user={auth?.user} />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
                {/* Glow blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div style={{
                        position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
                        width: '800px', height: '400px',
                        background: 'radial-gradient(ellipse, rgba(249,115,22,0.1), transparent 65%)',
                        filter: 'blur(80px)',
                    }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Live badge */}
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8"
                        style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
                        Now Accepting Service Requests
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6 text-white">
                        Your Car,<br />
                        <span style={{ color: '#f97316' }}>Our Priority.</span>
                    </h1>

                    <p className="text-lg sm:text-xl mb-3" style={{ color: '#9ca3af' }}>
                        Welcome back,{' '}
                        <span className="font-bold text-white">{auth?.user?.name?.split(' ')[0] || 'Customer'}</span>.
                    </p>
                    <p className="text-base max-w-xl mx-auto mb-12" style={{ color: '#6b7280' }}>
                        Book repairs, request repaints, and track your vehicle's service — all from one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => scrollToRequest('estimate')}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-black text-white transition-all"
                            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 32px rgba(249,115,22,0.35)' }}>
                            📸 Get Photo Estimate
                        </button>
                        <button onClick={() => scrollToRequest('repair')}
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-black transition-all"
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d1d5db' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.color = '#f97316'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#d1d5db'; }}>
                            Book Direct Service
                        </button>
                    </div>
                </div>
            </section>

            {/* Divider line */}
            <div style={{ height: '1px', background: '#1a1a1a', maxWidth: '80rem', margin: '0 auto' }} />

            {/* ── SERVICES ── */}
            <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>What We Offer</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">Our Services</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Repair */}
                        <button type="button" onClick={() => scrollToRequest('repair')}
                            className="group text-left p-8 rounded-2xl transition-all duration-200"
                            style={{ background: '#111111', border: '1px solid #1f1f1f' }}
                            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(249,115,22,0.3)'; e.currentTarget.style.background = 'rgba(249,115,22,0.04)'; }}
                            onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1f1f1f'; e.currentTarget.style.background = '#111111'; }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                🔧
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Auto Repair</h3>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280' }}>
                                From engine diagnostics to brake jobs — our certified mechanics handle all makes and models.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Engine', 'Electrical', 'Brakes', 'Suspension', 'AC Repair', 'Body Work'].map(t => (
                                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ background: 'rgba(249,115,22,0.08)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.15)' }}>{t}</span>
                                ))}
                            </div>
                            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#f97316' }}>
                                Request Repair
                                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        {/* Repaint */}
                        <button type="button" onClick={() => scrollToRequest('repaint')}
                            className="group text-left p-8 rounded-2xl transition-all duration-200"
                            style={{ background: '#111111', border: '1px solid #1f1f1f' }}
                            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(156,163,175,0.2)'; e.currentTarget.style.background = 'rgba(156,163,175,0.03)'; }}
                            onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1f1f1f'; e.currentTarget.style.background = '#111111'; }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                                style={{ background: 'rgba(156,163,175,0.08)', border: '1px solid rgba(156,163,175,0.15)' }}>
                                🎨
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Auto Repaint</h3>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280' }}>
                                Factory-quality paint finishes with premium automotive paints. Partial or full-body — we restore your vehicle's showroom look.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Full Body', 'Panel Repaint', 'Scratch Fix', 'Color Change', 'Clear Coat', 'Polishing'].map(t => (
                                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ background: 'rgba(156,163,175,0.06)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.12)' }}>{t}</span>
                                ))}
                            </div>
                            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                                Request Repaint
                                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div style={{ height: '1px', background: '#1a1a1a', maxWidth: '80rem', margin: '0 auto' }} />

            {/* ── FORMS ── */}
            <section id="request" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>Get Started</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Request a Service</h2>
                        <p className="text-sm" style={{ color: '#6b7280' }}>Fill out the form and we'll contact you to confirm your appointment.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex flex-col sm:flex-row p-1 rounded-2xl mb-6 gap-1 sm:gap-0" style={{ background: '#111111', border: '1px solid #1f1f1f' }}>
                        <button
                            onClick={() => setActiveTab('estimate')}
                            className="flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                            style={{
                                background: activeTab === 'estimate' ? 'linear-gradient(135deg, #ea580c, #f97316)' : 'transparent',
                                color: activeTab === 'estimate' ? 'white' : '#4b5563',
                                boxShadow: activeTab === 'estimate' ? '0 4px 16px rgba(249,115,22,0.25)' : 'none',
                                border: activeTab === 'estimate' ? 'none' : '1px solid transparent',
                            }}>
                            📸 Photo Estimate
                        </button>
                        <button
                            onClick={() => setActiveTab('repair')}
                            className="flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                            style={{
                                background: activeTab === 'repair' ? 'linear-gradient(135deg, #ea580c, #f97316)' : 'transparent',
                                color: activeTab === 'repair' ? 'white' : '#4b5563',
                                boxShadow: activeTab === 'repair' ? '0 4px 16px rgba(249,115,22,0.25)' : 'none',
                                border: activeTab === 'repair' ? 'none' : '1px solid transparent',
                            }}>
                            🔧 Auto Repair
                        </button>
                        <button
                            onClick={() => setActiveTab('repaint')}
                            className="flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                            style={{
                                background: activeTab === 'repaint' ? '#1f1f1f' : 'transparent',
                                color: activeTab === 'repaint' ? '#d1d5db' : '#4b5563',
                                border: activeTab === 'repaint' ? '1px solid #2a2a2a' : '1px solid transparent',
                            }}>
                            🎨 Auto Repaint
                        </button>
                    </div>

                    {/* Form Card */}
                    <div className="p-8 rounded-2xl" style={{ background: '#111111', border: '1px solid #1f1f1f' }}>
                        {activeTab === 'estimate' && <PhotoEstimateForm />}
                        {activeTab === 'repair' && <RepairForm />}
                        {activeTab === 'repaint' && <RepaintForm />}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-12 px-4 text-center" style={{ borderTop: '1px solid #1a1a1a' }}>
                <img src="/images/bg2.png" alt="MMG Badge"
                    className="w-14 h-14 object-contain mx-auto mb-4 opacity-80" />
                <p className="text-sm font-black tracking-widest text-white mb-1">MMG AUTOZONE</p>
                <p className="text-xs mb-1" style={{ color: '#f97316' }}>Auto Body and Paint Shop</p>
                <p className="text-xs mb-1" style={{ color: '#6b7280' }}>B14 L14, Road 7, Silcas Village, Binan, Laguna</p>
                <p className="text-xs mb-4" style={{ color: '#6b7280' }}>0917-302-9296 &nbsp;|&nbsp; 0917-1786-664</p>
                <p className="text-xs" style={{ color: '#374151' }}>© {new Date().getFullYear()} MMG Autozone. All rights reserved.</p>
            </footer>
        </div>
    );
}

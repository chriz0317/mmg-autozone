import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

// ─── Shared Auth Layout ─────────────────────────────────────────────────────
function AuthLayout({ title, badge, badgeColor, badgeBg, badgeBorder, accentColor, children }) {
    return (
        <div className="min-h-screen font-sans antialiased flex flex-col relative" style={{ background: '#0a0a0a' }}>
            <Head title={`${title} — MMG Autozone`} />

            {/* Full-screen background image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/Bg1.png"
                    alt="MMG Autozone"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center' }}
                />
                {/* Gradient overlay: more transparent on left to show picture, darker on right for form */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.95) 50%, rgba(10,10,10,1) 100%)' }} />
            </div>

            {/* Top accent stripe */}
            <div className="relative z-10" style={{ height: '3px', background: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)' }} />

            <div className="flex flex-1 flex-col lg:flex-row relative z-10">

                {/* ── LEFT: Brand Panel ── */}
                <div className="lg:w-[45%] min-h-[260px] lg:min-h-screen flex items-start">
                    <div className="p-4 pt-6 lg:p-6 lg:pt-8 w-full">
                        <img
                            src="/images/bg2.png"
                            alt="MMG Badge"
                            className="w-16 h-16 object-cover rounded-full bg-white mb-4 p-1"
                            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.7))' }}
                        />
                        <h1 className="text-2xl lg:text-3xl font-black tracking-widest text-white leading-none mb-1">
                            MMG AUTOZONE
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>
                            Auto Body and Paint Shop
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#6b7280' }}>
                            <span>📍 B14 L14, Road 7, Silcas Village, Binan, Laguna</span>
                            <span>📞 0917-302-9296</span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Form Panel ── */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">


                        {/* Form Card */}
                        <div className="p-8 rounded-2xl backdrop-blur-md" style={{ background: 'rgba(17, 17, 17, 0.7)', border: '1px solid rgba(31, 31, 31, 0.8)' }}>
                            {/* Role badge */}
                            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest mb-6"
                                style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}>
                                <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: badgeColor }} />
                                {badge}
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Shared Text Input ──────────────────────────────────────────────────────
function AuthInput({ id, label, type = 'text', value, onChange, placeholder, error, required, autoComplete, accentColor = '#f97316', rightSlot }) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>
                {label}{required && <span className="ml-1" style={{ color: accentColor }}>*</span>}
            </label>
            <div className="relative">
                <input
                    id={id} type={type} value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background: '#1a1a1a', border: error ? '1px solid #ef4444' : '1px solid #2a2a2a', caretColor: accentColor, paddingRight: rightSlot ? '3.5rem' : undefined }}
                    onFocus={e => e.target.style.borderColor = `${accentColor}60`}
                    onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#2a2a2a'}
                />
                {rightSlot}
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>}
        </div>
    );
}

// ─── Show/Hide Password Button ──────────────────────────────────────────────
function ShowHideBtn({ show, onToggle }) {
    return (
        <button type="button" onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-wider transition-colors"
            style={{ color: '#4b5563' }}
            onMouseEnter={e => e.target.style.color = '#9ca3af'}
            onMouseLeave={e => e.target.style.color = '#4b5563'}>
            {show ? 'Hide' : 'Show'}
        </button>
    );
}

// ─── Submit Button ──────────────────────────────────────────────────────────
function SubmitBtn({ processing, label, gradient, shadow }) {
    return (
        <button type="submit" disabled={processing}
            className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50"
            style={{ background: gradient, boxShadow: shadow }}>
            {processing ? 'Signing in…' : label}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER LOGIN
// ═══════════════════════════════════════════════════════════════════════════
export function CustomerLogin() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });
    const [showPass, setShowPass] = useState(false);

    return (
        <AuthLayout
            title="Customer Login"
            badge="Customer Portal"
            badgeColor="#f97316"
            badgeBg="rgba(249,115,22,0.1)"
            badgeBorder="rgba(249,115,22,0.25)"
            accentColor="#f97316"
        >
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Sign in to manage your service requests</p>

            <form onSubmit={e => { e.preventDefault(); post('/customer/login'); }} className="space-y-5">
                <AuthInput id="c_email" label="Email Address" type="email" value={data.email}
                    onChange={v => setData('email', v)} placeholder="you@example.com"
                    error={errors.email} required autoComplete="email" />

                <AuthInput id="c_password" label="Password" type={showPass ? 'text' : 'password'} value={data.password}
                    onChange={v => setData('password', v)} placeholder="••••••••"
                    error={errors.password} required autoComplete="current-password"
                    rightSlot={<ShowHideBtn show={showPass} onToggle={() => setShowPass(!showPass)} />} />

                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded" style={{ accentColor: '#f97316' }} />
                    <span className="text-sm" style={{ color: '#6b7280' }}>Remember me</span>
                </label>

                <SubmitBtn processing={processing} label="Sign In"
                    gradient="linear-gradient(135deg, #ea580c, #f97316)"
                    shadow="0 8px 24px rgba(249,115,22,0.3)" />
            </form>

            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid #1f1f1f' }}>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                    No account?{' '}
                    <Link href="/customer/register" className="font-black transition-colors" style={{ color: '#f97316' }}>
                        Create one free →
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAFF LOGIN
// ═══════════════════════════════════════════════════════════════════════════
export function StaffLogin() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });
    const [showPass, setShowPass] = useState(false);

    return (
        <AuthLayout
            title="Staff Login"
            badge="Staff Portal"
            badgeColor="#9ca3af"
            badgeBg="rgba(156,163,175,0.08)"
            badgeBorder="rgba(156,163,175,0.2)"
            accentColor="#9ca3af"
        >
            <h2 className="text-2xl font-black text-white mb-1">Staff Sign In</h2>
            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Access intake forms and job management</p>

            <form onSubmit={e => { e.preventDefault(); post('/staff-login'); }} className="space-y-5">
                <AuthInput id="s_email" label="Email Address" type="email" value={data.email}
                    onChange={v => setData('email', v)} placeholder="staff@mmgautozone.com"
                    error={errors.email} required autoComplete="email" accentColor="#9ca3af" />

                <AuthInput id="s_password" label="Password" type={showPass ? 'text' : 'password'} value={data.password}
                    onChange={v => setData('password', v)} placeholder="••••••••"
                    error={errors.password} required autoComplete="current-password" accentColor="#9ca3af"
                    rightSlot={<ShowHideBtn show={showPass} onToggle={() => setShowPass(!showPass)} />} />

                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded" style={{ accentColor: '#9ca3af' }} />
                    <span className="text-sm" style={{ color: '#6b7280' }}>Remember me</span>
                </label>

                <SubmitBtn processing={processing} label="Sign In as Staff"
                    gradient="linear-gradient(135deg, #374151, #4b5563)"
                    shadow="0 8px 24px rgba(75,85,99,0.25)" />
            </form>

            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid #1f1f1f' }}>
                <p className="text-xs" style={{ color: '#374151' }}>
                    Admin?{' '}
                    <Link href="/admin/login" className="transition-colors font-semibold" style={{ color: '#6b7280' }}>
                        Admin portal →
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════════════════
export function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });
    const [showPass, setShowPass] = useState(false);

    return (
        <AuthLayout
            title="Admin Login"
            badge="Admin — Restricted Access"
            badgeColor="#fb923c"
            badgeBg="rgba(249,115,22,0.07)"
            badgeBorder="rgba(249,115,22,0.18)"
            accentColor="#f97316"
        >
            <h2 className="text-2xl font-black text-white mb-1">Admin Sign In</h2>
            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Authorized personnel only</p>

            <form onSubmit={e => { e.preventDefault(); post('/admin-login'); }} className="space-y-5">
                <AuthInput id="a_email" label="Email Address" type="email" value={data.email}
                    onChange={v => setData('email', v)} placeholder="admin@mmgautozone.com"
                    error={errors.email} required autoComplete="email" />

                <AuthInput id="a_password" label="Password" type={showPass ? 'text' : 'password'} value={data.password}
                    onChange={v => setData('password', v)} placeholder="••••••••"
                    error={errors.password} required autoComplete="current-password"
                    rightSlot={<ShowHideBtn show={showPass} onToggle={() => setShowPass(!showPass)} />} />

                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded" style={{ accentColor: '#f97316' }} />
                    <span className="text-sm" style={{ color: '#6b7280' }}>Remember me</span>
                </label>

                <SubmitBtn processing={processing} label="Sign In as Admin"
                    gradient="linear-gradient(135deg, #c2410c, #ea580c)"
                    shadow="0 8px 24px rgba(249,115,22,0.2)" />
            </form>

            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid #1f1f1f' }}>
                <p className="text-xs" style={{ color: '#374151' }}>
                    Staff portal?{' '}
                    <Link href="/staff/login" className="transition-colors font-semibold" style={{ color: '#6b7280' }}>
                        Staff login →
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

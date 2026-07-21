import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

function AuthInput({ id, label, type = 'text', value, onChange, placeholder, error, required, autoComplete, rightSlot }) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>
                {label}{required && <span className="ml-1" style={{ color: '#f97316' }}>*</span>}
            </label>
            <div className="relative">
                <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} autoComplete={autoComplete} required={required}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background: '#1a1a1a', border: error ? '1px solid #ef4444' : '1px solid #2a2a2a', caretColor: '#f97316', paddingRight: rightSlot ? '4rem' : undefined }}
                    onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
                    onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#2a2a2a'} />
                {rightSlot}
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>}
        </div>
    );
}

export default function CustomerRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', contact_no: '', password: '', password_confirmation: '',
    });
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="min-h-screen font-sans antialiased flex flex-col relative" style={{ background: '#0a0a0a' }}>
            <Head title="Create Account — MMG Autozone" />

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

                {/* ── LEFT: Brand Panel (same as all auth pages) ── */}
                <div className="lg:w-[45%] min-h-[260px] lg:min-h-screen flex items-end">
                    <div className="p-8 lg:p-10 w-full">
                        <img src="/images/bg2.png" alt="MMG Badge" className="w-16 h-16 object-cover rounded-full bg-white mb-4 p-1"
                            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }} />
                        <h1 className="text-2xl lg:text-3xl font-black tracking-widest text-white leading-none mb-1">MMG AUTOZONE</h1>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>Auto Body and Paint Shop</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                            📍 B14 L14, Road 7, Silcas Village, Binan, Laguna &nbsp;·&nbsp; 📞 0917-302-9296
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: Register Form ── */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
                    <div className="w-full max-w-md">

                        <Link href="/customer/login"
                            className="inline-flex items-center gap-1.5 mb-8 text-xs font-black uppercase tracking-widest transition-colors"
                            style={{ color: '#6b7280' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Login
                        </Link>

                        <div className="p-8 rounded-2xl backdrop-blur-md" style={{ background: 'rgba(17, 17, 17, 0.7)', border: '1px solid rgba(31, 31, 31, 0.8)' }}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest mb-6"
                                style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                                New Customer Account
                            </div>

                            <h2 className="text-2xl font-black text-white mb-1">Create your profile</h2>
                            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Submit service requests & track your vehicle</p>

                            <form onSubmit={e => { e.preventDefault(); post('/customer/register'); }} className="space-y-4">
                                <AuthInput id="r_name" label="Full Name" value={data.name}
                                    onChange={v => setData('name', v)} placeholder="Juan dela Cruz"
                                    error={errors.name} required autoComplete="name" />

                                <AuthInput id="r_email" label="Email Address" type="email" value={data.email}
                                    onChange={v => setData('email', v)} placeholder="you@example.com"
                                    error={errors.email} required autoComplete="email" />

                                <AuthInput id="r_contact" label="Contact Number" type="tel" value={data.contact_no}
                                    onChange={v => setData('contact_no', v)} placeholder="09XX XXX XXXX"
                                    error={errors.contact_no} required />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AuthInput id="r_pass" label="Password"
                                        type={showPass ? 'text' : 'password'} value={data.password}
                                        onChange={v => setData('password', v)} placeholder="Min 8 chars"
                                        error={errors.password} required autoComplete="new-password"
                                        rightSlot={
                                            <button type="button" onClick={() => setShowPass(!showPass)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-wider transition-colors"
                                                style={{ color: '#4b5563' }}
                                                onMouseEnter={e => e.target.style.color = '#9ca3af'}
                                                onMouseLeave={e => e.target.style.color = '#4b5563'}>
                                                {showPass ? 'Hide' : 'Show'}
                                            </button>
                                        }
                                    />
                                    <AuthInput id="r_confirm" label="Confirm"
                                        type={showPass ? 'text' : 'password'} value={data.password_confirmation}
                                        onChange={v => setData('password_confirmation', v)}
                                        placeholder="Repeat" autoComplete="new-password" required />
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50 mt-1"
                                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
                                    {processing ? 'Creating Account…' : 'Create My Account'}
                                </button>
                            </form>

                            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid #1f1f1f' }}>
                                <p className="text-sm" style={{ color: '#6b7280' }}>
                                    Already have an account?{' '}
                                    <Link href="/customer/login" className="font-black" style={{ color: '#f97316' }}>Sign in →</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

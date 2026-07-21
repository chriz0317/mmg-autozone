import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login({ portal = 'Staff' }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        if (portal === 'Admin') {
            post('/admin-login');
        } else {
            post('/staff-login');
        }
    };

    const isAdmin = portal === 'Admin';

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] flex flex-col font-sans antialiased items-center justify-center p-4">
            <Head title={`${portal} Login - MMG Autozone`} />

            <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10 relative overflow-hidden">
                {/* Accent top border */}
                <div className={`absolute top-0 left-0 w-full h-2 ${isAdmin ? 'bg-amber-500' : 'bg-blue-600'}`}></div>
                
                <div className="text-center mb-8">
                    <img src="/images/bg2.png" alt="MMG Badge" className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md" />
                    
                    <h1 className="text-3xl font-black tracking-widest text-slate-900 mb-1">MMG AUTOZONE</h1>
                    <p className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: '#f97316' }}>Auto Body and Paint Shop</p>
                    
                    <div className="space-y-2 text-xs text-slate-600 mb-8 border-y border-slate-100 py-4">
                        <p className="flex items-center justify-center gap-2">
                            <span role="img" aria-label="location">📍</span> B14 L14, Road 7, Silcas Village, Binan, Laguna
                        </p>
                        <p className="flex items-center justify-center gap-2 font-medium">
                            <span role="img" aria-label="phone">📞</span> 0917-302-9296
                        </p>
                    </div>

                    <div className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] mb-2 shadow-sm ${isAdmin ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                        {portal} Portal
                    </div>
                    <p className="text-xs text-slate-500">Sign in to access the {portal.toLowerCase()} system</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && (
                            <p className="mt-2 text-xs text-red-600 font-medium">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && (
                            <p className="mt-2 text-xs text-red-600 font-medium">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                            />
                            <span className="text-sm text-slate-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50 ${isAdmin ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-900 hover:bg-blue-800'}`}
                    >
                        {processing ? 'Signing in...' : `Sign In as ${portal}`}
                    </button>
                </form>

                <div className="mt-6 pt-5 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        {isAdmin ? (
                            <>Looking for Staff portal? <Link href="/staff/login" className="text-blue-600 hover:text-blue-700 font-medium">Staff login →</Link></>
                        ) : (
                            <>Admin portal? <Link href="/admin/login" className="text-amber-600 hover:text-amber-700 font-medium">Admin login →</Link></>
                        )}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">← Customer portal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function TransactionSuccess({ transaction, qrCode, orUrl }) {
    if (!transaction) return null;

    // Check if current URL is under /admin to determine the back link
    const isAdmin = window.location.pathname.startsWith('/admin');
    const backLink = isAdmin ? '/admin/pos' : '/pos';

    return (
        <AdminLayout>
            <Head title={`Checkout Complete - Transaction #${transaction.id}`} />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
                <div className="max-w-md w-full bg-[#111111] rounded-[32px] shadow-2xl border border-[#2a2a2a] overflow-hidden text-center p-8 sm:p-10 relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600"></div>

                    <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    
                    <h1 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Checkout Complete</h1>
                    <p className="text-sm text-[#9ca3af] mb-8">
                        Transaction #{transaction.id} processed successfully.
                    </p>
                    
                    {/* Massive Scannable QR Code */}
                    <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#2a2a2a] inline-block mb-8 w-full shadow-inner">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Scan for Digital O.R.</p>
                        <div 
                            className="flex justify-center mb-4 bg-white p-4 rounded-2xl border-4 border-white shadow-xl mx-auto" 
                            style={{ width: 'fit-content' }}
                            dangerouslySetInnerHTML={{ __html: qrCode }} 
                        />
                        <p className="text-sm font-medium text-[#6b7280] mt-4">
                            Total: <span className="text-white font-black">₱{Number(transaction.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <a href={orUrl} target="_blank" rel="noreferrer" className="block w-full bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20">
                            View Official Receipt
                        </a>
                        <Link href={backLink} className="block w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] font-bold text-sm py-4 rounded-xl hover:text-white hover:border-[#3a3a3a] transition-all">
                            Back to Point of Sale
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

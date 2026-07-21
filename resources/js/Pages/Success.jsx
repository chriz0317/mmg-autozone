import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Success({ intake }) {
    if (!intake) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
            <Head title={`Intake Saved - ${intake.reference_number}`} />
            
            <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-10">
                <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Intake Saved!</h1>
                <p className="text-sm text-slate-500 mb-8">The job order has been successfully created and recorded.</p>
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 inline-block mb-8 w-full">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Number</p>
                    <p className="font-mono font-black text-3xl text-blue-900 tracking-wider">
                        {intake.reference_number}
                    </p>
                </div>

                <div className="space-y-3">
                    <Link href="/intake" className="block w-full bg-blue-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-800 transition">
                        Create Another Intake
                    </Link>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { Head } from '@inertiajs/react';

export default function DigitalOR({ transaction, intakeDetails }) {
    if (!transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 print:bg-white print:min-h-0">
            <Head title={`Official Receipt - OR#${transaction.id}`} />
            
            <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
                
                {/* Print Button (Hidden on Print) */}
                <div className="mb-6 flex flex-wrap justify-end gap-3 print:hidden">
                    {/* If there are intakes, generate buttons for them */}
                    {Object.values(intakeDetails).map((intake, i) => (
                        <a 
                            key={`intake-pdf-${intake.id}`}
                            href={`/receipt/${intake.reference_number}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Download Checklist {Object.values(intakeDetails).length > 1 ? `#${i+1}` : ''}
                        </a>
                    ))}

                    <button 
                        onClick={handlePrint}
                        className="bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        Print Receipt O.R.
                    </button>
                </div>

                {/* Receipt Container */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                    
                    {/* Header */}
                    <div className="p-8 md:p-12 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Official Receipt</h1>
                            <p className="text-slate-500 font-medium mt-1">O.R. No: <span className="text-slate-800 font-bold">#{str_pad(transaction.id, 6, '0')}</span></p>
                            <p className="text-slate-500 font-medium text-sm mt-1">{new Date(transaction.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <h2 className="font-black text-blue-900 text-xl tracking-wide uppercase">MMG Autozone Corp.</h2>
                            <p className="text-sm text-slate-600 mt-1">Blk 14 Lot 14, Road 7, Silcas Village<br/>Binan, Laguna</p>
                            <p className="text-sm text-slate-600 mt-1">0917 167 6663 | 0917 178 6664</p>
                        </div>
                    </div>

                    {/* Customer & Payment Info */}
                    <div className="p-8 md:px-12 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
                            <p className="font-bold text-slate-800 text-lg">{transaction.user?.name || 'Walk-in Customer'}</p>
                            {transaction.vehicle_model && <p className="text-slate-600 mt-1">Vehicle: {transaction.vehicle_model}</p>}
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Details</h3>
                            <p className="font-medium text-slate-700">Method: <span className="font-bold uppercase">{transaction.payment_method}</span></p>
                            <p className="font-medium text-slate-700 mt-1">Status: <span className="font-bold text-emerald-600 uppercase">Paid</span></p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="p-8 md:px-12">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Services & Items Rendered</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-200">
                                        <th className="py-3 font-bold text-slate-800 text-sm">Description</th>
                                        <th className="py-3 font-bold text-slate-800 text-sm text-center">Qty</th>
                                        <th className="py-3 font-bold text-slate-800 text-sm text-right">Unit Price</th>
                                        <th className="py-3 font-bold text-slate-800 text-sm text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.items.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="border-b border-slate-100">
                                                <td className="py-4 text-slate-700">
                                                    <span className="font-bold block text-slate-900">{item.item_name}</span>
                                                    {/* If it's a repair job, show mechanic info from intake details */}
                                                    {item.item_type === 'intake' && intakeDetails[item.id] && (
                                                        <div className="mt-2 text-xs bg-slate-50 inline-block p-2 rounded-lg border border-slate-100">
                                                            <p className="text-slate-500 mb-1">Assigned Mechanic: <span className="font-bold text-slate-700">{intakeDetails[item.id].mechanic?.name || 'N/A'}</span></p>
                                                            <p className="text-slate-500">Confirmed By: <span className="font-bold text-slate-700">{intakeDetails[item.id].confirmed_by?.name || 'N/A'}</span></p>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 text-slate-700 text-center">{item.quantity}</td>
                                                <td className="py-4 text-slate-700 text-right">₱{Number(item.unit_price).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                                                <td className="py-4 font-bold text-slate-900 text-right">₱{Number(item.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-8 flex justify-end">
                            <div className="w-full sm:w-1/2 md:w-1/3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-medium">Subtotal</span>
                                    <span className="text-slate-800 font-bold">₱{Number(transaction.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-3">
                                    <span className="text-slate-900 font-black uppercase tracking-wider">Total</span>
                                    <span className="text-2xl text-blue-900 font-black">₱{Number(transaction.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-900 p-8 text-center text-slate-400 text-sm">
                        <p className="mb-2">Thank you for trusting MMG Autozone.</p>
                        <p>For questions or concerns, contact us at autozonemmg@gmail.com</p>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Helper to format ID nicely
function str_pad(num, size, padString = '0') {
    let s = num + "";
    while (s.length < size) s = padString + s;
    return s;
}

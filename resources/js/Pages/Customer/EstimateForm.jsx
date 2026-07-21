import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function EstimateForm() {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_model: '',
        plate_no: '',
        issue_description: '',
        photos: []
    });

    const [previewUrls, setPreviewUrls] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);

        // Generate preview URLs
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/estimate');
    };

    return (
        <div className="min-h-screen font-sans antialiased bg-[#0a0a0a] text-white">
            <Head title="Request Estimate — MMG Autozone" />

            {/* Navbar area */}
            <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f] bg-[#111111]">
                <div className="flex items-center gap-3">
                    <img src="/images/bg2.png" alt="MMG Badge" className="w-10 h-10 object-cover rounded-full bg-white p-0.5" />
                    <h1 className="text-xl font-black tracking-widest text-white">MMG AUTOZONE</h1>
                </div>
                <Link href="/home" className="text-sm font-bold tracking-wider text-[#9ca3af] hover:text-white transition-colors">
                    Cancel & Return
                </Link>
            </div>

            <main className="max-w-3xl mx-auto py-10 px-6">
                
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Request an Estimate</h2>
                    <p className="text-[#9ca3af] text-sm">Upload photos of your vehicle to get a preliminary repair cost estimate.</p>
                </div>

                {/* DISCLAIMER */}
                <div className="mb-8 p-4 rounded-xl border-l-4 border-[#f97316] bg-[rgba(249,115,22,0.1)]">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-[#f97316] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-black text-[#f97316] uppercase tracking-widest mb-1">Non-Binding Estimate</h3>
                            <p className="text-xs text-[#d1d5db] leading-relaxed">
                                Please note that online estimates are <strong>not final closed deals</strong>. They serve solely as a baseline cost. Final repair costs and scope of work will be confirmed once a physical inspection is performed at our shop.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Vehicle Make/Model *</label>
                            <input 
                                type="text" 
                                value={data.vehicle_model}
                                onChange={e => setData('vehicle_model', e.target.value)}
                                placeholder="e.g. Toyota Vios 2021"
                                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316]"
                                required
                            />
                            {errors.vehicle_model && <p className="text-red-500 text-xs mt-1">{errors.vehicle_model}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Plate Number *</label>
                            <input 
                                type="text" 
                                value={data.plate_no}
                                onChange={e => setData('plate_no', e.target.value)}
                                placeholder="e.g. ABC 1234"
                                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316]"
                                required
                            />
                            {errors.plate_no && <p className="text-red-500 text-xs mt-1">{errors.plate_no}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-[#6b7280] mb-2">Issue Description *</label>
                        <textarea 
                            rows="4"
                            value={data.issue_description}
                            onChange={e => setData('issue_description', e.target.value)}
                            placeholder="Describe the damage or services needed (e.g. dent on front bumper, scratches on left door)..."
                            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316] resize-none"
                            required
                        ></textarea>
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

                    {/* Image Previews */}
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a]">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 border-t border-[#1f1f1f]">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}
                        >
                            {processing ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

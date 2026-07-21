import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ intake }) {
    if (!intake) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
                <div className="animate-pulse text-slate-500 font-bold tracking-widest uppercase">Loading Receipt Data...</div>
            </div>
        );
    }

    const vehicleType = intake?.vehicle_type || 'sedan';
    const vehicleImages = {
        sedan: { img1: '/images/Picture1.png', img2: '/images/Picture2.png' },
        pickup: { img1: '/images/pickup-outline-1.png', img2: '/images/pickup-outline-2.png' },
        van: { img1: '/images/van-outline-1.png', img2: '/images/van-outline-2.png' },
        'suv-hatchback': { img1: '/images/suv-outline-1.png', img2: '/images/suv-outline-2.png' },
        truck: { img1: '/images/truck-outline-1.png', img2: null }
    };
    const currentImages = vehicleImages[vehicleType] || vehicleImages.sedan;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <Head title={`Job Order ${intake.reference_number} - MMG Autozone`} />
            
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                <div className="bg-blue-900 text-white p-6 text-center">
                    <h1 className="text-2xl font-bold tracking-wider">MMG AUTOZONE</h1>
                    <p className="text-blue-200 text-sm mt-1">Digital Job Order & Checklist</p>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-sm font-medium block">Reference No.</span>
                            <span className="font-bold text-2xl text-gray-800 tracking-wider">{intake.reference_number}</span>
                        </div>
                        <div>
                            <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide inline-block mt-1">In Progress</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="text-gray-500 block mb-1">Customer:</span>
                            <span className="font-bold text-gray-800 text-base">{intake.customer || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Date Received:</span>
                            <span className="font-bold text-gray-800">{new Date(intake.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Vehicle:</span>
                            <span className="font-bold text-gray-800">{intake.vehicle || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Plate No:</span>
                            <span className="font-bold text-gray-800">{intake.plate_no || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 text-sm font-bold block mb-3">Vehicle Condition Notes:</span>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="text-gray-600">Fuel Level:</span>
                                <span className="font-bold">{intake.fuel_level}/16 Tank</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="text-gray-600">Reported Damages:</span>
                                <span className="font-bold text-red-600">
                                    {intake.damage_markers ? intake.damage_markers.length : 0} marks noted
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <span className="text-gray-800 font-bold block mb-4 text-center">Visual Damage Map</span>
                            
                            {vehicleType === 'truck' ? (
                                <div className="flex justify-center max-w-3xl mx-auto">
                                    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white w-full max-w-lg flex justify-center">
                                        <img src={currentImages.img1} alt="Truck View Map" className="w-full h-auto object-contain" />
                                        {intake.damage_markers && intake.damage_markers
                                            .filter(marker => marker.view === 'full-view' || marker.view === 'front-left')
                                            .map((marker, index) => (
                                            <div 
                                                key={`img-truck-${index}`}
                                                className="absolute -ml-2 -mt-3 font-black text-lg"
                                                style={{ left: `${marker.x}%`, top: `${marker.y}%`, color: marker.type === 'S' ? '#ef4444' : marker.type === 'D' ? '#f59e0b' : '#a855f7' }}
                                            >
                                                {marker.type}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <img src={currentImages.img1} alt="Front View Map" className="w-full h-auto" />
                                        {intake.damage_markers && intake.damage_markers
                                            .filter(marker => marker.view === 'front-left')
                                            .map((marker, index) => (
                                            <div 
                                                key={`img1-${index}`}
                                                className="absolute -ml-2 -mt-3 font-black text-lg"
                                                style={{ left: `${marker.x}%`, top: `${marker.y}%`, color: marker.type === 'S' ? '#ef4444' : marker.type === 'D' ? '#f59e0b' : '#a855f7' }}
                                            >
                                                {marker.type}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <img src={currentImages.img2} alt="Rear View Map" className="w-full h-auto" />
                                        {intake.damage_markers && intake.damage_markers
                                            .filter(marker => marker.view === 'rear-right')
                                            .map((marker, index) => (
                                            <div 
                                                key={`img2-${index}`}
                                                className="absolute -ml-2 -mt-3 font-black text-lg"
                                                style={{ left: `${marker.x}%`, top: `${marker.y}%`, color: marker.type === 'S' ? '#ef4444' : marker.type === 'D' ? '#f59e0b' : '#a855f7' }}
                                            >
                                                {marker.type}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
                            <a 
                                href={`/receipt/${intake.reference_number}/pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-6 rounded shadow transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Full Checklist PDF
                            </a>
                            
                            <Link 
                                href="/intake"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2.5 px-6 rounded shadow transition flex items-center justify-center"
                            >
                                Create Another Intake
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 text-center text-xs text-gray-500 border-t border-gray-200">
                    <p className="mb-2">This is a digital copy of your signed intake checklist.</p>
                    <p>Present this reference number when claiming your vehicle.</p>
                </div>
            </div>
        </div>
    );
}
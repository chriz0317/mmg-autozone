import React, { useState, useCallback } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

// ─── MMG Autozone Standard Price Table (must match PriceEstimatorService.php) ───
const PRICE_TABLE = {
    front_bumper:      { label: 'Front Bumper',        light_scratch: { parts: [300, 1000],  labor: [500, 1500]  }, dent: { parts: [1000, 3500],  labor: [1500, 3500] }, severe: { parts: [3500, 10000], labor: [3000, 7000]  } },
    hood:              { label: 'Hood',                light_scratch: { parts: [400, 1200],  labor: [800, 1800]  }, dent: { parts: [2000, 6000],  labor: [1500, 3500] }, severe: { parts: [6000, 18000], labor: [3000, 8000]  } },
    left_fender:       { label: 'Left Front Fender',   light_scratch: { parts: [300, 1000],  labor: [600, 1500]  }, dent: { parts: [1500, 4500],  labor: [1200, 3000] }, severe: { parts: [4500, 14000], labor: [2000, 6000]  } },
    right_fender:      { label: 'Right Front Fender',  light_scratch: { parts: [300, 1000],  labor: [600, 1500]  }, dent: { parts: [1500, 4500],  labor: [1200, 3000] }, severe: { parts: [4500, 14000], labor: [2000, 6000]  } },
    windshield:        { label: 'Front Windshield',    light_scratch: { parts: [2000, 5000], labor: [300, 500]   }, dent: { parts: [5000, 12000], labor: [300, 800]   }, severe: { parts: [8000, 25000], labor: [500, 1500]   } },
    left_front_door:   { label: 'Left Front Door',     light_scratch: { parts: [400, 1200],  labor: [700, 1500]  }, dent: { parts: [1800, 5500],  labor: [1500, 3500] }, severe: { parts: [5000, 16000], labor: [2500, 7000]  } },
    right_front_door:  { label: 'Right Front Door',    light_scratch: { parts: [400, 1200],  labor: [700, 1500]  }, dent: { parts: [1800, 5500],  labor: [1500, 3500] }, severe: { parts: [5000, 16000], labor: [2500, 7000]  } },
    roof:              { label: 'Roof',                light_scratch: { parts: [500, 1500],  labor: [800, 2000]  }, dent: { parts: [2500, 7000],  labor: [2000, 4500] }, severe: { parts: [7000, 22000], labor: [4000, 12000] } },
    left_rear_door:    { label: 'Left Rear Door',      light_scratch: { parts: [400, 1200],  labor: [700, 1500]  }, dent: { parts: [1800, 5500],  labor: [1500, 3500] }, severe: { parts: [5000, 15000], labor: [2500, 7000]  } },
    right_rear_door:   { label: 'Right Rear Door',     light_scratch: { parts: [400, 1200],  labor: [700, 1500]  }, dent: { parts: [1800, 5500],  labor: [1500, 3500] }, severe: { parts: [5000, 15000], labor: [2500, 7000]  } },
    rear_windshield:   { label: 'Rear Windshield',     light_scratch: { parts: [1500, 4000], labor: [300, 500]   }, dent: { parts: [4000, 10000], labor: [300, 800]   }, severe: { parts: [6000, 20000], labor: [500, 1500]   } },
    left_rear_fender:  { label: 'Left Rear Fender',    light_scratch: { parts: [300, 1000],  labor: [600, 1500]  }, dent: { parts: [1500, 4500],  labor: [1200, 3000] }, severe: { parts: [4500, 12000], labor: [2000, 5500]  } },
    right_rear_fender: { label: 'Right Rear Fender',   light_scratch: { parts: [300, 1000],  labor: [600, 1500]  }, dent: { parts: [1500, 4500],  labor: [1200, 3000] }, severe: { parts: [4500, 12000], labor: [2000, 5500]  } },
    trunk:             { label: 'Trunk / Boot',        light_scratch: { parts: [400, 1200],  labor: [700, 1500]  }, dent: { parts: [1500, 5000],  labor: [1200, 3000] }, severe: { parts: [4500, 14000], labor: [2000, 6000]  } },
    rear_bumper:       { label: 'Rear Bumper',         light_scratch: { parts: [300, 1000],  labor: [500, 1500]  }, dent: { parts: [1000, 3500],  labor: [1200, 3000] }, severe: { parts: [3500, 10000], labor: [2500, 6000]  } },
};

const AUTO_APPROVAL_THRESHOLD = 5000;

// ─── SVG car diagram zone definitions (top-down sedan view) ───────────────────
// viewBox: 0 0 300 500
const CAR_ZONES = [
    { id: 'front_bumper',      x: 68,  y: 8,   w: 164, h: 50,  rx: 15, label: 'Front Bumper' },
    { id: 'hood',              x: 68,  y: 58,  w: 164, h: 110, rx: 4,  label: 'Hood' },
    { id: 'left_fender',       x: 20,  y: 58,  w: 52,  h: 110, rx: 4,  label: 'Left Fender' },
    { id: 'right_fender',      x: 228, y: 58,  w: 52,  h: 110, rx: 4,  label: 'Right Fender' },
    { id: 'windshield',        x: 68,  y: 168, w: 164, h: 65,  rx: 4,  label: 'Front Windshield' },
    { id: 'left_front_door',   x: 20,  y: 168, w: 52,  h: 130, rx: 4,  label: 'Left Front Door' },
    { id: 'right_front_door',  x: 228, y: 168, w: 52,  h: 130, rx: 4,  label: 'Right Front Door' },
    { id: 'roof',              x: 68,  y: 233, w: 164, h: 65,  rx: 4,  label: 'Roof' },
    { id: 'left_rear_door',    x: 20,  y: 298, w: 52,  h: 110, rx: 4,  label: 'Left Rear Door' },
    { id: 'right_rear_door',   x: 228, y: 298, w: 52,  h: 110, rx: 4,  label: 'Right Rear Door' },
    { id: 'rear_windshield',   x: 68,  y: 298, w: 164, h: 55,  rx: 4,  label: 'Rear Windshield' },
    { id: 'trunk',             x: 68,  y: 353, w: 164, h: 95,  rx: 4,  label: 'Trunk / Boot' },
    { id: 'left_rear_fender',  x: 20,  y: 408, w: 52,  h: 40,  rx: 4,  label: 'Left Rear Fender' },
    { id: 'right_rear_fender', x: 228, y: 408, w: 52,  h: 40,  rx: 4,  label: 'Right Rear Fender' },
    { id: 'rear_bumper',       x: 68,  y: 448, w: 164, h: 44,  rx: 15, label: 'Rear Bumper' },
];

const SEVERITY_OPTIONS = [
    { id: 'light_scratch', label: 'Light Scratch', emoji: '〰️', color: '#f59e0b', desc: 'Paint scuffs, minor surface scratches' },
    { id: 'dent',          label: 'Dent / Crease', emoji: '⚡', color: '#f97316', desc: 'Panel dents, creases, minor bends' },
    { id: 'severe',        label: 'Severe Damage',  emoji: '💥', color: '#ef4444', desc: 'Major impact, cracks, part replacement needed' },
];

// ─── Live price calculator ────────────────────────────────────────────────────
function calcEstimate(selectedZones) {
    let items = [];
    let totalMin = 0;
    let totalMax = 0;
    for (const [zoneId, severity] of Object.entries(selectedZones)) {
        const p = PRICE_TABLE[zoneId];
        if (!p || !p[severity]) continue;
        const { parts, labor } = p[severity];
        const subMin = parts[0] + labor[0];
        const subMax = parts[1] + labor[1];
        items.push({ area_id: zoneId, area_label: p.label, severity, parts_min: parts[0], parts_max: parts[1], labor_min: labor[0], labor_max: labor[1], subtotal_min: subMin, subtotal_max: subMax });
        totalMin += subMin;
        totalMax += subMax;
    }
    return { items, total_min: totalMin, total_max: totalMax };
}

function fmt(n) { return n.toLocaleString('en-PH'); }

// ─── Component ────────────────────────────────────────────────────────────────
export default function EstimateForm() {
    // Selected zones: { zone_id: severity_id }
    const [selectedZones, setSelectedZones] = useState({});
    // Zone being hovered for tooltip
    const [hoveredZone, setHoveredZone] = useState(null);
    // Severity picker for a clicked zone (modal-like inline picker)
    const [activePicker, setActivePicker] = useState(null);
    const [previewUrls, setPreviewUrls] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        service_type:      'photo_estimate',
        vehicle_model:     '',
        plate_no:          '',
        contact_no:        '',
        issue_description: '',
        photos:            [],
        damage_markers:    [],
    });

    // Derived estimate
    const estimate = calcEstimate(selectedZones);
    const hasSevere = Object.values(selectedZones).includes('severe');
    const willAutoApprove = !hasSevere && estimate.total_min > 0 && estimate.total_min < AUTO_APPROVAL_THRESHOLD;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleZoneClick = useCallback((zoneId) => {
        setActivePicker(prev => prev === zoneId ? null : zoneId);
    }, []);

    const handleSeveritySelect = useCallback((zoneId, severityId) => {
        setSelectedZones(prev => ({ ...prev, [zoneId]: severityId }));
        // Sync damage_markers into form data
        const updated = { ...selectedZones, [zoneId]: severityId };
        const markers = Object.entries(updated).map(([id, sev]) => ({
            area_id:    id,
            area_label: PRICE_TABLE[id]?.label ?? id,
            severity:   sev,
        }));
        setData('damage_markers', markers);
        setActivePicker(null);
    }, [selectedZones, setData]);

    const handleRemoveZone = useCallback((zoneId) => {
        setSelectedZones(prev => { const n = { ...prev }; delete n[zoneId]; return n; });
        setData('damage_markers', data.damage_markers.filter(m => m.area_id !== zoneId));
    }, [data.damage_markers, setData]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const allFiles = [...data.photos, ...newFiles];
        setData('photos', allFiles);
        setPreviewUrls(allFiles.map(f => URL.createObjectURL(f)));
    };

    const removePhoto = (index) => {
        const newFiles = [...data.photos];
        URL.revokeObjectURL(previewUrls[index]);
        newFiles.splice(index, 1);
        const newUrls = [...previewUrls];
        newUrls.splice(index, 1);
        setData('photos', newFiles);
        setPreviewUrls(newUrls);
    };

    const submit = (e) => {
        e.preventDefault();
        if (Object.keys(selectedZones).length === 0) {
            alert('Please click on at least one area of the car diagram to mark the damage.');
            return;
        }
        post('/service-requests');
    };

    // ── SVG zone color ────────────────────────────────────────────────────────
    const getZoneFill = (zoneId) => {
        const severity = selectedZones[zoneId];
        if (severity === 'light_scratch') return 'rgba(245,158,11,0.55)';
        if (severity === 'dent')          return 'rgba(249,115,22,0.65)';
        if (severity === 'severe')        return 'rgba(239,68,68,0.70)';
        if (hoveredZone === zoneId)       return 'rgba(249,115,22,0.2)';
        return 'rgba(255,255,255,0.04)';
    };

    const getZoneStroke = (zoneId) => {
        const severity = selectedZones[zoneId];
        if (severity === 'light_scratch') return '#f59e0b';
        if (severity === 'dent')          return '#f97316';
        if (severity === 'severe')        return '#ef4444';
        if (hoveredZone === zoneId)       return '#f97316';
        return '#333';
    };

    // ── Severity badge color ──────────────────────────────────────────────────
    const severityBadge = (sev) => {
        if (sev === 'light_scratch') return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
        if (sev === 'dent')         return { bg: 'rgba(249,115,22,0.15)', text: '#f97316', border: 'rgba(249,115,22,0.3)' };
        return                             { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', border: 'rgba(239,68,68,0.3)'  };
    };

    return (
        <div className="min-h-screen font-sans antialiased bg-[#0a0a0a] text-white">
            <Head title="Photo Estimate — MMG Autozone" />

            {/* Navbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f] bg-[#111111]">
                <div className="flex items-center gap-3">
                    <img src="/images/bg2.png" alt="MMG Badge" className="w-9 h-9 object-cover rounded-full bg-white p-0.5" />
                    <h1 className="text-lg font-black tracking-widest text-white">MMG AUTOZONE</h1>
                </div>
                <Link href="/home" className="text-sm font-bold tracking-wider text-[#9ca3af] hover:text-white transition-colors">
                    Cancel & Return
                </Link>
            </div>

            <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Photo Damage Estimate</h2>
                    <p className="text-[#9ca3af] text-sm max-w-2xl">
                        Click the damaged areas on the car diagram, rate the severity, then upload your photos.
                        Our system will instantly calculate a <span className="text-[#f97316] font-bold">price range</span> based on MMG Autozone's standard price list.
                    </p>
                </div>

                {/* Disclaimer */}
                <div className="mb-8 p-4 rounded-xl border-l-4 border-[#f97316] bg-[rgba(249,115,22,0.07)]">
                    <div className="flex items-start gap-3">
                        <span className="text-[#f97316] text-lg flex-shrink-0">⚠️</span>
                        <div>
                            <h3 className="text-xs font-black text-[#f97316] uppercase tracking-widest mb-1">Non-Binding Estimate</h3>
                            <p className="text-xs text-[#d1d5db] leading-relaxed">
                                Prices are based on the shop's standard rate list and are <strong>not a final quotation</strong>. 
                                Final costs are confirmed after a physical inspection at MMG Autozone.
                                Minor repairs under ₱{fmt(AUTO_APPROVAL_THRESHOLD)} are auto-approved — you'll be notified instantly.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ── LEFT COLUMN: Vehicle Info + Car Diagram ── */}
                        <div className="space-y-6">

                            {/* Vehicle Info */}
                            <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-4">Vehicle Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#6b7280] mb-1.5">Make / Model *</label>
                                        <input
                                            type="text"
                                            value={data.vehicle_model}
                                            onChange={e => setData('vehicle_model', e.target.value)}
                                            placeholder="e.g. Toyota Vios 2021"
                                            className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316] transition-colors"
                                            required
                                        />
                                        {errors.vehicle_model && <p className="text-red-500 text-xs mt-1">{errors.vehicle_model}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-[#6b7280] mb-1.5">Plate Number</label>
                                            <input
                                                type="text"
                                                value={data.plate_no}
                                                onChange={e => setData('plate_no', e.target.value)}
                                                placeholder="e.g. ABC 1234"
                                                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-[#6b7280] mb-1.5">Contact No.</label>
                                            <input
                                                type="text"
                                                value={data.contact_no}
                                                onChange={e => setData('contact_no', e.target.value)}
                                                placeholder="09XX XXX XXXX"
                                                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#6b7280] mb-1.5">Additional Notes <span className="text-[#4b5563] font-normal normal-case">(optional)</span></label>
                                        <textarea
                                            rows="2"
                                            value={data.issue_description}
                                            onChange={e => setData('issue_description', e.target.value)}
                                            placeholder="Anything else you want the shop to know..."
                                            className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#f97316] transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Car Diagram */}
                            <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280]">Click to Mark Damaged Areas</h3>
                                    {Object.keys(selectedZones).length > 0 && (
                                        <span className="text-xs font-bold text-[#f97316]">
                                            {Object.keys(selectedZones).length} area{Object.keys(selectedZones).length > 1 ? 's' : ''} marked
                                        </span>
                                    )}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {SEVERITY_OPTIONS.map(opt => (
                                        <div key={opt.id} className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full" style={{ background: opt.color }} />
                                            <span className="text-[10px] font-bold text-[#6b7280]">{opt.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* SVG Car Diagram */}
                                <div className="flex justify-center relative">
                                    <svg
                                        viewBox="0 0 300 500"
                                        className="w-full max-w-[220px]"
                                        style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4))' }}
                                    >
                                        {/* Car body background */}
                                        <path
                                            d="M150,5 C185,5 235,15 245,40 L248,168 L248,298 L248,420 C248,465 210,495 150,495 C90,495 52,465 52,420 L52,298 L52,168 L55,40 C65,15 115,5 150,5 Z"
                                            fill="#141414" stroke="#2a2a2a" strokeWidth="1.5"
                                        />
                                        {/* FRONT label */}
                                        <text x="150" y="498" textAnchor="middle" className="text-[8px]" fill="#333" fontSize="8" fontWeight="bold">FRONT ↑</text>

                                        {/* Clickable zones */}
                                        {CAR_ZONES.map(zone => (
                                            <g key={zone.id}>
                                                <rect
                                                    x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                                                    rx={zone.rx ?? 4}
                                                    fill={getZoneFill(zone.id)}
                                                    stroke={getZoneStroke(zone.id)}
                                                    strokeWidth={selectedZones[zone.id] ? 2 : 1}
                                                    className="cursor-pointer transition-all duration-150"
                                                    onClick={() => handleZoneClick(zone.id)}
                                                    onMouseEnter={() => setHoveredZone(zone.id)}
                                                    onMouseLeave={() => setHoveredZone(null)}
                                                />
                                                {/* Severity emoji badge on selected zone */}
                                                {selectedZones[zone.id] && (
                                                    <text
                                                        x={zone.x + zone.w / 2}
                                                        y={zone.y + zone.h / 2 + 5}
                                                        textAnchor="middle"
                                                        fontSize="14"
                                                        className="pointer-events-none select-none"
                                                    >
                                                        {SEVERITY_OPTIONS.find(s => s.id === selectedZones[zone.id])?.emoji}
                                                    </text>
                                                )}
                                                {/* Zone label on hover (unselected) */}
                                                {hoveredZone === zone.id && !selectedZones[zone.id] && (
                                                    <text
                                                        x={zone.x + zone.w / 2}
                                                        y={zone.y + zone.h / 2 + 4}
                                                        textAnchor="middle"
                                                        fontSize="7"
                                                        fill="#f97316"
                                                        fontWeight="bold"
                                                        className="pointer-events-none select-none"
                                                    >
                                                        {zone.label}
                                                    </text>
                                                )}
                                            </g>
                                        ))}
                                    </svg>

                                    {/* Severity Picker Popup */}
                                    {activePicker && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center z-10"
                                            onClick={(e) => { if (e.target === e.currentTarget) setActivePicker(null); }}
                                        >
                                            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl w-64">
                                                <p className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-3">
                                                    {CAR_ZONES.find(z => z.id === activePicker)?.label} — How bad is it?
                                                </p>
                                                <div className="space-y-2">
                                                    {SEVERITY_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            onClick={() => handleSeveritySelect(activePicker, opt.id)}
                                                            className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                                                            style={{
                                                                background: selectedZones[activePicker] === opt.id
                                                                    ? `rgba(${opt.id === 'light_scratch' ? '245,158,11' : opt.id === 'dent' ? '249,115,22' : '239,68,68'},0.2)`
                                                                    : '#1a1a1a',
                                                                border: `1px solid ${selectedZones[activePicker] === opt.id ? opt.color : '#2a2a2a'}`,
                                                            }}
                                                        >
                                                            <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{opt.label}</p>
                                                                <p className="text-xs text-[#6b7280]">{opt.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setActivePicker(null)}
                                                    className="mt-3 w-full text-xs text-[#6b7280] hover:text-white py-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="text-center text-[10px] text-[#4b5563] mt-3">
                                    Tap any panel · Select severity · Repeat for each damaged area
                                </p>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Damage List + Estimate + Photos ── */}
                        <div className="space-y-6">

                            {/* Selected Damage List */}
                            <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-4">Marked Damage Areas</h3>

                                {Object.keys(selectedZones).length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-[#2a2a2a] rounded-xl">
                                        <p className="text-3xl mb-2">🚗</p>
                                        <p className="text-sm text-[#4b5563]">No areas marked yet.</p>
                                        <p className="text-xs text-[#3a3a3a] mt-1">Click on the car diagram to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(selectedZones).map(([zoneId, severity]) => {
                                            const p = PRICE_TABLE[zoneId];
                                            if (!p) return null;
                                            const { parts, labor } = p[severity];
                                            const badge = severityBadge(severity);
                                            const opt = SEVERITY_OPTIONS.find(s => s.id === severity);
                                            return (
                                                <div key={zoneId} className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-lg flex-shrink-0">{opt.emoji}</span>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-white truncate">{p.label}</p>
                                                            <span
                                                                className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border"
                                                                style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}
                                                            >
                                                                {opt.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-xs text-[#6b7280]">₱{(parts[0]+labor[0]).toLocaleString()} – ₱{(parts[1]+labor[1]).toLocaleString()}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveZone(zoneId)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Live Estimate Panel */}
                            {estimate.items.length > 0 && (
                                <div className="rounded-2xl overflow-hidden border border-[#f97316]/30">
                                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#1a0f00,#111111)', borderBottom: '1px solid rgba(249,115,22,0.2)' }}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">📊</span>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">Price Estimate</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">MMG Standard Rate</span>
                                    </div>
                                    <div className="bg-[#0d0d0d] p-5 space-y-4">
                                        {/* Line items */}
                                        <div className="rounded-xl overflow-hidden border border-[#1f1f1f]">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="bg-[#111111] text-[#6b7280]">
                                                        <th className="px-3 py-2 font-black uppercase tracking-widest">Area</th>
                                                        <th className="px-3 py-2 font-black uppercase tracking-widest text-right">Parts (₱)</th>
                                                        <th className="px-3 py-2 font-black uppercase tracking-widest text-right">Labor (₱)</th>
                                                        <th className="px-3 py-2 font-black uppercase tracking-widest text-right">Range (₱)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {estimate.items.map((item, i) => (
                                                        <tr key={i} className="border-t border-[#1f1f1f]">
                                                            <td className="px-3 py-2.5 text-white font-semibold">{item.area_label}</td>
                                                            <td className="px-3 py-2.5 text-right text-[#9ca3af]">
                                                                {fmt(item.parts_min)}–{fmt(item.parts_max)}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-right text-[#9ca3af]">
                                                                {fmt(item.labor_min)}–{fmt(item.labor_max)}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-right font-black text-[#f97316]">
                                                                {fmt(item.subtotal_min)}–{fmt(item.subtotal_max)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Total */}
                                        <div className="flex items-center justify-between bg-[#111111] border border-[#f97316]/20 rounded-xl p-4">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-[#6b7280]">Estimated Total Range</p>
                                                <p className="text-[10px] text-[#6b7280] mt-0.5">Subject to physical inspection</p>
                                            </div>
                                            <p className="text-2xl font-black text-white">
                                                ₱{fmt(estimate.total_min)}
                                                <span className="text-[#6b7280] text-base"> – </span>
                                                ₱{fmt(estimate.total_max)}
                                            </p>
                                        </div>

                                        {/* Smart Approval Status */}
                                        {willAutoApprove ? (
                                            <div className="flex items-start gap-3 p-3 rounded-xl border border-green-500/30 bg-green-500/5">
                                                <span className="text-green-400 text-lg flex-shrink-0">✅</span>
                                                <div>
                                                    <p className="text-xs font-black text-green-400 uppercase tracking-widest">Auto-Approval Eligible</p>
                                                    <p className="text-[10px] text-[#9ca3af] mt-0.5 leading-relaxed">
                                                        This is a minor repair under ₱{fmt(AUTO_APPROVAL_THRESHOLD)} with no severe damage.
                                                        Submit to get <strong>instant approval</strong> and email quote!
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-3 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                                                <span className="text-yellow-400 text-lg flex-shrink-0">🔍</span>
                                                <div>
                                                    <p className="text-xs font-black text-yellow-400 uppercase tracking-widest">Mechanic Review Required</p>
                                                    <p className="text-[10px] text-[#9ca3af] mt-0.5 leading-relaxed">
                                                        {hasSevere
                                                            ? 'Severe damage detected. A mechanic will review and provide a formal quotation.'
                                                            : `Estimate exceeds ₱${fmt(AUTO_APPROVAL_THRESHOLD)}. A mechanic will review before finalizing.`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Photo Upload */}
                            <div className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f]">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#6b7280] mb-4">
                                    Upload Supporting Photos <span className="font-normal text-[#4b5563] normal-case">(optional but recommended)</span>
                                </h3>
                                <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl bg-[#0d0d0d] hover:border-[#f97316] hover:bg-[#111111] transition-all">
                                    <div className="p-5 text-center space-y-3">
                                        <svg className="mx-auto h-10 w-10 text-[#3a3a3a]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex gap-4 text-sm font-bold justify-center">
                                            <label className="cursor-pointer text-[#f97316] hover:text-[#fb923c] flex items-center gap-1 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                Upload Photos
                                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                            </label>
                                            <span className="text-[#3a3a3a]">or</span>
                                            <label className="cursor-pointer text-[#f97316] hover:text-[#fb923c] flex items-center gap-1 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Take Photo
                                                <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-[#3a3a3a]">JPG, PNG, WEBP up to 10MB each</p>
                                    </div>
                                </div>

                                {previewUrls.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mt-4">
                                        {previewUrls.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] group">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(idx)}
                                                    className="absolute top-1.5 right-1.5 bg-red-600/90 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                {errors.damage_markers && (
                                    <p className="text-red-500 text-sm mb-3">⚠️ {errors.damage_markers}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-8 py-4 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                                    style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)', boxShadow: '0 8px 32px rgba(249,115,22,0.35)' }}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Calculating & Submitting...
                                        </>
                                    ) : (
                                        <>
                                            📋 Submit & Get My Estimate
                                            {willAutoApprove && estimate.items.length > 0 && (
                                                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    Auto-Approved
                                                </span>
                                            )}
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-[#4b5563] mt-2">
                                    Your estimate will appear instantly after submission.
                                </p>
                            </div>

                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

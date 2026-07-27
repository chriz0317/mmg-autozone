import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import IntakeNavbar from '@/Components/IntakeNavbar';

export default function IntakeForm({ auth }) {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleType = urlParams.get('type') || 'sedan';

    const vehicleImages = {
        sedan: { img1: '/images/Picture1.png', img2: '/images/Picture2.png' },
        pickup: { img1: '/images/pickup-outline-1.png', img2: '/images/pickup-outline-2.png' },
        van: { img1: '/images/van-outline-1.png', img2: '/images/van-outline-2.png' },
        'suv-hatchback': { img1: '/images/suv-outline-1.png', img2: '/images/suv-outline-2.png' },
        truck: { img1: '/images/truck-outline-1.png', img2: null }
    };
    const currentImages = vehicleImages[vehicleType] || vehicleImages.sedan;

    const [customerInfo, setCustomerInfo] = useState({
        customer: '',
        address: '',
        contact_no: '',
        email: '',
        received_by: '',
        due_date: '',
        vehicle: '',
        plate_no: '',
        color: '',
        fuel_level: '8',
        scope_of_works: '',
        mileage: ''
    });

    const [checklist, setChecklist] = useState({
        exterior_lights: '✓', interior_lights: '✓', radio_off: '✓', upholstery_clean: '✓',
        headlining_check: '✓', indicator_lamp: '✓', power_windows: '✓', central_lock: '✓',
        horn: '✓', windshield_crack: '✓', wipers: '✓', window_tints: '✓',
        side_mirrors: '✓', front_bumper_sensor: '✓', rear_bumper_sensor: '✓', hood_trunk_backdoor: '✓',
        spare_tire_brand: '✓', jack_tools: '✓', matting: '✓', hub_caps: '✓',
        ewd: '✓', oil_water_level: '✓',
        tire_frt_lh: '', tire_rr_lh: '', tire_frt_rh: '', tire_rr_rh: '',
        tire_inflation: '✓', remote_key: '✓'
    });

    const [accessories, setAccessories] = useState([]);
    const [accessoriesOtherText, setAccessoriesOtherText] = useState('');
    
    const [looseItems, setLooseItems] = useState([]);
    const [looseItemsOtherText, setLooseItemsOtherText] = useState('');

    const [markers, setMarkers] = useState([]);
    const [activeMarkerType, setActiveMarkerType] = useState('S');

    useEffect(() => {
        setMarkers([]);
    }, [vehicleType]);

    const handleImageClick = (e, viewStr) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMarkers([...markers, { x, y, type: activeMarkerType, view: viewStr }]);
    };

    // Estimates Logic
    const [availableEstimates, setAvailableEstimates] = useState([]);
    const [selectedEstimateId, setSelectedEstimateId] = useState('');
    const [estimatePhotos, setEstimatePhotos] = useState([]);

    useEffect(() => {
        fetch('/api/service-requests')
            .then(res => res.json())
            .then(data => {
                setAvailableEstimates(data);
                const params = new URLSearchParams(window.location.search);
                const queryId = params.get('estimate_id') || params.get('request_id');
                if (queryId) {
                    const est = data.find(x => x.id == queryId);
                    if (est) {
                        setSelectedEstimateId(queryId);
                        setCustomerInfo(prev => ({
                            ...prev,
                            customer: est.name || est.user?.name || prev.customer,
                            contact_no: est.contact_no || est.user?.contact_no || prev.contact_no,
                            email: est.email || est.user?.email || prev.email,
                            address: est.user?.address || prev.address,
                            vehicle: est.vehicle_model || prev.vehicle,
                            plate_no: est.plate_no || prev.plate_no,
                            scope_of_works: est.issue_description || (est.service_type ? est.service_type.replace('_', ' ') : prev.scope_of_works),
                            source: 'Online'
                        }));
                        setEstimatePhotos(est.photos || []);
                    }
                }
            })
            .catch(err => console.error("Error fetching service requests:", err));
    }, []);

    const handleEstimateSelect = (e) => {
        const id = e.target.value;
        setSelectedEstimateId(id);
        if (!id) {
            setEstimatePhotos([]);
            return;
        }
        const est = availableEstimates.find(x => x.id == id);
        if (est) {
            setCustomerInfo(prev => ({
                ...prev,
                customer: est.name || est.user?.name || prev.customer,
                contact_no: est.contact_no || est.user?.contact_no || prev.contact_no,
                email: est.email || est.user?.email || prev.email,
                address: est.user?.address || prev.address,
                vehicle: est.vehicle_model || prev.vehicle,
                plate_no: est.plate_no || prev.plate_no,
                scope_of_works: est.issue_description || prev.scope_of_works,
                source: 'Online'
            }));
            setEstimatePhotos(est.photos || []);
        }
    };

    // Signature Pad Logic
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        // Handle touch events
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        const { x, y } = getCoordinates(e.nativeEvent || e);
        const context = canvasRef.current.getContext('2d');
        context.lineWidth = 2; // Thicker line for a larger canvas buffer
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        if (!isDrawing) return;
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
        setSignatureData(canvasRef.current.toDataURL('image/png'));
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e.nativeEvent || e);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData(null);
    };

    const handleUndo = () => {
        setMarkers(prev => prev.slice(0, -1));
    };

    const handleChecklistChange = (key, value) => {
        setChecklist(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (item, array, setArray) => {
        if (array.includes(item)) {
            setArray(array.filter(i => i !== item));
        } else {
            setArray([...array, item]);
        }
    };

    const submitForm = (e) => {
        e.preventDefault();

        const finalAccessories = accessories.includes('Others') && accessoriesOtherText.trim() !== ''
            ? [...accessories.filter(a => a !== 'Others'), `Others: ${accessoriesOtherText}`]
            : accessories;

        const finalLooseItems = looseItems.includes('Others') && looseItemsOtherText.trim() !== ''
            ? [...looseItems.filter(i => i !== 'Others'), `Others: ${looseItemsOtherText}`]
            : looseItems;

        router.post('/api/save-intake', {
            ...customerInfo,
            checklist,
            accessories: finalAccessories,
            loose_items: finalLooseItems,
            damage_markers: markers,
            vehicle_type: vehicleType,
            customer_signature: signatureData,
            estimate_id: selectedEstimateId
        });
    };

    const leftColumnItems = [
        { label: 'Exterior Lights', key: 'exterior_lights' },
        { label: 'Interior Lights', key: 'interior_lights' },
        { label: 'Radio Off', key: 'radio_off' },
        { label: 'Upholstery Clean', key: 'upholstery_clean' },
        { label: 'Headlining Check', key: 'headlining_check' },
        { label: 'Indicator Lamp', key: 'indicator_lamp' },
        { label: 'Power Windows', key: 'power_windows' },
        { label: 'Central Lock', key: 'central_lock' },
        { label: 'Horn', key: 'horn' },
        { label: 'Windshield Crack', key: 'windshield_crack' },
        { label: 'Wipers', key: 'wipers' },
        { label: 'Window Tints', key: 'window_tints' },
    ];

    const rightColumnItems = [
        { label: 'Side Mirrors', key: 'side_mirrors' },
        { label: 'Front Bumper Sensor', key: 'front_bumper_sensor' },
        { label: 'Rear Bumper Sensor', key: 'rear_bumper_sensor' },
        { label: 'Hood/Trunk Backdoor', key: 'hood_trunk_backdoor' },
        { label: 'Spare Tire/Brand', key: 'spare_tire_brand' },
        { label: 'Jack & Tools', key: 'jack_tools' },
        { label: 'Matting', key: 'matting' },
        { label: 'Hub Caps / Center Caps', key: 'hub_caps' },
        { label: 'EWD', key: 'ewd' },
        { label: 'Oil / Water Level', key: 'oil_water_level' },
        { label: 'Tire Inflation', key: 'tire_inflation' },
        { label: 'Remote Key Working', key: 'remote_key' },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans text-white antialiased pb-12" style={{ background: '#0a0a0a' }}>
            <Head title="Vehicle Intake - MMG Autozone" />
            <IntakeNavbar auth={auth} activeVehicle={vehicleType} />
            
            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6 mt-4">
                <div className="rounded-2xl overflow-hidden shadow-sm border mb-6 relative" style={{ borderColor: '#1f1f1f', aspectRatio: '21/9' }}>
                    <img src="/images/Bg1.png" alt="MMG Autozone Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-8">
                        <h1 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-white uppercase drop-shadow-md">Vehicle Checklist</h1>
                    </div>
                </div>
                <div className="p-6 rounded-2xl shadow-sm border mb-6" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <div className="flex items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: '#1f1f1f' }}>
                        <label className="text-sm font-bold whitespace-nowrap" style={{ color: '#f97316' }}>Load from Photo Estimate:</label>
                        <select 
                            value={selectedEstimateId} 
                            onChange={handleEstimateSelect}
                            className="flex-1 px-4 py-2 rounded-xl text-sm text-white outline-none transition-all border"
                            style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}
                            onFocus={e => e.target.style.borderColor = '#f97316'} 
                            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                        >
                            <option value="">-- Select an Approved/Pending Estimate --</option>
                            {availableEstimates.map(est => (
                                <option key={est.id} value={est.id}>
                                    {est.user?.name} - {est.vehicle_model} ({est.plate_no}) - {est.status}
                                </option>
                            ))}
                        </select>
                    <div className="flex items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: '#1f1f1f' }}>
                        <label className="text-sm font-bold whitespace-nowrap" style={{ color: '#9ca3af' }}>Transaction Source:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="source" 
                                    value="Walk-In" 
                                    checked={customerInfo.source === 'Walk-In' || !customerInfo.source} 
                                    onChange={e => setCustomerInfo({...customerInfo, source: e.target.value})}
                                    className="accent-orange-500"
                                />
                                <span className="text-sm text-white">Walk-In</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="source" 
                                    value="Online" 
                                    checked={customerInfo.source === 'Online'} 
                                    onChange={e => setCustomerInfo({...customerInfo, source: e.target.value})}
                                    className="accent-orange-500"
                                />
                                <span className="text-sm text-white">Online (Service Request)</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Customer:</label>
                                <input type="text" value={customerInfo.customer} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, customer: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Address:</label>
                                <input type="text" value={customerInfo.address} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Contact No.:</label>
                                <input type="text" value={customerInfo.contact_no} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, contact_no: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Email:</label>
                                <input type="email" value={customerInfo.email} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Reference No.:</label>
                                <input type="text" disabled placeholder="Auto-Generated" className="w-2/3 border-b py-1 bg-transparent text-sm" style={{ borderColor: '#2a2a2a', color: '#6b7280' }} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Received By:</label>
                                <input type="text" className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, received_by: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Date Received:</label>
                                <input type="text" disabled placeholder="Today" className="w-2/3 border-b py-1 bg-transparent text-sm" style={{ borderColor: '#2a2a2a', color: '#6b7280' }} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Due Date:</label>
                                <input type="date" className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a', colorScheme: 'dark' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, due_date: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Vehicle:</label>
                                <input type="text" value={customerInfo.vehicle} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, vehicle: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Plate no.:</label>
                                <input type="text" value={customerInfo.plate_no} className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, plate_no: e.target.value})} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/3 text-sm font-bold" style={{ color: '#9ca3af' }}>Color:</label>
                                <input type="text" className="w-2/3 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, color: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl shadow-sm border" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <h2 className="text-base font-bold text-white border-b pb-2 mb-4" style={{ borderColor: '#1f1f1f' }}>Scope of Works:</h2>
                    <textarea rows="4" value={customerInfo.scope_of_works} className="w-full border p-3 bg-transparent text-sm text-white outline-none resize-none rounded-xl transition-colors mb-4" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} onChange={e => setCustomerInfo({...customerInfo, scope_of_works: e.target.value})}></textarea>
                    
                    {estimatePhotos.length > 0 && (
                        <div className="mt-2 pt-4 border-t" style={{ borderColor: '#1f1f1f' }}>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>Customer Uploaded Photos</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {estimatePhotos.map((photo, i) => (
                                    <a key={i} href={photo} target="_blank" rel="noreferrer" className="block aspect-square rounded-xl overflow-hidden border transition-transform hover:scale-105" style={{ borderColor: '#2a2a2a' }}>
                                        <img src={photo} alt="Estimate Photo" className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 rounded-2xl shadow-sm border" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 mb-4 gap-2" style={{ borderColor: '#1f1f1f' }}>
                        <h2 className="text-base font-bold text-white uppercase tracking-wider">Visual Damage Map ({vehicleType})</h2>
                        
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setActiveMarkerType('S')} className={`px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${activeMarkerType === 'S' ? 'bg-[#ef4444] text-white shadow-sm' : 'text-[#9ca3af]'}`} style={activeMarkerType !== 'S' ? { background: '#1a1a1a' } : {}}>Scratch (S)</button>
                            <button onClick={() => setActiveMarkerType('D')} className={`px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${activeMarkerType === 'D' ? 'bg-[#f59e0b] text-white shadow-sm' : 'text-[#9ca3af]'}`} style={activeMarkerType !== 'D' ? { background: '#1a1a1a' } : {}}>Dent (D)</button>
                            <button onClick={() => setActiveMarkerType('C')} className={`px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${activeMarkerType === 'C' ? 'bg-[#8b5cf6] text-white shadow-sm' : 'text-[#9ca3af]'}`} style={activeMarkerType !== 'C' ? { background: '#1a1a1a' } : {}}>Crack (C)</button>
                            
                            <div className="w-px mx-1 hidden sm:block" style={{ background: '#1f1f1f' }}></div>
                            
                            <button onClick={handleUndo} className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:text-white" style={{ background: '#1a1a1a', color: '#6b7280' }} onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>Undo</button>
                            <button onClick={() => setMarkers([])} className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:text-white" style={{ background: '#1a1a1a', color: '#6b7280' }} onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>Clear All</button>
                        </div>
                    </div>

                    {vehicleType === 'truck' ? (
                        <div className="flex justify-center mb-6">
                            <div className="relative overflow-hidden flex justify-center items-center h-80 w-full max-w-2xl group cursor-crosshair border rounded-xl" style={{ background: '#ffffff', borderColor: '#e5e7eb' }} onClick={(e) => handleImageClick(e, 'full-view')}>
                                <img src={currentImages.img1} alt="Truck View" className="h-72 object-contain pointer-events-none select-none drop-shadow-sm" />
                                {markers.filter(m => m.view === 'full-view').map((m, i) => (
                                    <div key={i} style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%` }} className={`text-base font-black -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none ${m.type === 'S' ? 'text-[#ef4444]' : m.type === 'D' ? 'text-[#f59e0b]' : 'text-[#8b5cf6]'}`}>{m.type}</div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="relative overflow-hidden flex justify-center items-center h-56 rounded-xl border group cursor-crosshair" style={{ background: '#ffffff', borderColor: '#e5e7eb' }} onClick={(e) => handleImageClick(e, 'front-left')}>
                                <img src={currentImages.img1} alt="Front View" className="h-44 object-contain pointer-events-none select-none drop-shadow-sm" />
                                {markers.filter(m => m.view === 'front-left').map((m, i) => (
                                    <div key={i} style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%` }} className={`text-base font-black -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none ${m.type === 'S' ? 'text-[#ef4444]' : m.type === 'D' ? 'text-[#f59e0b]' : 'text-[#8b5cf6]'}`}>{m.type}</div>
                                ))}
                            </div>
                            <div className="relative overflow-hidden flex justify-center items-center h-56 rounded-xl border group cursor-crosshair" style={{ background: '#ffffff', borderColor: '#e5e7eb' }} onClick={(e) => handleImageClick(e, 'rear-right')}>
                                <img src={currentImages.img2} alt="Rear View" className="h-44 object-contain pointer-events-none select-none drop-shadow-sm" />
                                {markers.filter(m => m.view === 'rear-right').map((m, i) => (
                                    <div key={i} style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%` }} className={`text-base font-black -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none ${m.type === 'S' ? 'text-[#ef4444]' : m.type === 'D' ? 'text-[#f59e0b]' : 'text-[#8b5cf6]'}`}>{m.type}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t pt-6" style={{ borderColor: '#1f1f1f' }}>
                        <div className="space-y-4">
                            <h3 className="font-bold text-white text-sm uppercase">Tires & Mileage</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[['FRT LH', 'tire_frt_lh'], ['FRT RH', 'tire_frt_rh'], ['RR LH', 'tire_rr_lh'], ['RR RH', 'tire_rr_rh']].map(([label, key]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <label className="text-xs font-bold w-16 shrink-0" style={{ color: '#9ca3af' }}>{label}:</label>
                                        <select
                                            value={checklist[key]}
                                            onChange={e => setChecklist({...checklist, [key]: e.target.value})}
                                            className="flex-1 border rounded-md px-2 py-1 outline-none text-sm text-white transition-colors"
                                            style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}
                                        >
                                            <option value="">-- mm</option>
                                            {[...Array(11)].map((_, i) => (
                                                <option key={i} value={i}>{i} mm</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center pt-3 gap-2">
                                <label className="text-xs font-bold w-16 shrink-0" style={{ color: '#9ca3af' }}>Mileage:</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="km"
                                    className="w-40 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors"
                                    style={{ borderColor: '#2a2a2a' }}
                                    onFocus={e => e.target.style.borderColor = '#f97316'}
                                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                    onChange={e => setCustomerInfo({...customerInfo, mileage: e.target.value})}
                                />
                                <span className="text-xs" style={{ color: '#6b7280' }}>km</span>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs font-bold text-white uppercase">
                                    Fuel Level
                                </label>
                                <span className="text-xs font-bold" style={{ color: '#f97316' }}>{customerInfo.fuel_level}/16 Tank</span>
                            </div>
                            <div className="flex gap-1 h-8">
                                {[...Array(16)].map((_, i) => {
                                    const level = i + 1;
                                    const isFilled = level <= parseInt(customerInfo.fuel_level);
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setCustomerInfo({ ...customerInfo, fuel_level: level.toString() })}
                                            className={`flex-1 rounded-sm transition-all duration-150 shadow-sm`}
                                            style={isFilled ? { background: '#f97316' } : { background: '#2a2a2a' }}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-[10px] font-bold mt-2 px-1" style={{ color: '#6b7280' }}>
                                <span>E</span>
                                <span>1/4</span>
                                <span>1/2</span>
                                <span>3/4</span>
                                <span>F</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl shadow-sm border" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <h2 className="text-base font-bold text-white border-b pb-2 mb-4 uppercase tracking-wider" style={{ borderColor: '#1f1f1f' }}>Inspection Checklist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="space-y-2">
                            {leftColumnItems.map(item => {
                                const isChecked = checklist[item.key] === '✓';
                                const isCrossed = checklist[item.key] === 'X';
                                const isCustom = !isChecked && !isCrossed && checklist[item.key] !== '';
                                
                                return (
                                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 text-sm gap-2" style={{ borderColor: '#1a1a1a' }}>
                                    <span className="font-medium" style={{ color: '#9ca3af' }}>{item.label}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="flex rounded-lg p-0.5 border" style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}>
                                            {['✓', 'X'].map(status => (
                                                <button 
                                                    key={status} 
                                                    type="button" 
                                                    onClick={() => handleChecklistChange(item.key, status)} 
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${checklist[item.key] === status ? (status === '✓' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white') : 'hover:text-white'}`}
                                                    style={checklist[item.key] !== status ? { color: '#6b7280' } : {}}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Remarks / N/A" 
                                            value={isCustom ? checklist[item.key] : ''}
                                            onChange={(e) => handleChecklistChange(item.key, e.target.value)}
                                            className={`w-24 px-2 py-1.5 text-xs rounded-md border outline-none transition text-white`}
                                            style={isCustom ? { borderColor: '#f97316', background: 'rgba(249,115,22,0.1)' } : { borderColor: '#2a2a2a', background: '#1a1a1a' }}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; }}
                                            onBlur={e => { e.target.style.borderColor = isCustom ? '#f97316' : '#2a2a2a'; }}
                                        />
                                    </div>
                                </div>
                            )})}
                        </div>
                        <div className="space-y-2">
                            {rightColumnItems.map(item => {
                                const isChecked = checklist[item.key] === '✓';
                                const isCrossed = checklist[item.key] === 'X';
                                const isCustom = !isChecked && !isCrossed && checklist[item.key] !== '';
                                
                                return (
                                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 text-sm gap-2" style={{ borderColor: '#1a1a1a' }}>
                                    <span className="font-medium" style={{ color: '#9ca3af' }}>{item.label}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="flex rounded-lg p-0.5 border" style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}>
                                            {['✓', 'X'].map(status => (
                                                <button 
                                                    key={status} 
                                                    type="button" 
                                                    onClick={() => handleChecklistChange(item.key, status)} 
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${checklist[item.key] === status ? (status === '✓' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white') : 'hover:text-white'}`}
                                                    style={checklist[item.key] !== status ? { color: '#6b7280' } : {}}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Remarks / N/A" 
                                            value={isCustom ? checklist[item.key] : ''}
                                            onChange={(e) => handleChecklistChange(item.key, e.target.value)}
                                            className={`w-24 px-2 py-1.5 text-xs rounded-md border outline-none transition text-white`}
                                            style={isCustom ? { borderColor: '#f97316', background: 'rgba(249,115,22,0.1)' } : { borderColor: '#2a2a2a', background: '#1a1a1a' }}
                                            onFocus={e => { e.target.style.borderColor = '#f97316'; }}
                                            onBlur={e => { e.target.style.borderColor = isCustom ? '#f97316' : '#2a2a2a'; }}
                                        />
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl shadow-sm border" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Accessories</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {['Door Visor', 'Dash Cam', 'Mags', 'Fog Lamps', 'Reverse Camera', 'Seat Cover'].map(item => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer py-1 font-medium" style={{ color: '#9ca3af' }}>
                                    <input type="checkbox" checked={accessories.includes(item)} onChange={() => toggleArrayItem(item, accessories, setAccessories)} className="rounded h-4 w-4" style={{ accentColor: '#f97316' }} />
                                    <span>{item}</span>
                                </label>
                            ))}
                            <div className="col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 mt-2 border-t pt-3" style={{ borderColor: '#1f1f1f' }}>
                                <label className="flex items-center gap-2 cursor-pointer font-medium" style={{ color: '#9ca3af' }}>
                                    <input type="checkbox" checked={accessories.includes('Others')} onChange={() => toggleArrayItem('Others', accessories, setAccessories)} className="rounded h-4 w-4" style={{ accentColor: '#f97316' }} />
                                    <span>Others:</span>
                                </label>
                                {accessories.includes('Others') && (
                                    <input type="text" placeholder="Specify custom accessory..." value={accessoriesOtherText} onChange={e => setAccessoriesOtherText(e.target.value)} className="flex-1 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm border" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Loose Items</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {['Car Freshener', 'Pillows / Rosary', 'Umbrella / Coins', 'Sun Shade', 'Documents'].map(item => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer py-1 font-medium" style={{ color: '#9ca3af' }}>
                                    <input type="checkbox" checked={looseItems.includes(item)} onChange={() => toggleArrayItem(item, looseItems, setLooseItems)} className="rounded h-4 w-4" style={{ accentColor: '#f97316' }} />
                                    <span>{item}</span>
                                </label>
                            ))}
                            <div className="col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 mt-2 border-t pt-3" style={{ borderColor: '#1f1f1f' }}>
                                <label className="flex items-center gap-2 cursor-pointer font-medium" style={{ color: '#9ca3af' }}>
                                    <input type="checkbox" checked={looseItems.includes('Others')} onChange={() => toggleArrayItem('Others', looseItems, setLooseItems)} className="rounded h-4 w-4" style={{ accentColor: '#f97316' }} />
                                    <span>Others:</span>
                                </label>
                                {looseItems.includes('Others') && (
                                    <input type="text" placeholder="Specify custom loose item..." value={looseItemsOtherText} onChange={e => setLooseItemsOtherText(e.target.value)} className="flex-1 border-b py-1 outline-none bg-transparent text-sm text-white transition-colors" style={{ borderColor: '#2a2a2a' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl shadow-sm border mt-6" style={{ background: '#111111', borderColor: '#1f1f1f' }}>
                    <p className="text-xs mb-8 leading-relaxed" style={{ color: '#6b7280' }}>
                        I hereby acknowledge that the above information about the vehicle is correct and MMG AUTOZONE CORP. will not be liable for any loss or damages that was not declared and/or turned over during inspection.
                    </p>
                    <div className="flex flex-col md:flex-row justify-end items-end gap-6 mt-6">
                        <div className="flex flex-col items-center">
                            
                            {/* Fullscreen Overlay Wrapper */}
                            <div className={isFullscreen ? "fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" : "relative"}>
                                
                                {isFullscreen && (
                                    <div className="w-full max-w-4xl flex justify-between items-end mb-4">
                                        <p className="text-white font-bold text-lg uppercase tracking-wider">Please Sign Below</p>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setIsFullscreen(false); }}
                                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition"
                                        >
                                            Done / Close
                                        </button>
                                    </div>
                                )}

                                <div className={`bg-white rounded-xl overflow-hidden shadow-inner border border-gray-300 relative mb-2 ${isFullscreen ? 'w-full max-w-4xl aspect-[21/9]' : 'w-[300px] h-[150px]'}`}>
                                    <canvas
                                        ref={canvasRef}
                                        width={800}
                                        height={343}
                                        onMouseDown={startDrawing}
                                        onMouseUp={finishDrawing}
                                        onMouseMove={draw}
                                        onMouseLeave={finishDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchEnd={finishDrawing}
                                        onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                                        className="cursor-crosshair w-full h-full touch-none"
                                    />
                                    
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {!isFullscreen && (
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setIsFullscreen(true); }}
                                                className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                                Full Size
                                            </button>
                                        )}
                                        {signatureData && (
                                            <button 
                                                onClick={(e) => { e.preventDefault(); clearSignature(); }}
                                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors shadow-sm"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {isFullscreen && (
                                    <p className="text-gray-400 text-sm mt-4 text-center max-w-lg">
                                        Use your finger or mouse to draw your signature in the box above. Click "Done / Close" when finished.
                                    </p>
                                )}
                            </div>

                            <div className="w-64 border-t pt-2 text-center mt-2" style={{ borderColor: '#374151' }}>
                                <input 
                                    type="text" 
                                    value={customerInfo.customer} 
                                    onChange={e => setCustomerInfo({...customerInfo, customer: e.target.value})}
                                    placeholder="Type Printed Name Here" 
                                    className="w-full bg-transparent border-none text-center text-sm font-bold text-white focus:outline-none focus:ring-0 p-0 mb-1"
                                />
                                <p className="text-xs" style={{ color: '#6b7280' }}>(Signature over Printed Name)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={submitForm} className="text-white font-bold text-sm py-3 px-8 rounded-xl transition shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
                        Generate Intake Record
                    </button>
                </div>

            </main>
        </div>
    );
}

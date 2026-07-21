<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MMG Autozone - Vehicle Checklist</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100 p-4 md:p-8 font-sans antialiased text-black">
    
    <div class="max-w-5xl mx-auto bg-white p-8 shadow-sm border border-gray-300">
        
        <div class="flex flex-col md:flex-row justify-between items-start border-b border-gray-400 pb-4 mb-6">
            <h1 class="text-3xl tracking-wide font-serif mt-2">VEHICLE CHECKLIST</h1>
            <div class="text-sm text-right mt-4 md:mt-0">
                <div class="font-bold text-lg tracking-wider">MMG AUTOZONE CORP.</div>
                <div>Blk 14 Lot 14, Road 7, Silcas Village, Binan, Laguna</div>
                <div>0917 167 6663; 0917 178 6664</div>
                <a href="mailto:autozonemmg@gmail.com" class="text-blue-600 underline">autozonemmg@gmail.com</a>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm">
            
            <div class="flex items-end">
                <label class="w-32 pb-1">Customer:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            <div class="flex items-end">
                <label class="w-32 pb-1">Date Received:</label>
                <input type="date" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>

            <div class="flex items-end">
                <label class="w-32 pb-1">Address:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            <div class="flex items-end">
                <label class="w-32 pb-1">Due Date:</label>
                <input type="date" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>

            <div class="flex items-end">
                <label class="w-32 pb-1">Contact No.:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            <div class="flex items-end">
                <label class="w-32 pb-1">Vehicle:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>

            <div class="flex items-end">
                <label class="w-32 pb-1">Reference No.:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            <div class="flex items-end">
                <label class="w-32 pb-1">Plate no.:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>

            <div class="flex items-end">
                <label class="w-32 pb-1">Received By:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            <div class="flex items-end">
                <label class="w-32 pb-1">Color:</label>
                <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1">
            </div>
            
        </div>

        <div class="mb-8">
            <div class="border border-black">
                <div class="font-bold border-b border-black px-2 py-1 bg-gray-50 text-sm">Scope of Works:</div>
                <textarea rows="5" class="w-full p-2 focus:outline-none focus:bg-gray-50 resize-y leading-loose" style="background-image: repeating-linear-gradient(transparent, transparent 31px, #ccc 31px, #ccc 32px); line-height: 32px;"></textarea>
            </div>
        </div>

        <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-sm">2D Vehicle Damage Map</span>
                <div class="space-x-2 text-xs">
                    <button class="bg-red-500 text-white px-2 py-1 rounded">Scratch (S)</button>
                    <button class="bg-orange-500 text-white px-2 py-1 rounded">Dent (D)</button>
                    <button class="bg-purple-500 text-white px-2 py-1 rounded">Crack (C)</button>
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 border border-black p-4 bg-gray-50 justify-center items-center min-h-[300px]">
                
                <!-- Front-Left Sedan Image Container -->
                <div class="w-full md:w-1/2 h-64 flex items-center justify-center bg-white border border-gray-300 relative">
                    <img src="{{ asset('images/picture1.png') }}" alt="Front Left Sedan Map" class="w-full h-full object-contain p-2">
                </div>

                <!-- Rear-Right Sedan Image Container -->
                <div class="w-full md:w-1/2 h-64 flex items-center justify-center bg-white border border-gray-300 relative">
                    <img src="{{ asset('images/picture2.png') }}" alt="Rear Right Sedan Map" class="w-full h-full object-contain p-2">
                </div>
        
                
            </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 text-sm">
    
    <div class="space-y-4">
        
        <div class="flex items-start gap-2">
            <div class="w-40 font-semibold text-sm leading-tight pt-1">Wheels and Tires<br>and Brand/Model:</div>
            <div class="flex-1 space-y-2">
                <div class="grid grid-cols-2 gap-x-2 gap-y-2 text-xs">
                    <label class="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" class="accent-blue-900"> FRT LH</label>
                    <label class="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" class="accent-blue-900"> RR LH</label>
                    <label class="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" class="accent-blue-900"> FRT RH</label>
                    <label class="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" class="accent-blue-900"> RR RH</label>
                </div>
                <input type="text" class="w-full border-b border-black focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </div>
        </div>

        <div class="flex items-end gap-2">
            <label class="w-40 pb-1 font-semibold text-sm">Tire Inflation:</label>
            <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1 bg-transparent">
        </div>

        <div class="flex items-center gap-2 pt-1">
            <label class="w-40 font-semibold text-sm">Remote key working:</label>
            <div class="flex-1">
                 <input type="checkbox" class="w-5 h-5 accent-blue-900">
            </div>
        </div>
        
    </div>

    <div class="space-y-6 mt-1 md:mt-0">
        
        <div class="flex items-center gap-2">
            <label class="w-24 font-semibold text-sm">Fuel Level:</label>
            <div class="flex items-center font-bold">
                <span class="mr-2 text-sm">E</span>
                <div class="flex border-2 border-black h-8 w-48 cursor-pointer">
                    <div class="flex-1 border-r border-black hover:bg-gray-200 transition"></div>
                    <div class="flex-1 border-r border-black hover:bg-gray-200 transition bg-blue-900"></div>
                    <div class="flex-1 border-r border-black hover:bg-gray-200 transition"></div>
                    <div class="flex-1 hover:bg-gray-200 transition"></div>
                </div>
                <span class="ml-2 text-sm">F</span>
            </div>
        </div>

        <div class="flex items-end gap-2">
            <label class="w-24 pb-1 font-semibold text-sm">Mileage:</label>
            <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1 bg-transparent">
        </div>

    </div>

</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mb-2 text-sm">
    
    <div class="space-y-1.5">
        <div class="flex items-center">
            <label class="w-48 font-semibold">Exterior Lights:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Interior Lights:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Radio Off:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Upholstery Clean:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Headlining Check:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Indicator Lamp:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Power Windows:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Central Lock:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Horn:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Windshield Crack Check:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Windshield Washer:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Wipers:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
    </div>

    <div class="space-y-1.5 mt-1.5 md:mt-0">
        <div class="flex items-center">
            <label class="w-48 font-semibold">Window tints:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Side Mirrors:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Front Bumper Sensor:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Rear Bumper Sensor:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Hood/Trunk Backdoor:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Spare Tire/Brand:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Jack:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Tools:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Matting:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">Hub Caps/ Center Caps:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">EWD:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center">
            <label class="w-48 font-semibold">* Oil/ Water Level:</label>
            <input type="text" class="flex-1 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
    </div>
</div>

<div class="text-xs mb-6 font-semibold">*If for pick-up.</div>

<div class="mb-10 text-sm">
    <div class="font-bold underline mb-3">Mode of Payment:</div>
    <div class="flex flex-wrap items-center gap-x-12 gap-y-4">
        <div class="flex items-center gap-3">
            <label class="font-semibold">Cash</label>
            <input type="text" class="w-32 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
        <div class="flex items-center gap-3">
            <label class="font-semibold">Check:</label>
            <input type="text" class="w-48 border border-black focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 py-0.5 bg-transparent">
        </div>
    </div>
</div>
<div class="text-sm mb-6 space-y-6 mt-8">

    <div>
        <div class="font-bold mb-3">Accessories/Parts Related to Area of Repair (ex: Foglamps, Back-Up Camera, Wipers, etc.):</div>
        <div class="flex flex-wrap gap-x-6 gap-y-3">
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Door Visor</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Dash Cam</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Mags</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Fog Lamps</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Reverse Camera</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Seat Cover</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
        </div>
    </div>

    <div>
        <div class="font-bold mb-3">Loose Items:</div>
        <div class="flex flex-wrap gap-x-6 gap-y-3">
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Car Freshner</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Pillows</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Rosary</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Umbrella</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Coins</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Sun Shade</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
            <label class="flex items-end gap-1 cursor-pointer">
                <input type="checkbox" class="accent-blue-900 mb-0.5 w-4 h-4"> <span class="whitespace-nowrap">Docs</span>
                <input type="text" class="border-b border-black w-16 focus:outline-none focus:border-blue-600 px-1 bg-transparent">
            </label>
        </div>
    </div>

    <div class="mt-6">
        <div class="font-bold mb-2">Notes:</div>
        <div class="space-y-4">
            <input type="text" class="w-full border-b border-black focus:outline-none focus:border-blue-600 bg-transparent">
            <input type="text" class="w-full border-b border-black focus:outline-none focus:border-blue-600 bg-transparent">
            <input type="text" class="w-full border-b border-black focus:outline-none focus:border-blue-600 bg-transparent">
        </div>
    </div>

</div>

<div class="mt-12 text-sm">
    <p class="mb-8 leading-relaxed font-medium">
        I hereby acknowledge that the above information about the vehicle<br>
        is correct and MMG AUTOZONE CORP. will not be liable for any loss or<br>
        damages that was not declared and/or turned over during inspection.
    </p>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div class="flex items-end w-full md:w-1/2">
            <label class="font-bold mr-2 whitespace-nowrap">Vehicle Owner/ Representative:</label>
            <input type="text" class="flex-1 border-b border-black focus:outline-none focus:border-blue-600 px-1 bg-transparent">
        </div>
        
        <div class="w-full md:w-auto flex flex-col items-center">
            <div class="w-64 h-12 border-b border-black"></div>
            <div class="mt-1 text-xs font-semibold">Signature over Printed Name</div>
        </div>
    </div>
</div>

<div class="mt-12 flex justify-end">
    <button type="submit" class="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded shadow transition">
        Complete Intake
    </button>
</div>
        </div>
    </div>
    
    
</body>
</html>
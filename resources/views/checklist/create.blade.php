<x-app-layout>
    <div class="min-h-screen bg-gray-50 pb-24">
        <header class="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
            <h1 class="text-xl font-extrabold tracking-wide">MMG AUTOZONE</h1>
            <button class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold transition">Save</button>
        </header>

        <main class="p-4 space-y-6 max-w-2xl mx-auto mt-4">
            <section class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Customer Details</h2>
                <div class="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Customer Name" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none">
                    <input type="text" placeholder="Contact Number" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none">
                    <textarea placeholder="Address" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" rows="2"></textarea>
                </div>
            </section>

            <section class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Vehicle Information</h2>
                <div class="grid grid-cols-2 gap-4">
                    <select class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none col-span-2">
                        <option value="" disabled selected>Select Vehicle Type</option>
                        <option value="sedan">Sedan</option>
                        <option value="pickup">Pick-up</option>
                        <option value="van">Van</option>
                        <option value="suv">SUV-Hatchback</option>
                        <option value="truck">Truck</option>
                    </select>
                    <input type="text" placeholder="Plate Number" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none">
                    <input type="text" placeholder="Color" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none">
                    <input type="number" placeholder="Mileage" class="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none col-span-2">
                </div>
            </section>

            <section class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Inspection Status</h2>
                
                <div class="space-y-6">
                    <div class="flex flex-col bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label class="font-semibold mb-3 text-gray-700">Fuel Level</label>
                        <input type="range" min="0" max="100" value="50" class="w-full accent-blue-900">
                        <div class="flex justify-between text-sm font-bold text-gray-500 mt-2">
                            <span>E</span>
                            <span>1/2</span>
                            <span>F</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span class="font-medium text-gray-700">Exterior Lights</span>
                            <select class="bg-gray-100 p-2 rounded outline-none font-semibold text-gray-700">
                                <option>Pass</option>
                                <option>Fail</option>
                                <option>Note</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span class="font-medium text-gray-700">Windshield</span>
                            <select class="bg-gray-100 p-2 rounded outline-none font-semibold text-gray-700">
                                <option>Pass</option>
                                <option>Fail</option>
                                <option>Note</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span class="font-medium text-gray-700">Tires (All)</span>
                            <select class="bg-gray-100 p-2 rounded outline-none font-semibold text-gray-700">
                                <option>Pass</option>
                                <option>Fail</option>
                                <option>Note</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span class="font-medium text-gray-700">Tools & Jack</span>
                            <select class="bg-gray-100 p-2 rounded outline-none font-semibold text-gray-700">
                                <option>Pass</option>
                                <option>Fail</option>
                                <option>Note</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="flex flex-col gap-4 mt-8">
                <button class="bg-blue-50 text-blue-900 border-2 border-blue-900 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Attach Photos
                </button>
                <button class="bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-lg font-bold text-lg shadow-lg transition">
                    Complete Intake & Generate QR
                </button>
            </section>
        </main>
    </div>
</x-app-layout>
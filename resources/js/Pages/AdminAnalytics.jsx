import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

export default function AdminAnalytics({ auth, kpis, dailyRevenue, paymentMethods, topItems }) {
    
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['kpis', 'dailyRevenue', 'paymentMethods', 'topItems'], preserveScroll: true, preserveState: true });
        }, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Formatting helpers
    const formatCurrency = (value) => `₱${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#eab308'];

    // Process daily revenue for recharts
    const chartData = dailyRevenue.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Revenue: Number(item.revenue)
    }));

    // Process payment methods
    const pieData = paymentMethods.map((item, index) => ({
        name: item.payment_method.toUpperCase(),
        value: Number(item.value),
        color: COLORS[index % COLORS.length]
    }));

    // Process top items
    const barData = topItems.map((item) => ({
        name: item.name,
        Quantity: Number(item.count)
    }));

    return (
        <AdminLayout>
            <Head title="Admin Analytics - MMG Autozone" />

            <div className="flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Analytics Dashboard</h1>
                        <p className="text-[#9ca3af] mt-1 text-sm">Monitor business performance and sales trends.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-16 h-16 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-[#9ca3af] text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                        <h3 className="text-3xl font-black text-white">{formatCurrency(kpis.totalRevenue)}</h3>
                    </div>

                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-16 h-16 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <p className="text-[#9ca3af] text-xs font-bold uppercase tracking-wider mb-2">Avg. Ticket Size</p>
                        <h3 className="text-3xl font-black text-white">{formatCurrency(kpis.avgTicket)}</h3>
                    </div>

                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-16 h-16 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <p className="text-[#9ca3af] text-xs font-bold uppercase tracking-wider mb-2">Total Repair Jobs</p>
                        <h3 className="text-3xl font-black text-white">{kpis.totalJobs}</h3>
                    </div>

                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-16 h-16 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-[#9ca3af] text-xs font-bold uppercase tracking-wider mb-2">Completed Jobs</p>
                        <h3 className="text-3xl font-black text-white">{kpis.completedJobs}</h3>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    {/* Revenue Trend Line Chart */}
                    <div className="lg:col-span-2 bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Revenue Trend (Last 30 Days)</h3>
                        <div className="h-80 w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                                        <YAxis stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `₱${val/1000}k`} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                        <Line type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No revenue data available for the selected period.</div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method Pie Chart */}
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Revenue by Payment Method</h3>
                        <div className="h-80 w-full flex flex-col justify-center items-center">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No payment data available.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Selling Bar Chart */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-sm mb-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Top Products & Services</h3>
                    <div className="h-96 w-full">
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 11}} width={150} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                        cursor={{ fill: '#1a1a1a' }}
                                    />
                                    <Bar dataKey="Quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No items sold yet.</div>
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}

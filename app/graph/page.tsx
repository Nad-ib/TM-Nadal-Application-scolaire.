"use client";

import { useEffect, useState } from "react";
import { getMonthlyAverages } from "@/Backend/services/branches"; 
import { useProfile } from "@/hooks/useProfile";
import { 
    CartesianGrid, 
    ResponsiveContainer, 
    XAxis, 
    YAxis, 
    Tooltip,
    Area,
    AreaChart,
    Bar,
    BarChart
} from "recharts";
import { BarChart3, ChevronLeft, TrendingUp, Zap, Star } from "lucide-react";
import Link from "next/link";

interface ChartDataPoint {
    name: string;
    avg: number;
}

export default function GraphPage() {
    const { name } = useProfile();
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadGraphData() {
            try {
                const monthlyAvgs = await getMonthlyAverages();
                if (isMounted) {
                    setChartData(monthlyAvgs || []);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des rapports:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadGraphData();
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-50 w-full min-h-screen flex flex-col items-center justify-center p-6 antialiased">
                <div className="w-full max-w-md flex flex-col gap-4 animate-pulse">
                    <div className="h-12 bg-slate-200/80 rounded-2xl w-3/4 mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-slate-200/80 rounded-2xl" />
                        <div className="h-24 bg-slate-200/80 rounded-2xl" />
                    </div>
                    <div className="h-56 bg-slate-200/80 rounded-2xl" />
                    <div className="h-36 bg-slate-200/80 rounded-2xl" />
                    <span className="text-center text-xs font-bold text-slate-400 mt-2 tracking-wide">
                        Génération des rapports tactiques...
                    </span>
                </div>
            </div>
        );
    }

    const validData = chartData.filter(d => d.avg > 0);
    const currentAverage = validData.length > 0 
        ? (validData.reduce((acc, curr) => acc + curr.avg, 0) / validData.length).toFixed(2)
        : "N/A";

    const currentPeriod = new Date().toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric"
    });

    return (
        <div className="bg-slate-50 w-full min-h-screen text-slate-800 select-none antialiased overflow-x-hidden">
            <div className="w-full p-5 flex flex-col gap-4 max-w-md mx-auto pb-12">
                
                <div className="flex items-center justify-between w-full py-4 border-b border-slate-200/60 mb-2">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-500 shadow-xs hover:text-slate-800 active:scale-95 transition-all">
                            <ChevronLeft size={16} strokeWidth={2.5} />
                        </Link>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">Dashboard</span>
                            <h1 className="text-base font-black text-slate-900 tracking-tight -mt-0.5">Analyses Tactiques</h1>
                        </div>
                    </div>
                    
                    <div className="text-[10px] font-black text-slate-600 bg-white border border-slate-200/80 p-2.5 rounded-xl uppercase tracking-wider shadow-xs h-9 flex items-center justify-center">
                        {currentPeriod}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            <TrendingUp size={12} className="text-emerald-500" /> Moyenne d'Effort
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight tabular-nums">
                            {currentAverage} <span className="text-xs font-bold text-slate-400">/ 6.0</span>
                        </p>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            <Zap size={12} className="text-indigo-500" /> Jalons Atteints
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight tabular-nums">
                            {validData.length} <span className="text-xs font-bold text-slate-400">mois</span>
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-emerald-400 via-teal-500 to-indigo-500" />
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                                <BarChart3 size={14} />
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Courbe de Maîtrise</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-sm">Stark Tech</span>
                    </div>

                    <div className="h-44 w-full pt-2 transition-transform duration-300 active:scale-[1.01]">
                        {validData.length === 0 ? (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                Aucune donnée de progression disponible
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={validData} margin={{ top: 5, right: 5, left: -28, bottom: 2 }}>
                                    <defs>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "700" }}
                                        dy={4}
                                    />
                                    <YAxis 
                                        domain={[1, 6]} 
                                        ticks={[1, 2, 3, 4, 5, 6]} 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "700" }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                        labelStyle={{ color: '#64748b', fontSize: '9px', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: '900' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="avg" 
                                        stroke="#10b981" 
                                        strokeWidth={2.5}
                                        fillOpacity={1} 
                                        fill="url(#colorAvg)" 
                                        activeDot={{ r: 5, fill: "#10b981" }}
                                        dot={{ r: 3, fill: "#ffffff", strokeWidth: 2, stroke: "#10b981" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Répartition Énergétique</span>
                        <div className="text-[10px] font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            Volume
                        </div>
                    </div>
                    <div className="h-28 w-full pt-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={validData.slice(-5)} margin={{ top: 0, right: 5, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95}/>
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                                <YAxis hide={true} domain={[0, 6]} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 8 }}
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }}
                                    labelStyle={{ color: '#64748b', fontSize: '9px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#6366f1', fontSize: '11px', fontWeight: '900' }}
                                />
                                <Bar dataKey="avg" fill="url(#colorBar)" radius={[6, 6, 0, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden transition-all active:shadow-sm">
                    <div className="absolute -top-5 -right-5 w-16 h-16 bg-indigo-50/60 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5 relative z-10 flex items-center gap-1.5">
                        <Star size={12} className="text-amber-500" /> Journal de Validation
                    </span>
                    <div className="divide-y divide-slate-100 relative z-10">
                        {validData.slice(-3).reverse().map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1 group/item">
                                <span className="text-xs font-bold text-slate-600 transition-colors group-hover/item:text-indigo-500">{item.name}</span>
                                <span className="text-xs font-black text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md tabular-nums shadow-inner">
                                    {item.avg.toFixed(2)} <span className="text-[10px] font-bold text-slate-300">/ 6.0</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
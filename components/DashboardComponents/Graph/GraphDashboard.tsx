"use client";

import { useEffect, useState } from "react";
import NoteChart from "./Graph";
import { TrendingUp } from "lucide-react";
import { getMonthlyAverages } from "@/Backend/services/branches" 

export default function GraphDashboard() {
    const [chartData, setChartData] = useState<{ name: string; avg: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getMonthlyAverages();
                setChartData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="px-4 py-3 flex flex-col shadow-nadal bg-white w-full h-full justify-between overflow-hidden select-none rounded-xl border border-gray-50">
            <div className="w-full flex items-center gap-2 shrink-0">
                <div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
                    <TrendingUp size={14} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase truncate">
                    Évolution des notes
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 mt-2">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <NoteChart data={chartData} />
                )}
            </div>
        </div>
    );
}
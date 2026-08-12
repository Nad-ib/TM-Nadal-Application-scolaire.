"use client";

import { Target, ArrowUpRight } from "lucide-react";
import CircularProgress from "@/components/DashboardComponents/Stats/CircularProgress";

interface MasteryCardProps {
    xpPercentage: number;
    level: number;
    currentXp: number;
    weeklyGrowth: number;
}

export function MasteryCard({ xpPercentage, level, currentXp, weeklyGrowth }: MasteryCardProps) {
    return (
        <div className="p-5 flex flex-col items-center justify-center shadow-xs bg-white border border-slate-100 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.75 bg-indigo-500" />
            
            <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Target size={12} /> Maîtrise Actuelle
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md flex items-center gap-0.5 border border-emerald-100">
                    <ArrowUpRight size={10} /> {weeklyGrowth >= 0 ? `+${weeklyGrowth}%` : `${weeklyGrowth}%`} cette semaine
                </span>
            </div>

            <div className="flex items-center justify-center relative scale-100 py-2 active:scale-105 transition-transform duration-500 cursor-pointer">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full filter blur-2xl animate-pulse" />
                <CircularProgress
                    percentage={xpPercentage}
                    level={level}
                    size={145}
                    strokeWidth={11}
                    color="#10B981"
                />
            </div>

            <div className="text-center mt-4 w-full bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex justify-between items-center">
                <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Progression</p>
                    <p className="text-xs font-black text-slate-700 tabular-nums">
                        {currentXp % 1000} <span className="text-slate-300 font-medium">/</span> 1000 <span className="text-[10px] font-bold text-emerald-500">XP</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Suivant</p>
                    <p className="text-xs font-black text-slate-600">Niveau {level + 1}</p>
                </div>
            </div>
        </div>
    );
}

export default MasteryCard;
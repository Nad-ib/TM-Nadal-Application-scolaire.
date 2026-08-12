"use client";

import { Flame } from "lucide-react";

interface FocusStreakProps {
    streakCount: number;
    currentWeekHistory: { dayName: string; isCompleted: boolean }[];
}

export default function FocusStreak({ streakCount = 0, currentWeekHistory = [] }: FocusStreakProps) {
    return (
        <div className="flex items-center justify-between bg-white border border-slate-100 p-3.5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] shrink-0 transition-all hover:border-slate-200/60">
            <div className="flex items-center gap-3">
                
                <div className={`p-2.5 rounded-xl border transition-all ${
                    streakCount > 0 
                        ? "bg-amber-50 text-amber-500 border-amber-200/40 shadow-xs" 
                        : "bg-slate-50 text-slate-400 border-slate-100"
                }`}>
                    <Flame size={18} className={streakCount > 0 ? "animate-bounce duration-1000" : ""} />
                </div>
                
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-black text-slate-800 tracking-tight">Série de focus</p>
                    <p className="text-[11px] font-bold text-slate-500">
                        {streakCount} {streakCount > 1 ? "jours consécutifs" : "jour actif"}
                    </p>
                </div>
            </div>

            
            <div className="flex gap-1.5">
                {currentWeekHistory.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <span 
                            className={`w-7 h-7 rounded-xl text-[10px] font-black flex items-center justify-center border transition-all duration-300 ${
                                day.isCompleted 
                                    ? "bg-linear-to-br from-amber-400 to-orange-500 border-amber-500 text-white shadow-xs shadow-orange-500/20 scale-105" 
                                    : "bg-slate-50 border-slate-100/70 text-slate-400"
                            }`}
                        >
                            {day.dayName}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
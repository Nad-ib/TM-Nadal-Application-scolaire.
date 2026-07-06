"use client";

import { Flame } from "lucide-react";

export default function FocusStreak() {
    return (
        <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-2xl shadow-xs shrink-0">
            <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-500 border border-amber-200/30">
                    <Flame size={18} className="animate-pulse" />
                </div>
                <div>
                    <p className="text-xs font-black text-slate-800">Série de focus</p>
                    <p className="text-[10px] font-medium text-slate-400">4 jours consécutifs</p>
                </div>
            </div>
            <div className="flex gap-1">
                {["L", "M", "M", "J"].map((day, idx) => (
                    <span 
                        key={idx} 
                        className={`w-6 h-6 rounded-lg text-[9px] font-black flex items-center justify-center border transition-all ${
                            idx === 3 
                                ? "bg-amber-500 border-amber-600 text-white shadow-2xs" 
                                : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}
                    >
                        {day}
                    </span>
                ))}
            </div>
        </div>
    );
}
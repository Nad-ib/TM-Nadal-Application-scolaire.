"use client";

import { Zap, CheckCircle2 } from "lucide-react";

export default function SpecificObjectives() {
    return (
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3 px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Zap size={12} className="text-indigo-500" /> Objectifs Spécifiques
                </span>
            </div>
            <div className="flex flex-col gap-2.5">
                <div className="p-2.5 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-slate-700 truncate">Session de Focus Quotidienne</p>
                            <span className="text-[9px] font-bold text-slate-400 shrink-0">1 / 2</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: "50%" }} />
                        </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                        <Zap size={14} />
                    </div>
                </div>

                <div className="p-2.5 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between gap-3 opacity-75">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-slate-700 truncate line-through">Explorateur de Modules</p>
                            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
                                <CheckCircle2 size={10} /> Fait
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
                        </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}
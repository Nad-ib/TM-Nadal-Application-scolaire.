"use client";

import { Trophy, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatsHeaderProps {
    name: string | null;
    level: number;
}

export default function StatsHeader({ name, level }: StatsHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between w-full py-4 border-b border-slate-200/60 mb-2 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
                <button 
                    onClick={() => router.back()}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200/70 text-slate-600 flex items-center justify-center shrink-0 active:scale-95 hover:bg-slate-50 transition-all shadow-3xs cursor-pointer"
                    aria-label="Retour"
                >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">Progression</span>
                    <h1 className="text-base font-black text-slate-900 tracking-tight -mt-0.5 truncate">
                        Séquence de {name || "Explorateur"}
                    </h1>
                </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl uppercase tracking-wider shrink-0">
                <Trophy size={11} className="text-indigo-500" /> Niveau {level}
            </div>
        </div>
    );
}
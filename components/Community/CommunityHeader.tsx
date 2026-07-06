"use client";

import { ChevronLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommunityHeaderProps {
    activeCount: number;
}

export default function CommunityHeader({ activeCount }: CommunityHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between w-full py-4 border-b border-slate-200/60 mb-2">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => router.back()} 
                    className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-500 shadow-xs hover:text-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">Réseau</span>
                    <h1 className="text-base font-black text-slate-900 tracking-tight -mt-0.5">Communauté</h1>
                </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                <Users size={12} className="text-indigo-500" /> {activeCount} Actifs
            </div>
        </div>
    );
}
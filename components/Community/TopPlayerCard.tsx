"use client";

import { Trophy, Sparkles } from "lucide-react";
import { getLevelFromXp } from "@/Backend/services/gamification";

interface TopPlayerCardProps {
    topPlayer?: {
        id: string;
        gamertag: string;
        xp: number;
    } | null;
}

export default function TopPlayerCard({ topPlayer }: TopPlayerCardProps) {
    if (!topPlayer) return null;

    return (
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-500 border border-amber-200/30">
                    <Trophy size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        En tête du classement <Sparkles size={10} className="text-amber-500" />
                    </span>
                    <span className="text-sm font-black text-slate-800">{topPlayer.gamertag}</span>
                </div>
            </div>
            <div className="text-right flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Niveau max</span>
                <span className="text-xs font-black text-indigo-500">Niv. {getLevelFromXp(topPlayer.xp)}</span>
            </div>
        </div>
    );
}
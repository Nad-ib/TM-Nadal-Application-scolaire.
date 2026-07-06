"use client";

import { Trophy, Sparkles, Lock } from "lucide-react";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    xp_reward: number;
}

interface UserBadge {
    id: string;
    badge_id: string;
    created_at?: string;
    badges?: {
        name: string;
        description: string;
        icon: string;
    } | null;
}

interface TrophyPavilionProps {
    allBadges: Badge[];
    badgesObtained: UserBadge[];
    completionPercentage: number;
    unlockedCount: number;
    totalBadges: number;
    onSelectBadge: (badge: Badge) => void;
}

export default function TrophyPavilion({
    allBadges,
    badgesObtained,
    completionPercentage,
    unlockedCount,
    totalBadges,
    onSelectBadge,
}: TrophyPavilionProps) {
    return (
        <div className="p-5 flex flex-col bg-white border border-slate-100 rounded-3xl shadow-xs">
            <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Trophy size={13} className="text-amber-500" /> Pavillon des Trophées
                </span>
                
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {completionPercentage}% Collection
                    </span>
                    <span className="text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md tabular-nums">
                        {unlockedCount} <span className="text-slate-300 font-medium">/</span> {totalBadges}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 py-0.5">
                {allBadges.map((badge) => {
                    const isUnlocked = badgesObtained.some((b) => b.badge_id === badge.id);
                    const isLegendary = badge.xp_reward >= 500;

                    const buttonStyle = isUnlocked
                        ? isLegendary
                            ? "bg-amber-50/40 border-amber-200 hover:border-amber-300 shadow-2xs"
                            : "bg-white border-slate-100 hover:border-slate-200 shadow-xs"
                        : "bg-slate-50/50 border-slate-100 text-slate-300";

                    const iconBgStyle = isUnlocked
                        ? isLegendary
                            ? "bg-amber-100/60 text-amber-600 border border-amber-200/40"
                            : "bg-emerald-50 text-emerald-500 border border-emerald-100/50"
                        : "bg-slate-100/80 text-slate-400 grayscale contrast-75";

                    return (
                        <button
                            key={badge.id}
                            onClick={() => onSelectBadge(badge)}
                            className={`flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-300 outline-none h-28 relative active:scale-95 cursor-pointer group ${buttonStyle}`}
                        >
                            {isUnlocked ? (
                                isLegendary ? (
                                    <span className="absolute top-2 right-2 text-amber-500 drop-shadow-xs animate-pulse">
                                        <Sparkles size={10} />
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                )
                            ) : (
                                <span className="absolute top-2 right-2 text-slate-300">
                                    <Lock size={10} strokeWidth={2.5} />
                                </span>
                            )}

                            <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner ${iconBgStyle}`}>
                                {badge.icon || "🏅"}
                            </div>

                            <div className="w-full text-center mt-1">
                                <p className={`text-[10px] font-black truncate tracking-tight px-0.5 ${isUnlocked ? "text-slate-700" : "text-slate-400 font-bold"}`}>
                                    {badge.name}
                                </p>
                                <p className="text-[7.5px] font-bold text-slate-400/80 uppercase tracking-widest mt-0.5">
                                    +{badge.xp_reward} XP
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
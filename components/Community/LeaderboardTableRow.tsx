"use client";

import { getLevelFromXp } from "@/Backend/services/gamification";

interface LeaderboardTableRowProps {
    user: {
        id: string;
        gamertag: string;
        xp: number;
    };
    index: number;
    isMe: boolean;
}

export default function LeaderboardTableRow({ user, index, isMe }: LeaderboardTableRowProps) {
    const rank = index + 1;
    const userLevel = getLevelFromXp(user.xp);

    const rankStyle =
        rank === 1
            ? "bg-amber-50 text-amber-600 border border-amber-200/50 font-black"
            : rank === 2
                ? "bg-slate-100 text-slate-600 border border-slate-200/60 font-black"
                : rank === 3
                    ? "bg-orange-50 text-orange-600 border border-orange-200/40 font-black"
                    : "text-slate-400 bg-slate-50/50 font-bold";

    return (
        <div className={`flex items-center py-2.5 px-1 text-sm group/row transition-all ${
            isMe
                ? "bg-indigo-50/40 border border-indigo-100/60 rounded-xl my-1 px-2 text-indigo-900"
                : "hover:bg-slate-50/50 rounded-xl"
        }`}>
            <div className="w-10 flex items-center">
                <span className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] tabular-nums tracking-tighter ${rankStyle}`}>
                    {rank}
                </span>
            </div>

            <div className={`flex-1 truncate pr-2 font-bold transition-colors ${isMe ? 'text-indigo-600' : 'text-slate-700 group-hover/row:text-slate-900'}`}>
                {user.gamertag || "Anonyme"}{" "}
                {isMe && (
                    <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-md ml-1 font-black uppercase tracking-widest shadow-2xs">
                        Moi
                    </span>
                )}
            </div>

            <div className="w-14 text-right font-black text-slate-500 text-xs tabular-nums">
                {userLevel}
            </div>

            <div className={`w-20 text-right font-black text-xs tabular-nums ${isMe ? 'text-indigo-600' : 'text-slate-700'}`}>
                {user.xp.toLocaleString()}
            </div>
        </div>
    );
}
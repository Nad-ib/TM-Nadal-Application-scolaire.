"use client";

import { ShieldAlert } from "lucide-react";
import LeaderboardTableRow from "./LeaderboardTableRow";

interface LeaderboardUser {
    id: string;
    gamertag: string;
    xp: number;
}

interface LeaderboardTableProps {
    leaderboard: LeaderboardUser[];
    currentUserId: string | null;
}

export default function LeaderboardTable({ leaderboard, currentUserId }: LeaderboardTableProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-4 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-0.75 bg-indigo-500" />
            
            <div className="flex text-[10px] font-black uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100 px-1 mb-1">
                <span className="w-10">Rang</span>
                <span className="flex-1">Membre</span>
                <span className="w-14 text-right">Niveau</span>
                <span className="w-20 text-right">XP Totale</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[calc(100vh-290px)] overflow-y-auto pr-0.5">
                {leaderboard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                        <ShieldAlert size={24} className="text-slate-300" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Aucun utilisateur enregistré</span>
                    </div>
                ) : (
                    leaderboard.map((user, index) => (
                        <LeaderboardTableRow
                            key={user.id}
                            user={user}
                            index={index}
                            isMe={user.id === currentUserId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
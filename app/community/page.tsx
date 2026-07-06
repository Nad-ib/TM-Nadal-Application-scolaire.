"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/Backend/services/gamification";
import { supabase } from "@/Backend/lib/supabase";
import CommunityHeader from "@/components/Community/CommunityHeader";
import TopPlayerCard from "@/components/Community/TopPlayerCard";
import LeaderboardTable from "@/components/Community/LeaderboardTable";

interface LeaderboardUser {
    id: string;
    gamertag: string;
    xp: number;
}

export default function Community() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                
                if (isMounted && user) {
                    setCurrentUserId(user.id);
                }
                
                const data = await getLeaderboard();
                
                if (isMounted) {
                    setLeaderboard(data || []);
                }
            } catch (error) {
                console.error("Erreur chargement classement:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-50 w-full min-h-screen flex flex-col items-center justify-center p-6 antialiased">
                <div className="w-full max-w-md flex flex-col gap-4 animate-pulse">
                    <div className="h-12 bg-slate-200/80 rounded-2xl w-3/4 mb-4" />
                    <div className="h-16 bg-slate-200/80 rounded-2xl w-full" />
                    <div className="h-100 bg-slate-200/80 rounded-2xl w-full" />
                </div>
            </div>
        );
    }

    const topPlayer = leaderboard[0];

    return (
        <div className="bg-slate-50 w-full min-h-screen text-slate-800 select-none antialiased overflow-x-hidden">
            <div className="w-full p-5 flex flex-col gap-4 max-w-md mx-auto pb-12">
                <CommunityHeader activeCount={leaderboard.length} />
                <TopPlayerCard topPlayer={topPlayer} />
                <LeaderboardTable leaderboard={leaderboard} currentUserId={currentUserId} />
            </div>
        </div>
    );
}
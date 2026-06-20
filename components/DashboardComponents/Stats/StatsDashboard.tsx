"use client";

import { supabase } from "@/Backend/lib/supabase";
import { getUserGamification, getXpPercentage, getLevelFromXp } from "@/Backend/services/gamification";
import CircularProgress from "./CircularProgress";
import { useEffect, useState } from "react";
import { Award } from "lucide-react";

interface GamificationStats {
    xp: number;
}

export default function StatsDashboard() {
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserStats() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;

                if (user) {
                    const userStats = await getUserGamification(user.id);
                    setStats(userStats);
                }
            } catch (error) {
                console.error("Erreur stats:", error);
            } finally {
                setLoading(false);
            }
        }
        loadUserStats();
    }, []);

    const currentLevel = getLevelFromXp(stats?.xp ?? 0) ?? 1;
    const xpPercentage = stats ? getXpPercentage(stats.xp) : 0;

    return (
        <div className="px-3 py-2 flex flex-col shadow-nadal bg-white rounded-xl border border-gray-50 h-full justify-between overflow-hidden select-none">
            <div className="w-full flex items-center gap-2 shrink-0">
                <div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
                    <Award size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase truncate">
                    Progression
                </span>
            </div>

            <div className="flex items-center justify-center flex-1 mt-1 w-full min-h-0">
                {loading ? (
                    <div className="text-gray-400 text-[10px] font-medium animate-pulse">
                        Chargement...
                    </div>
                ) : (
                    <div className="flex items-center justify-center scale-110">
                        <CircularProgress 
                            percentage={xpPercentage} 
                            level={currentLevel} 
                            size={58} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
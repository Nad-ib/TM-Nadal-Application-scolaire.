"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import {
    getFullGamificationDashboard,
    getLevelFromXp,
    getXpPercentage,
} from "@/Backend/services/gamification";
import { useProfile } from "@/hooks/useProfile";

import StatsHeader from "@/components/Stats/StatsHeader";
import FocusStreak from "@/components/Stats/FocusStreak";
import MasteryCard from "@/components/Stats/MasteryCard";
import SpecificObjectives from "@/components/Stats/SpecificObjectives";
import DivisionCard from "@/components/Stats/DivisionCard";
import TrophyPavilion from "@/components/Stats/TrophyPavilion";
import BadgeDetailModal from "@/components/Stats/BadgeDetailModal";

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

interface GamificationData {
    stats: { xp: number };
    badgesObtained: UserBadge[];
    allBadges: Badge[];
}

export default function Stats() {
    const { name } = useProfile();
    const [gamiData, setGamiData] = useState<GamificationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadGamification() {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (user) {
                    const data = await getFullGamificationDashboard(user.id);
                    if (isMounted) setGamiData(data);
                }
            } catch (error) {
                console.error("Erreur chargement gamification:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadGamification();
        return () => { isMounted = false; };
    }, []);

    const currentXp = gamiData?.stats?.xp ?? 0;
    const level = getLevelFromXp(currentXp);
    const xpPercentage = getXpPercentage(currentXp);
    
    const totalBadges = gamiData?.allBadges.length ?? 0;
    const unlockedCount = gamiData?.badgesObtained.length ?? 0;
    const completionPercentage = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

    if (loading) {
        return (
            <div className="bg-slate-50 w-full min-h-screen flex flex-col items-center justify-center p-6 antialiased">
                <div className="w-full max-w-md flex flex-col gap-4 animate-pulse">
                    <div className="h-12 bg-slate-200/80 rounded-2xl w-3/4 mb-4" />
                    <div className="h-16 bg-slate-200/80 rounded-2xl w-full" />
                    <div className="h-60 bg-slate-200/80 rounded-2xl w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 w-full min-h-screen text-slate-800 select-none antialiased overflow-x-hidden relative overflow-y-auto scrollbar-none">
            <div className="w-full p-5 flex flex-col gap-4 max-w-md mx-auto relative z-10 pb-24">
                
                <StatsHeader name={name} level={level} />

                <FocusStreak />

                <MasteryCard xpPercentage={xpPercentage} level={level} currentXp={currentXp} />

                <SpecificObjectives />

                <DivisionCard />

                <TrophyPavilion 
                    allBadges={gamiData?.allBadges ?? []}
                    badgesObtained={gamiData?.badgesObtained ?? []}
                    completionPercentage={completionPercentage}
                    unlockedCount={unlockedCount}
                    totalBadges={totalBadges}
                    onSelectBadge={setSelectedBadge}
                />
            </div>

            {selectedBadge && (
                <BadgeDetailModal 
                    selectedBadge={selectedBadge} 
                    onClose={() => setSelectedBadge(null)} 
                />
            )}
        </div>
    );
}
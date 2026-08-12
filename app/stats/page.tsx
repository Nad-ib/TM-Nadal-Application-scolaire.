"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import {
    getFullGamificationDashboard,
    getLevelFromXp,
    getXpPercentage,
} from "@/Backend/services/gamification";
import { getUserObjectives, syncStreakObjective } from "@/Backend/services/objectives";
import { useProfile } from "@/hooks/useProfile";

import StatsHeader from "@/components/Stats/StatsHeader";
import FocusStreak from "@/components/Stats/FocusStreak";
import { MasteryCard } from "@/components/Stats/MasteryCard";
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

interface Objective {
    id: string;
    title: string;
    current_value: number;
    target_value: number;
    xp_reward: number;
    league_points_reward: number;
    is_completed: boolean;
}

interface GamificationData {
    stats: {
        xp: number;
        streak_count?: number;
        week_history?: { dayName: string; isCompleted: boolean }[];
        weekly_growth?: number;
    };
    badgesObtained: UserBadge[];
    allBadges: Badge[];
}

export default function Stats() {
    const { name } = useProfile();
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [gamiData, setGamiData] = useState<GamificationData | null>(null);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const loadData = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                await syncStreakObjective(user.id);
                const [dashboardData, objectivesData] = await Promise.all([
                    getFullGamificationDashboard(user.id),
                    getUserObjectives(user.id),
                ]);

                setGamiData(dashboardData);
                setObjectives(objectivesData as Objective[]);
            }
        } catch (error) {
            console.error("Erreur chargement données globales:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const currentXp = gamiData?.stats?.xp ?? 0;
    const level = getLevelFromXp(currentXp);
    const xpPercentage = getXpPercentage(currentXp);
    const weeklyGrowth = gamiData?.stats?.weekly_growth ?? 0;

    const streakCount = gamiData?.stats?.streak_count ?? 0;
    const defaultWeek = [
        { dayName: "L", isCompleted: false },
        { dayName: "M", isCompleted: false },
        { dayName: "M", isCompleted: false },
        { dayName: "J", isCompleted: false },
        { dayName: "V", isCompleted: false },
    ];
    const currentWeekHistory = gamiData?.stats?.week_history ?? defaultWeek;

    const totalBadges = gamiData?.allBadges.length ?? 0;
    const unlockedCount = gamiData?.badgesObtained.length ?? 0;
    const completionPercentage =
        totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

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
                <FocusStreak
                    streakCount={streakCount}
                    currentWeekHistory={currentWeekHistory}
                />
                <MasteryCard
                    xpPercentage={xpPercentage}
                    level={level}
                    currentXp={currentXp}
                    weeklyGrowth={weeklyGrowth}
                />
                <SpecificObjectives
                    userId={userId}
                    objectives={objectives}
                    onRefresh={loadData}
                />
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
"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/Backend/lib/supabase";
import { syncLevelUpAccountObjective } from "@/Backend/services/objectives";
import {
    Award,
    ChevronRight,
    Sparkles,
    Shield,
    Flame,
    Trophy,
    ArrowUpRight,
    Crown,
} from "lucide-react";

export type LeagueType =
    | "bronze"
    | "argent"
    | "or"
    | "diamant"
    | "master"
    | "immortel";

interface DivisionCardProps {
    onClick?: () => void;
}

const LEAGUES_ORDER: { key: LeagueType; name: string; minPoints: number; maxPoints: number; nextLeague: string }[] = [
    { key: "bronze", name: "Bronze", minPoints: 0, maxPoints: 500, nextLeague: "Argent" },
    { key: "argent", name: "Argent", minPoints: 500, maxPoints: 1200, nextLeague: "Or" },
    { key: "or", name: "Or", minPoints: 1200, maxPoints: 2500, nextLeague: "Diamant" },
    { key: "diamant", name: "Diamant", minPoints: 2500, maxPoints: 5000, nextLeague: "Master" },
    { key: "master", name: "Master", minPoints: 5000, maxPoints: 10000, nextLeague: "Immortel" },
    { key: "immortel", name: "Top 10 Mondial", minPoints: 10000, maxPoints: 10000, nextLeague: "Légende" },
];

const LEAGUE_CONFIGS = {
    bronze: {
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
        iconColor: "text-amber-700",
        iconBg: "bg-amber-50 border-amber-200",
        barColor: "bg-amber-600",
    },
    argent: {
        badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
        iconColor: "text-slate-600",
        iconBg: "bg-slate-50 border-slate-200",
        barColor: "bg-slate-500",
    },
    or: {
        badgeBg: "bg-yellow-100 text-yellow-900 border-yellow-200",
        iconColor: "text-yellow-600",
        iconBg: "bg-yellow-50 border-yellow-200",
        barColor: "bg-yellow-500",
    },
    diamant: {
        badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-200",
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-50 border-indigo-200",
        barColor: "bg-indigo-600",
    },
    master: {
        badgeBg: "bg-rose-100 text-rose-900 border-rose-200",
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 border-rose-200",
        barColor: "bg-rose-600",
    },
    immortel: {
        badgeBg: "bg-neutral-900 text-yellow-400 border-neutral-800 font-black tracking-tight",
        iconColor: "text-yellow-500",
        iconBg: "bg-neutral-900 border-neutral-800",
        barColor: "bg-yellow-500",
    },
};

const LEAGUE_ICONS = {
    bronze: Shield,
    argent: Award,
    or: Trophy,
    diamant: Sparkles,
    master: Flame,
    immortel: Crown,
};

function getLeagueFromPoints(pts: number) {
    for (let i = LEAGUES_ORDER.length - 1; i >= 0; i--) {
        if (pts >= LEAGUES_ORDER[i].minPoints) {
            return LEAGUES_ORDER[i];
        }
    }
    return LEAGUES_ORDER[0];
}

export default function DivisionCard({ onClick }: DivisionCardProps) {
    const [leagueInfo, setLeagueInfo] = useState(LEAGUES_ORDER[0]);
    const [progress, setProgress] = useState<number>(0);
    const [pointsToNext, setPointsToNext] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const prevPointsRef = useRef<number | null>(null);

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const loadProfile = async () => {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("league_points")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    const currentPoints = profile.league_points || 0;
                    const currentLeague = getLeagueFromPoints(currentPoints);

                    if (prevPointsRef.current !== null) {
                        const previousLeague = getLeagueFromPoints(prevPointsRef.current);
                        if (currentLeague.minPoints > previousLeague.minPoints) {
                            await syncLevelUpAccountObjective(user.id, true);
                        }
                    }
                    prevPointsRef.current = currentPoints;

                    let calcProgress = 100;
                    let calcRemaining = 0;

                    if (currentLeague.key !== "immortel") {
                        const pointsInCurrentLevel = currentPoints - currentLeague.minPoints;
                        const levelRange = currentLeague.maxPoints - currentLeague.minPoints;
                        calcProgress = Math.min(
                            Math.round((pointsInCurrentLevel / levelRange) * 100),
                            100
                        );
                        calcRemaining = Math.max(currentLeague.maxPoints - currentPoints, 0);
                    }

                    setLeagueInfo(currentLeague);
                    setProgress(calcProgress);
                    setPointsToNext(calcRemaining);
                }
                setLoading(false);
            };

            await loadProfile();

            const channelName = `profile-updates-${user.id}-${Math.random().toString(36).substring(2, 9)}`;

            channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "profiles",
                        filter: `id=eq.${user.id}`,
                    },
                    () => {
                        loadProfile();
                    }
                )
                .subscribe();
        };

        fetchUserData();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    const config = LEAGUE_CONFIGS[leagueInfo.key];
    const IconComponent = LEAGUE_ICONS[leagueInfo.key] || Shield;
    const isImmortel = leagueInfo.key === "immortel";

    if (loading) {
        return (
            <div className="w-full p-4 rounded-2xl bg-white border border-slate-200 animate-pulse h-28 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`w-full text-left p-4 rounded-2xl flex flex-col gap-4 transition-all outline-none border ${
                isImmortel
                    ? "bg-neutral-950 border-neutral-800 shadow-xl shadow-yellow-500/5 relative"
                    : "bg-white border-slate-200"
            } ${
                onClick
                    ? isImmortel
                        ? "hover:bg-neutral-900 active:scale-[0.99] cursor-pointer"
                        : "hover:bg-slate-50/50 active:scale-[0.99] cursor-pointer"
                    : "cursor-default"
            }`}>
            {isImmortel && (
                <div className="absolute top-0 right-12 w-24 h-px bg-linear-to-r from-transparent via-yellow-500/30 to-transparent" />
            )}

            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}>
                        <IconComponent
                            size={18}
                            strokeWidth={2.5}
                            className={isImmortel ? "animate-pulse" : ""}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p
                            className={`text-xs font-medium uppercase tracking-wider leading-none mb-1 ${
                                isImmortel ? "text-yellow-500/70" : "text-slate-400"
                            }`}>
                            {isImmortel ? "Élite Absolue" : "Ligue Actuelle"}
                        </p>
                        <p
                            className={`text-base font-extrabold tracking-tight leading-none ${
                                isImmortel ? "text-white" : "text-slate-900"
                            }`}>
                            {leagueInfo.name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-tight tabular-nums ${config.badgeBg}`}>
                            Classé
                        </span>
                    </div>
                    {onClick && (
                        <ChevronRight
                            size={14}
                            className={
                                isImmortel
                                    ? "text-neutral-600 shrink-0"
                                    : "text-slate-400 shrink-0"
                            }
                            strokeWidth={2.5}
                        />
                    )}
                </div>
            </div>

            <div className="w-full space-y-1.5">
                <div
                    className={`w-full h-2 rounded-full overflow-hidden border ${
                        isImmortel
                            ? "bg-neutral-900 border-neutral-800"
                            : "bg-slate-100 border-slate-200/40"
                    }`}>
                    <div
                        className={`h-full ${config.barColor} transition-all duration-500 rounded-full ${
                            isImmortel ? "shadow-sm shadow-yellow-500/50" : ""
                        }`}
                        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold tracking-wide uppercase">
                    <span className={isImmortel ? "text-neutral-500" : "text-slate-400"}>
                        {isImmortel ? "Stabilité du Rang" : `${progress}% complété`}
                    </span>
                    <span
                        className={`flex items-center gap-0.5 ${
                            isImmortel ? "text-yellow-500" : "text-slate-500"
                        }`}>
                        {isImmortel
                            ? `${pointsToNext} pts de marge`
                            : `${pointsToNext} pts avant ${leagueInfo.nextLeague}`}
                        {!isImmortel && (
                            <ArrowUpRight
                                size={10}
                                strokeWidth={3}
                                className="text-slate-400"
                            />
                        )}
                    </span>
                </div>
            </div>
        </button>
    );
}
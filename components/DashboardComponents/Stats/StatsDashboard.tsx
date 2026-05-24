"use client";
import { supabase } from "@/Backend/lib/supabase";
import { getUserGamification, getXpPercentage, getLevelFromXp } from "@/Backend/services/gamification";

import CircularProgress from "./CircularProgress";
import { useEffect, useState } from "react";

interface GamificationStats {
	xp: number;
}

export default function StatsDashboard() {
	const [stats, setStats] = useState<GamificationStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUserStats() {
			try {
				const {data: {user}, error: authError} = await supabase.auth.getUser();

				if (authError) throw authError;

				if (user) {
					const userStats = await getUserGamification(user.id)
					setStats(userStats)
				}
			} catch(error) {
				console.error("Erreur lors de la récupération des stats:", error);
			} finally {
				setLoading(false)
			}
		}
		loadUserStats();
	}, []);

	const xpPercentage = stats ? getXpPercentage(stats.xp) : 0;

	if (loading) {
		return <div className="p-4 bg-white rounded-lg shadow animate-pulse">Chargement...</div>;
	}

	return (
		<div className="px-2 py-1 flex flex-col shadow-nadal bg-white rounded-lg h-full">
			<div className="w-full">Stats</div>

			<div className="flex flex-col flex-1">
				<div className="second-font px-1 leading-none -mt-1">
					LVL : <span className="text-blue-500 font-black">{getLevelFromXp(stats?.xp ?? 0) ?? 1}</span>
				</div>

				<div className="flex items-center justify-center flex-1 -mt-2">
					<CircularProgress percentage={xpPercentage} level={getLevelFromXp(stats?.xp ?? 0) ?? 1} size={55} />
				</div>

				<div className="second-font h-1/3">
					<div>insignes :</div>
					<div className="flex gap-2"></div>
				</div>
			</div>
		</div>
	);
}

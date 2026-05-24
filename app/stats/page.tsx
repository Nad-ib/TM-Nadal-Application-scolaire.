"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import {
	getFullGamificationDashboard,
	getLevelFromXp,
	getXpPercentage,
} from "@/Backend/services/gamification";
import { useProfile } from "@/hooks/useProfile";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import CircularProgress from "@/components/DashboardComponents/Stats/CircularProgress";

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

	useEffect(() => {
		async function loadGamification() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) {
					const data = await getFullGamificationDashboard(user.id);
					setGamiData(data);
				}
			} catch (error) {
				console.error("Erreur chargement gamification:", error);
			} finally {
				setLoading(false);
			}
		}
		loadGamification();
	}, []);

	const currentXp = gamiData?.stats?.xp ?? 0;
	const level = getLevelFromXp(currentXp);
	const xpPercentage = getXpPercentage(currentXp);

	if (loading) {
		return (
			<div className="bg-gray-50 w-screen h-dvh flex items-center justify-center font-bold text-gray-400 animate-pulse">
				Chargement de vos succès...
			</div>
		);
	}

	return (
		<div className="bg-gray-50 w-screen h-dvh text-gray-800">
			<div className="w-full h-full p-6 flex flex-col gap-6">
				<HeadInfos name={name} />

				<div className="grid grid-cols-1 grid-rows-3 gap-4 flex-1">
					<div className="p-6 flex flex-col items-center justify-center shadow-sm bg-white border border-gray-100 rounded-2xl row-span-2">
						<div className="w-full text-left text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
							Progression globale
						</div>

						<div className="flex-1 flex items-center justify-center scale-125">
							<CircularProgress
								percentage={xpPercentage}
								level={level}
								size={140}
								strokeWidth={10}
								color="#22C55E"
							/>
						</div>

						<div className="text-center mt-4">
							<p className="text-xs font-semibold text-gray-400">
								{currentXp % 1000} / 1000 XP
							</p>
							<p className="text-[10px] font-medium text-gray-400 tracking-wide uppercase mt-0.5">
								Niveau suivant
							</p>
						</div>
					</div>

					<div className="p-4 flex flex-col shadow-sm bg-white border border-gray-100 rounded-2xl row-span-1">
						<div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
							Insignes ({gamiData?.badgesObtained.length ?? 0})
						</div>

						<div className="grid grid-cols-4 gap-3 overflow-y-auto flex-1 py-1">
							{gamiData?.allBadges.map((badge) => {
								const isUnlocked = gamiData.badgesObtained.some(
									(b) => b.badge_id === badge.id,
								);

								return (
									<div
										key={badge.id}
										className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
											isUnlocked
												? "bg-white border-green-100 shadow-sm opacity-100 scale-100"
												: "bg-gray-50/50 border-gray-100 opacity-40 grayscale"
										}`}>
										<div
											className={`text-2xl mb-1 p-1.5 rounded-lg ${isUnlocked ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"}`}>
											{badge.icon || "🏅"}
										</div>

										<span className="text-[9px] font-bold text-gray-600 text-center truncate w-full leading-tight">
											{badge.name}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

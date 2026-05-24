"use client";

import { useEffect, useState } from "react";
import {
	getLeaderboard,
	getLevelFromXp,
} from "@/Backend/services/gamification";
import { supabase } from "@/Backend/lib/supabase";

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
		async function loadData() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) setCurrentUserId(user.id);
				const data = await getLeaderboard();
				setLeaderboard(data);
			} catch (error) {
				console.error("Erreur chargement classement:", error);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	if (loading) {
		return (
			<div className="bg-gray-50 w-screen h-dvh flex items-center justify-center font-bold text-gray-400 animate-pulse">
				Chargement du classement...
			</div>
		);
	}

	return (
		<div className="bg-gray-50 w-screen h-dvh text-gray-800">
			<div className="w-full h-full p-6 flex flex-col gap-4 max-w-md mx-auto">
				<div className="flex flex-col mt-4">
					<h1 className="text-2xl font-black tracking-tight">Communauté</h1>
					<p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
						Les meilleurs développeurs
					</p>
				</div>

				<div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col overflow-hidden">
					<div className="flex text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-50 px-2">
						<span className="w-10">Rang</span>
						<span className="flex-1">Joueur</span>
						<span className="w-16 text-right">Niveau</span>
						<span className="w-16 text-right">XP Totale</span>
					</div>

					<div className="flex-1 overflow-y-auto divide-y divide-gray-50/50">
						{leaderboard.map((user, index) => {
							const rank = index + 1;
							const isMe = user.id === currentUserId;
							const userLevel = getLevelFromXp(user.xp);

							const rankColor =
								rank === 1
									? "bg-amber-100 text-amber-700 font-black"
									: rank === 2
										? "bg-slate-100 text-slate-600 font-black"
										: rank === 3
											? "bg-orange-100 text-orange-700 font-black"
											: "text-gray-400 font-medium";

							return (
								<div
									key={user.id}
									className={`flex items-center py-3 px-2 text-sm transition-all ${
										isMe
											? "bg-green-50/60 rounded-xl font-semibold text-green-700"
											: ""
									}`}>
									<div className="w-10 flex items-center">
										<span
											className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${rankColor}`}>
											{rank}
										</span>
									</div>

									<div className="flex-1 truncate pr-2 font-medium">
										{user.gamertag}{" "}
										{isMe && (
											<span className="text-[10px] bg-green-200/50 px-1.5 py-0.5 rounded-md ml-1 font-bold">
												Moi
											</span>
										)}
									</div>

									<div className="w-16 text-right font-bold text-gray-500 text-xs">
										Nvl {userLevel}
									</div>
									<div className="w-16 text-right font-semibold text-gray-700 tabular-nums">
										{user.xp.toLocaleString()}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

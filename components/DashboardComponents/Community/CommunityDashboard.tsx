"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "@/Backend/services/gamification";

interface TopUser {
	id: string;
	name: string;
	points: string;
	border: string;
	rank: number;
	size: string;
}

export default function CommunityDashboard() {
	const [topUsers, setTopUsers] = useState<TopUser[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchTopThree() {
			try {
				const data = await getLeaderboard();
				const rawTopThree = data.slice(0, 3);
				const formattedUsers = rawTopThree.map((user, index) => {
					const rank = index + 1;

					const pointsFormatted =
						user.xp >= 1000 ? `${(user.xp / 1000).toFixed(1)}k` : `${user.xp}`;

					let border = "border-slate-300 ring-slate-100/50";
					let size = "w-8 h-8 text-xs";

					if (rank === 1) {
						border = "border-amber-400 ring-amber-100/50";
						size = "w-10 h-10 text-sm";
					} else if (rank === 3) {
						border = "border-orange-400 ring-orange-100/50";
						size = "w-7 h-7 text-[11px]";
					}

					return {
						id: user.id,
						name: user.gamertag || "Anonyme",
						points: pointsFormatted,
						border,
						rank,
						size,
					};
				});

				const poduimOrdered = [];
				if (formattedUsers[1]) poduimOrdered.push(formattedUsers[1]); 
				if (formattedUsers[0]) poduimOrdered.push(formattedUsers[0]); 
				if (formattedUsers[2]) poduimOrdered.push(formattedUsers[2]); 

				setTopUsers(poduimOrdered.length > 0 ? poduimOrdered : formattedUsers);
			} catch (error) {
				console.error("Erreur chargement top 3 dashboard:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchTopThree();
	}, []);

	if (loading) {
		return (
			<div className="px-3 py-2.5 flex items-center justify-center bg-white w-full h-full rounded-xl border border-gray-50 text-[10px] font-bold text-gray-400 animate-pulse">
				Synchro...
			</div>
		);
	}

	return (
		<div className="px-3 py-2.5 flex flex-col shadow-nadal bg-white w-full h-full justify-between overflow-hidden select-none rounded-xl border border-gray-50">
			<div className="w-full flex items-center gap-2 shrink-0">
				<div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
					<Trophy size={14} />
				</div>
				<span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase truncate">
					Leaderboard
				</span>
			</div>

			<div className="flex items-center justify-between gap-1 flex-1 mt-2 w-full min-h-0 pb-1">
				{topUsers.map((user) => (
					<div
						key={user.id}
						className="flex flex-col items-center min-w-0 flex-1 justify-center">
						<div
							className={`relative ${user.size} rounded-full bg-[#43467F] text-white font-bold flex items-center justify-center border-2 shadow-sm ring-2 ${user.border} shrink-0`}>
							{user.name[0]?.toUpperCase()}

							<span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[9px] font-black text-gray-700 shadow-sm">
								{user.rank}
							</span>
						</div>

						<span className="text-[10px] font-medium text-gray-600 truncate w-full text-center mt-1 px-0.5 leading-none">
							{user.name}
						</span>

						<span className="text-[9px] font-bold text-indigo-600 mt-0.5 leading-none">
							{user.points}
						</span>
					</div>
				))}

				{topUsers.length === 0 && (
					<span className="text-[10px] text-gray-400 w-full text-center py-2">
						Aucun joueur
					</span>
				)}
			</div>
		</div>
	);
}

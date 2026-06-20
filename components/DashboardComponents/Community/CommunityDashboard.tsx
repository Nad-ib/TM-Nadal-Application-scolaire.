"use client";

import { Trophy } from "lucide-react";

export default function CommunityDashboard() {
	const topUsers = [
		{
			id: 2,
			name: "Sarah",
			points: "4.1k",
			border: "border-slate-300 ring-slate-100/50",
			rank: 2,
			size: "w-8 h-8",
		},
		{
			id: 1,
			name: "Alexandre",
			points: "4.8k",
			border: "border-amber-400 ring-amber-100/50",
			rank: 1,
			size: "w-10 h-10 text-sm",
		},
		{
			id: 3,
			name: "Lucas",
			points: "3.9k",
			border: "border-orange-400 ring-orange-100/50",
			rank: 3,
			size: "w-7 h-7 text-[11px]",
		},
	];

	return (
		<div className="px-3 py-2 flex flex-col shadow-nadal bg-white col-span-2 rounded-xl border border-gray-50 h-full justify-between overflow-hidden select-none">
			<div className="w-full flex items-center gap-2 shrink-0">
				<div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
					<Trophy size={16} />
				</div>
				<span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase truncate">
					Leaderboard
				</span>
			</div>

			<div className="flex items-center justify-between gap-1 flex-1 mt-1 w-full min-h-0 pb-1">
				{topUsers.map((user) => (
					<div
						key={user.id}
						className="flex flex-col items-center min-w-0 flex-1 justify-end">
						<div
							className={`relative ${user.size} rounded-full bg-[#43467F] text-white font-bold flex items-center justify-center border-2 shadow-sm ring-2 ${user.border} shrink-0`}>
							{user.name[0]}

							<span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[9px] font-black text-gray-700 shadow-sm">
								{user.rank}
							</span>
						</div>

						<span className="text-[10px] font-semibold text-gray-600 truncate w-full text-center mt-1 px-0.5 leading-none">
							{user.name}
						</span>

						<span className="text-[9px] font-bold text-indigo-600 mt-0.5 leading-none">
							{user.points}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

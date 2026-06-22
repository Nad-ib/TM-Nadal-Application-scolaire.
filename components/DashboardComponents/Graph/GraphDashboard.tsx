"use client";

import NoteChart from "./Graph";
import { TrendingUp } from "lucide-react";

export default function GraphDashboard() {
	return (
		<div className="px-4 py-3 flex flex-col shadow-nadal bg-white w-full h-full justify-between overflow-hidden select-none rounded-xl border border-gray-50">
			<div className="w-full flex items-center gap-2 shrink-0">
				<div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
					<TrendingUp size={14} />
				</div>
				<span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase truncate">
					Évolution des notes
				</span>
			</div>
			<div className="w-full flex-1 min-h-0 mt-2">
				<NoteChart />
			</div>
		</div>
	);
}

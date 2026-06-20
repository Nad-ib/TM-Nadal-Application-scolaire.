"use client";

import TrueButton from "./TrueButton";
import FalseButton from "./FalseButton";
import { BookOpen } from "lucide-react";

const BILAN_ITEMS = [
	{ type: "true", label: "Moyenne générale", value: "4" },
	{ type: "true", label: "Notes insuffisantes (max 4)", value: "3" },
	{
		type: "false",
		label: "Total 1er groupe (min 16)",
		value: "15",
		highlight: true,
	},
	{ type: "true", label: "Total (min 48 pts)", value: "53" },
];

export default function BilanDashboard() {
	return (
		<div className="px-2.5 py-2 flex flex-col shadow-nadal bg-white col-span-3 rounded-xl border border-gray-50 h-full justify-between overflow-hidden select-none">
			<div className="w-full flex items-center gap-1.5 shrink-0">
				<div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
					<BookOpen size={14} />
				</div>
				<span className="text-[10px] font-bold text-gray-800 tracking-wide uppercase truncate">
					Bilan annuel
				</span>
			</div>

			<div className="flex flex-col gap-1 flex-1 justify-end mt-1.5 w-full min-h-0">
				{BILAN_ITEMS.map((item, idx) => (
					<div
						key={idx}
						className="w-full h-6 flex justify-between items-center bg-gray-50/50 border border-gray-100/30 px-1.5 rounded-lg shrink-0">
						<div className="flex items-center gap-1.5 min-w-0">
							<div className="shrink-0 scale-75 origin-left">
								{item.type === "true" ? <TrueButton /> : <FalseButton />}
							</div>
							<span className="text-[12px] font-bold text-gray-600 truncate">
								{item.label}
							</span>
						</div>
						<span
							className={`text-[12px] font-extrabold px-1 py-0.5 rounded shrink-0 leading-none ${
								item.highlight
									? "bg-red-50 text-red-600 border border-red-100"
									: "text-gray-700"
							}`}>
							{item.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

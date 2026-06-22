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
		<div className="px-2.5 py-3 flex flex-col shadow-nadal bg-white w-full h-auto justify-start overflow-hidden select-none rounded-xl border border-gray-50">
			<div className="w-full flex items-center gap-1.5 shrink-0">
				<div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
					<BookOpen size={14} />
				</div>
				<span className="text-[10px] font-bold text-gray-800 tracking-wide uppercase truncate">
					Bilan annuel
				</span>
			</div>

			<div className="flex flex-col gap-1.5 justify-start mt-2.5 w-full">
				{BILAN_ITEMS.map((item, idx) => (
					<div
						key={idx}
						className="w-full h-7 flex justify-between items-center bg-gray-50/50 border border-gray-100/30 px-2 rounded-lg shrink-0 gap-2">
						<div className="flex items-center gap-1.5 min-w-0 flex-1">
							<div className="shrink-0 scale-75 origin-left flex items-center">
								{item.type === "true" ? <TrueButton /> : <FalseButton />}
							</div>
							<span className="text-[12px] font-bold text-gray-600 truncate block">
								{item.label}
							</span>
						</div>

						<span
							className={`text-[12px] font-extrabold px-1.5 py-0.5 rounded shrink-0 leading-none ${
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

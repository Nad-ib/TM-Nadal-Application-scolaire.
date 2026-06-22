"use client";

import { Icon } from "@iconify/react";

interface NoteCaseProps {
	title: string;
	icon: string;
	value: number;
}

export default function IndividualNoteCase({
	title,
	icon,
	value,
}: NoteCaseProps) {
	return (
		<div className="bg-white flex flex-col p-2.5 bg-linear-to-b from-white to-gray-50/30 shadow-xs border border-gray-100 rounded-xl transition-all active:scale-95 select-none w-full aspect-square h-auto justify-between">
			<div className="flex justify-between items-start w-full gap-1 shrink-0">
				<div className="flex flex-col min-w-0">
					<span className="uppercase text-[11px] font-bold tracking-wide text-gray-800 truncate">
						{title.substring(0, 3)}
					</span>
					<span className="text-[8px] font-semibold text-[#43467F]/70 uppercase tracking-wider mt-0.5">
						Moy
					</span>
				</div>

				<div className="text-[#43467F] bg-indigo-50/60 p-1 rounded-lg flex items-center justify-center shrink-0">
					<Icon icon={icon || "mdi:folder"} width="14" height="14" />
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center min-h-0 mt-1">
				<span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
					{value > 0 ? value.toFixed(1) : "--"}
				</span>
			</div>
		</div>
	);
}

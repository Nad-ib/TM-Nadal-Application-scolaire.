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
		<div className="bg-white -mt-2 flex flex-col p-3 h-28 w-28 shadow-xl rounded-lg border-2 border-gray-50 transition-transform active:scale-95 ">
			<div className="flex justify-between items-center mb-1">
				<div className="flex flex-col">
					<span className="uppercase text-[11px] font-black tracking-tight text-black leading-none">
						{title.substring(0, 3)}
					</span>
					<span className="text-[8px] font-medium text-blue-800 second-font italic leading-none mt-0.5">
						avg:
					</span>
				</div>

				<div className="text-gray-400 bg-gray-50 p-1.5 rounded-lg flex items-center justify-center">
					<Icon icon={icon} width="18" height="18" />
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center">
				<span className="text-3xl font-black text-gray-800 tracking-tighter">
					{value > 0 ? value.toFixed(1) : value}
				</span>
			</div>
		</div>
	);
}

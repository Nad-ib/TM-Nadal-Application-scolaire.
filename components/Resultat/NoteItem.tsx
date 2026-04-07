"use client";

import { Pencil } from "lucide-react";

interface NoteItemProps {
	title: string;
	note: number;
	weight: number;
	date: string;
}

export default function NoteItem({ title, note, weight, date }: NoteItemProps) {
	return (
		<div className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium text-gray-800">{title}</h3>
				<div className="flex items-center gap-2">
					<div className="w-3.5 h-3.5 bg-[#22C55E] rounded-full" />
					<Pencil size={18} className="text-gray-900 cursor-pointer" />
				</div>
			</div>
			<div className="flex items-center gap-4 text-sm text-gray-500">
				<span>
					Note:{" "}
					<span className="font-bold text-gray-800">{note.toFixed(1)}</span>
				</span>
				<div className="w-px h-3 bg-gray-200" />
				<span>
					Poids: <span className="font-bold text-gray-800">{weight}</span>
				</span>
				<div className="w-px h-3 bg-gray-200" />
				<span>
					Date: <span className="font-bold text-gray-800">{date}</span>
				</span>
			</div>
		</div>
	);
}

"use client";

import { useEffect, useState } from "react";
import IndividualNoteCase from "./IndividualNoteCase";
import { getLatestBranches } from "@/Backend/services/branches";

export default function NotesDashboard() {
	const [latestBranches, setLatestBranches] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		setLoading(true);
		const branches = await getLatestBranches(3);
		setLatestBranches(branches);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="px-2 py-1 flex flex-col shadow-nadal bg-white col-span-3 rounded-lg">
			<div className="w-full text-sm font-medium text-gray-500 mb-1">
				Newest fields
			</div>
			<div className="flex justify-around items-center gap-2 w-full flex-1">
				{loading ? (
					<div className="text-gray-400 text-xs animate-pulse">
						Chargement...
					</div>
				) : latestBranches.length > 0 ? (
					latestBranches.map((b) => (
						<IndividualNoteCase
							key={b.id}
							title={b.name}
							icon={b.icon}
							value={b.average}
						/>
					))
				) : (
					<div className="text-gray-400 text-xs italic py-2">
						Aucune branche
					</div>
				)}
			</div>
		</div>
	);
}

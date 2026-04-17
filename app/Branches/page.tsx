"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import Branche from "@/components/NotesComponents/Branche";
import AddBranchButton from "@/components/AddBranchButton";
import { useProfile } from "@/hooks/useProfile";
import {
	fetchBranchesWithData,
	deleteBranch,
} from "@/Backend/services/branches";
import SwipeToDelete from "@/components/SwipeToDelete";

export default function Branches() {
	const { name } = useProfile();
	const [branches, setBranches] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const data = await fetchBranchesWithData();
			setBranches(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			setBranches((prev) => prev.filter((b) => b.id !== id));
			await deleteBranch(id);
		} catch (error) {
			console.error(error);
			loadData();
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div className="bg-white w-screen min-h-screen">
			<div className="w-full p-6 flex flex-col gap-6">
				<HeadInfos name={name} />

				<div className="flex flex-col gap-4 items-center">
					{loading ? (
						<p className="text-gray-400">Chargement...</p>
					) : branches.length > 0 ? (
						branches.map((b) => (
							<SwipeToDelete key={b.id} onDelete={() => handleDelete(b.id)}>
								<Link
									href={`/resultat/${encodeURIComponent(b.name)}`}
									className="w-full flex justify-center active:scale-95 transition-transform">
									<Branche
										id={b.id}
										title={b.name}
										icon={b.icon || "mdi:folder"}
										note={b.average}
										trend={b.trend}
										onIconUpdate={(newIcon: string) => {
											setBranches((prev) =>
												prev.map((item) =>
													item.id === b.id ? { ...item, icon: newIcon } : item,
												),
											);
										}}
									/>
								</Link>
							</SwipeToDelete>
						))
					) : (
						<p className="text-gray-400 text-center mt-10">Aucune branche.</p>
					)}
				</div>
			</div>

			<div className="fixed bottom-8 right-8 z-50">
				<AddBranchButton onBranchAdded={loadData} />
			</div>
		</div>
	);
}

"use client";

import { useEffect, useState, use } from "react";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import BranchCard from "@/components/NotesComponents/Branche";
import NoteItem from "@/components/Resultat/NoteItem";
import FilterTabs from "@/components/Resultat/FilterTabs";
import AddButton from "@/components/AddButton";
import { useProfile } from "@/hooks/useProfile";
import SwipeToDelete from "@/components/SwipeToDelete";
import { getBranchDetails, deleteNote } from "@/Backend/services/branches";

export default function BranchDetailPage({
	params,
}: {
	params: Promise<{ ResultatId: string }>;
}) {
	const { ResultatId } = use(params);
	const { name } = useProfile();

	const [notes, setNotes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [branchData, setBranchData] = useState<any | null>(null);

	const loadData = async () => {
		setLoading(true);
		try {
			const data = await getBranchDetails(decodeURIComponent(ResultatId));
			if (data) {
				setBranchData(data.branch);
				setNotes(data.notes);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteNote = async (id: string) => {
		try {
			setNotes((prev) => prev.filter((n) => n.id !== id));
			await deleteNote(id);
			loadData();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		loadData();
	}, [ResultatId]);

	return (
		<div className="min-h-screen bg-white pb-28">
			<div className="max-w-md mx-auto p-6 flex flex-col gap-6">
				<HeadInfos name={name} />

				<BranchCard
					id={branchData?.id || ""}
					title={branchData?.name || "Chargement..."}
					icon={branchData?.icon || "mdi:folder"}
					note={branchData?.average || 0}
					trend={(branchData?.trend as 1 | 0 | -1) || 0}
					onIconUpdate={(newIcon: string) => {
						setBranchData((prev: any) => ({ ...prev, icon: newIcon }));
					}}
				/>

				<FilterTabs />

				<div className="flex flex-col gap-4">
					{loading ? (
						<p className="text-center text-gray-400">Chargement...</p>
					) : notes.length > 0 ? (
						notes.map((n) => (
							<SwipeToDelete key={n.id} onDelete={() => handleDeleteNote(n.id)}>
								<NoteItem
									id={n.id}
									title={n.title}
									note={n.displayNote}
									weight={n.weight}
									date={new Date(n.created_at).toLocaleDateString()}
									is_group={n.is_group}
								/>
							</SwipeToDelete>
						))
					) : (
						<p className="text-center text-gray-400">Aucune note trouvée.</p>
					)}
				</div>
			</div>

			{branchData && (
				<div className="fixed bottom-8 right-8 z-50">
					<AddButton branchId={branchData.id} onNoteAdded={loadData} />
				</div>
			)}
		</div>
	);
}

"use client";

import { useEffect, useState, use } from "react";
import BranchCard from "@/components/NotesComponents/Branche";
import NoteItem from "@/components/Resultat/NoteItem";
import FilterTabs from "@/components/Resultat/FilterTabs";
import AddNoteCard from "@/components/AddNoteCard";
import SwipeToDelete from "@/components/SwipeToDelete";
import { getBranchDetails, deleteNote } from "@/Backend/services/branches";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BranchDetailPage({
	params,
}: {
	params: Promise<{ ResultatId: string }>;
}) {
	const { ResultatId } = use(params);
	const router = useRouter();

	const [notes, setNotes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [branchData, setBranchData] = useState<any | null>(null);
	const [activeTab, setActiveTab] = useState<"all" | "single" | "groups">(
		"all",
	);

	const currentPeriod = new Date().toLocaleDateString("fr-FR", {
		month: "long",
		year: "numeric",
	});

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

	const filteredNotes = notes.filter((n) => {
		if (activeTab === "single") return !n.is_group;
		if (activeTab === "groups") return n.is_group;
		return true;
	});

	return (
		<div className="min-h-screen bg-white pb-28 select-none antialiased overflow-x-hidden">
			<div className="max-w-md mx-auto p-6 flex flex-col gap-6">
				<div className="flex items-center justify-between w-full py-4 border-b border-slate-200/60 mb-2">
					<div className="flex items-center gap-3">
						<button
							onClick={() => router.back()}
							className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-500 shadow-xs hover:text-slate-800 active:scale-95 transition-all cursor-pointer">
							<ChevronLeft size={16} strokeWidth={2.5} />
						</button>
						<div className="flex flex-col">
							<span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">
								Détails
							</span>
							<h1 className="text-base font-black text-slate-900 tracking-tight -mt-0.5">
								Branches
							</h1>
						</div>
					</div>

					<div className="text-[10px] font-black text-slate-600 bg-white border border-slate-200/80 p-2.5 rounded-xl uppercase tracking-wider shadow-xs h-9 flex items-center justify-center">
						{currentPeriod}
					</div>
				</div>

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

				<FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

				<div className="flex flex-col gap-4">
					{!loading && branchData && (
						<AddNoteCard branchId={branchData.id} onNoteAdded={loadData} />
					)}

					{loading ? (
						<p className="text-center text-gray-400">Chargement...</p>
					) : filteredNotes.length > 0 ? (
						filteredNotes.map((n) => (
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
						<p className="text-center text-gray-400 py-4">
							Aucun élément ne correspond à ce filtre.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import BranchCard from "@/components/NotesComponents/Branche";
import NoteItem from "@/components/Resultat/NoteItem";
import FilterTabs from "@/components/Resultat/FilterTabs";
import AddButton from "@/components/AddButton";

export default function BranchDetailPage() {
	const notes = [
		{ id: 1, title: "TP n°3-Optique", note: 5.5, weight: 0.5, date: "12 Nov" },
		{
			id: 2,
			title: "Série de tests - Élec",
			note: 4.5,
			weight: 0.25,
			date: "29 Oct",
		},
		{ id: 3, title: "TP n°3-Optique", note: 5.5, weight: 0.5, date: "12 Nov" },
		{
			id: 4,
			title: "Série de tests - Élec",
			note: 4.5,
			weight: 0.25,
			date: "29 Oct",
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-md mx-auto p-6 flex flex-col gap-6">
				<HeadInfos />

				<BranchCard title="Mathématique" icon="math" note={4.8} trend={1} />

				<FilterTabs />

				<div className="flex flex-col gap-4 pb-28">
					{notes.map((n) => (
						<NoteItem
							key={n.id}
							title={n.title}
							note={n.note}
							weight={n.weight}
							date={n.date}
						/>
					))}
				</div>
			</div>

			<div className="fixed bottom-8 right-8 z-50">
				<AddButton />
			</div>
		</div>
	);
}

"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/Backend/lib/supabase";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import BranchCard from "@/components/NotesComponents/Branche";
import NoteItem from "@/components/Resultat/NoteItem";
import FilterTabs from "@/components/Resultat/FilterTabs";
import AddButton from "@/components/AddButton";
import { useProfile } from "@/hooks/useProfile";
import SwipeToDelete from "@/components/SwipeToDelete";
import { 
    getBranchAverage, 
    getSeriesAverage, 
    getBranchTrend 
} from "@/Backend/services/branches";

export default function BranchDetailPage({ params }: { params: Promise<{ ResultatId: string }> }) {
    const { ResultatId } = use(params);
    const { name } = useProfile();

    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [branchData, setBranchData] = useState<{ id: string; name: string; average: number; trend: number } | null>(null);

    const loadData = async () => {
        setLoading(true);
        const branchName = decodeURIComponent(ResultatId);

        const { data: branch } = await supabase
            .from("branches")
            .select("id, name")
            .ilike("name", branchName)
            .maybeSingle();

        if (branch) {
            const [avg, trend] = await Promise.all([
                getBranchAverage(branch.id),
                getBranchTrend(branch.id)
            ]);

            setBranchData({ ...branch, average: avg || 0, trend: trend || 0 });

            const { data: notesData } = await supabase
                .from("notes")
                .select("*")
                .eq("branch_id", branch.id)
                .is("parent_id", null)
                .order("created_at", { ascending: false });

            if (notesData) {
                const notesWithAverages = await Promise.all(
                    notesData.map(async (n) => ({
                        ...n,
                        displayNote: n.is_group ? await getSeriesAverage(n.id) : n.value
                    }))
                );
                setNotes(notesWithAverages);
            }
        }
        setLoading(false);
    };

    const handleDeleteNote = async (id: string) => {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (!error) {
            setNotes(prev => prev.filter(n => n.id !== id));
            loadData();
        }
    };

    useEffect(() => { loadData(); }, [ResultatId]);

    return (
        <div className="min-h-screen bg-white pb-28">
            <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
                <HeadInfos name={name} />

                <BranchCard
                    title={branchData?.name || "Chargement..."}
                    icon="math"
                    note={branchData?.average || 0}
                    trend={(branchData?.trend as 1 | 0 | -1) || 0}
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
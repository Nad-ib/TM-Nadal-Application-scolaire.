"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/Backend/lib/supabase";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import BranchCard from "@/components/NotesComponents/Branche";
import NoteItem from "@/components/Resultat/NoteItem";
import FilterTabs from "@/components/Resultat/FilterTabs";
import AddButton from "@/components/AddButton";
import { useProfile } from "@/hooks/useProfile";

export default function BranchDetailPage({ params }: { params: Promise<{ ResultatId: string }> }) {
    const { ResultatId } = use(params); 
    const { name } = useProfile();
    
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [branchData, setBranchData] = useState<{id: string, name: string} | null>(null);

    const loadData = async () => {
        setLoading(true);
        const branchName = decodeURIComponent(ResultatId);

        
        const { data: branch } = await supabase
            .from("branches")
            .select("id, name")
            .ilike("name", branchName)
            .maybeSingle();

        if (branch) {
            setBranchData(branch);

            
            const { data: notesData } = await supabase
                .from("notes")
                .select("*")
                .eq("branch_id", branch.id) 
                .is("parent_id", null)                
                .order("created_at", { ascending: false });

            setNotes(notesData || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [ResultatId]);

    return (
        <div className="min-h-screen bg-white pb-28">
            <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
                <HeadInfos name={name} />
                
                <BranchCard 
                    title={branchData?.name || "Chargement..."} 
                    icon="math" 
                    note={0} 
                    trend={0} 
                />

                <FilterTabs />

                <div className="flex flex-col gap-4">
                    {loading ? (
                        <p className="text-center text-gray-400">Chargement...</p>
                    ) : notes.length > 0 ? (
                        notes.map((n) => (
                            <NoteItem
                                key={n.id}
                                id={n.id}
                                title={n.title}
                                note={n.value} 
                                weight={n.weight}
                                date={new Date(n.created_at).toLocaleDateString()} 
                                is_group={n.is_group}
                            />
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
"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import NoteItem from "@/components/Resultat/NoteItem";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import { useProfile } from "@/hooks/useProfile";
import AddNoteToSeriesButton from "@/components/AddNoteToSeriesButton";
import SwipeToDelete from "@/components/SwipeToDelete";
import { getSeriesAverage } from "@/Backend/services/branches";

export default function SeriesDetailPage({
    params,
}: {
    params: Promise<{ seriesId: string }>;
}) {
    const { seriesId } = use(params);
    const { name } = useProfile();

    const [subNotes, setSubNotes] = useState<any[]>([]);
    const [seriesData, setSeriesData] = useState<any | null>(null);
    const [average, setAverage] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const decodedParam = decodeURIComponent(seriesId);

    async function fetchSeriesData() {
        setLoading(true);

        const { data: series } = await supabase
            .from("notes")
            .select("*")
            .or(`id.eq.${decodedParam},title.ilike.${decodedParam}`)
            .eq("is_group", true)
            .maybeSingle();

        if (series) {
            setSeriesData(series);
            const avg = await getSeriesAverage(series.id);
            setAverage(avg);

            const { data: notes } = await supabase
                .from("notes")
                .select("*")
                .eq("parent_id", series.id)
                .order("created_at", { ascending: true });

            setSubNotes(notes || []);
        }

        setLoading(false);
    }

    const handleDeleteSubNote = async (id: string) => {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (!error) {
            setSubNotes(prev => prev.filter(n => n.id !== id));
            fetchSeriesData();
        }
    };

    useEffect(() => {
        fetchSeriesData();
    }, [seriesId]);

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-md mx-auto p-6 flex flex-col gap-6">
                <HeadInfos name={name} />

                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">
                        Résumé de la série
                    </span>
                    {seriesData ? (
                        <NoteItem
                            id={seriesData.id}
                            title={seriesData.title}
                            note={average}
                            weight={seriesData.weight}
                            date={new Date(seriesData.created_at).toLocaleDateString()}
                            is_group={true}
                        />
                    ) : !loading ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                            Série "{decodedParam}" introuvable.
                        </div>
                    ) : (
                        <div className="h-24 w-full bg-gray-100 animate-pulse rounded-2xl" />
                    )}
                </div>

                <hr className="border-gray-100" />

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 ml-1">
                        <h2 className="text-lg font-bold text-gray-800">Évaluations</h2>
                        <p className="text-sm text-gray-500">
                            Détails des notes de ce groupe
                        </p>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400 mt-4">Chargement...</p>
                    ) : subNotes.length > 0 ? (
                        subNotes.map((n) => (
                            <SwipeToDelete key={n.id} onDelete={() => handleDeleteSubNote(n.id)}>
                                <NoteItem
                                    id={n.id}
                                    title={n.title}
                                    note={n.value}
                                    weight={n.weight}
                                    date={new Date(n.created_at).toLocaleDateString()}
                                    is_group={false}
                                />
                            </SwipeToDelete>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400">Aucune note dans cette série.</p>
                        </div>
                    )}
                </div>
            </div>

            {seriesData && (
                <AddNoteToSeriesButton
                    branchId={seriesData.branch_id}
                    seriesId={seriesData.id}
                    onNoteAdded={fetchSeriesData}
                />
            )}
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import IndividualNoteCase from "./IndividualNoteCase";
import { getLatestBranches } from "@/Backend/services/branches";

export default function NotesDashboard() {
    const [latestBranches, setLatestBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const branches = await getLatestBranches(3); 
            setLatestBranches(branches);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="px-2 py-1 flex flex-col shadow-nadal bg-white col-span-3 rounded-lg">
            <div className="w-full">Newest fields</div>
            <div className="flex justify-center items-center gap-2 w-full flex-1">
                {loading ? (
                    <div className="text-gray-400 text-sm">Chargement...</div>
                ) : latestBranches.length > 0 ? (
                    latestBranches.map((b) => (
                        <IndividualNoteCase
                            key={b.id}
                            title={b.name}
                            icon="math"
                            value={b.average}
                        />
                    ))
                ) : (
                    <div className="text-gray-400 text-sm italic">
                        Aucune branche pour le moment
                    </div>
                )}
            </div>
        </div>
    );
}
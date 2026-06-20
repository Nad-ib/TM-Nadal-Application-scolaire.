"use client";

import { useEffect, useState } from "react";
import IndividualNoteCase from "./IndividualNoteCase";
import { getLatestBranches } from "@/Backend/services/branches";
import { FolderKanban } from "lucide-react";

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
        <div className="px-3 py-2 flex flex-col shadow-nadal bg-white col-span-3 rounded-xl border border-gray-50 h-full justify-between overflow-hidden select-none">
            <div className="w-full flex items-center gap-2 shrink-0">
                <div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
                    <FolderKanban size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase truncate">
                    Newest fields
                </span>
            </div>
            <div className="flex justify-between items-center gap-2 w-full flex-1 mt-1 min-h-0">
                {loading ? (
                    <div className="w-full text-center py-2">
                        <div className="text-gray-400 text-[10px] font-medium animate-pulse">
                            Chargement...
                        </div>
                    </div>
                ) : latestBranches.length > 0 ? (
                    latestBranches.map((b) => (
                        <div key={b.id} className="flex-1 min-w-0 flex justify-center">
                            <IndividualNoteCase
                                title={b.name}
                                icon={b.icon}
                                value={b.average}
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-2">
                        <div className="text-gray-400 text-[10px] font-medium italic">
                            Aucune branche
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
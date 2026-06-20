"use client";

import NoteChart from "./Graph";
import { TrendingUp } from "lucide-react";

export default function GraphDashboard() {
    return (
        <div className="px-3 py-2 flex flex-col shadow-nadal bg-white col-span-3 rounded-xl border border-gray-50 h-full justify-between overflow-hidden select-none">
            <div className="w-full flex items-center gap-2 shrink-0">
                <div className="p-1 bg-indigo-50 rounded-lg text-[#43467F] shrink-0">
                    <TrendingUp size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase truncate">
                    Évolution des notes
                </span>
            </div>

            <div className="w-full flex-1 min-h-0 mt-2">
                <NoteChart />
            </div>
        </div>
    );
}
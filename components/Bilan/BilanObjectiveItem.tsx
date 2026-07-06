"use client";

import { Trash2 } from "lucide-react";

interface Objective {
    id: string;
    label: string;
    operator: string;
    target_value: string | number;
    computedCurrent: number;
    isPassed: boolean;
}

interface BilanObjectiveItemProps {
    objective: Objective;
    onDelete: (id: string) => void;
}

export default function BilanObjectiveItem({ objective, onDelete }: BilanObjectiveItemProps) {
    return (
        <div
            className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                objective.isPassed ? "bg-emerald-50/10 border-emerald-100/60" : "bg-rose-50/10 border-rose-100/40"
            }`}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{objective.label}</span>
                <span
                    className={`text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full border ${
                        objective.isPassed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                    }`}
                >
                    {objective.isPassed ? "Rempli" : "Bloquant"}
                </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-50/50 border border-slate-100 p-2 rounded-xl">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Actuel:</span>
                    <span className={`font-extrabold text-sm ${objective.isPassed ? "text-emerald-600" : "text-rose-600"}`}>
                        {objective.computedCurrent.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Seuil:</span>
                    <span className="font-mono bg-white border px-2 py-0.5 rounded-md text-[11px] text-slate-700">
                        {objective.operator} {objective.target_value}
                    </span>
                    <button
                        onClick={() => onDelete(objective.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}
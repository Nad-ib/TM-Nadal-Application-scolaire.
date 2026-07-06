"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

interface BilanStatusBannerProps {
    isYearPromoted: boolean;
    branchCount: number;
}

export default function BilanStatusBanner({ isYearPromoted, branchCount }: BilanStatusBannerProps) {
    return (
        <div
            className={`p-6 rounded-3xl border transition-all duration-500 ${
                isYearPromoted
                    ? "bg-linear-to-br from-emerald-600 to-teal-700 border-emerald-700 text-white shadow-lg shadow-emerald-900/10"
                    : "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-950 text-white shadow-lg shadow-slate-900/20"
            }`}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        {branchCount} branches configurées
                    </span>
                    <div className="p-2 rounded-xl backdrop-blur-md bg-white/10">
                        {isYearPromoted ? (
                            <CheckCircle2 size={20} className="text-emerald-300" />
                        ) : (
                            <AlertTriangle size={20} className="text-rose-400" />
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tight">
                        {isYearPromoted ? "Conditions Remplies 🎉" : "Statut Actuel : Non Promu"}
                    </h2>
                    <p className="text-xs mt-1 font-medium leading-relaxed opacity-80">
                        {isYearPromoted
                            ? "Félicitations ! Toutes vos règles de passage dynamique sont actuellement validées."
                            : "Attention, un ou plusieurs critères indispensables ne sont pas validés avec vos moyennes."}
                    </p>
                </div>
            </div>
        </div>
    );
}
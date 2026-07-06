"use client";

import { ChevronLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface BilanHeaderProps {
    onRefresh: () => void;
}

export default function BilanHeader({ onRefresh }: BilanHeaderProps) {
    return (
        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 active:scale-95 transition-all shadow-xs"
                >
                    <ChevronLeft size={16} />
                </Link>
                <div>
                    <h1 className="text-base font-bold tracking-tight text-slate-900">
                        Simulateur de Promotion
                    </h1>
                    <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
                        Vérification de vos ordonnances scolaires
                    </p>
                </div>
            </div>
            <button
                onClick={onRefresh}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 active:rotate-45 transition-transform shadow-xs cursor-pointer"
            >
                <RefreshCw size={14} />
            </button>
        </div>
    );
}
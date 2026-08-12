"use client";

import { Zap, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { generateSecureObjectives } from "@/Backend/services/objectives";
import { supabase } from "@/Backend/lib/supabase";

interface Objective {
    id: string;
    title: string;
    current_value: number;
    target_value: number;
    xp_reward: number;
    league_points_reward: number;
    is_completed: boolean;
}

interface SpecificObjectivesProps {
    userId?: string;
    objectives?: Objective[];
    onRefresh?: () => void;
}

export default function SpecificObjectives({
    userId: propUserId,
    objectives: initialObjectives = [],
    onRefresh,
}: SpecificObjectivesProps) {
    const [objectives, setObjectives] = useState<Objective[]>(initialObjectives || []);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(propUserId);

    useEffect(() => {
        if (propUserId) {
            setCurrentUserId(propUserId);
        } else {
            supabase.auth.getUser().then(({ data }) => {
                if (data?.user) setCurrentUserId(data.user.id);
            });
        }
    }, [propUserId]);

    useEffect(() => {
        if (initialObjectives) {
            setObjectives(initialObjectives);
        }
    }, [initialObjectives]);

    const handleGenerate = async () => {
        if (!currentUserId) return;
        setLoading(true);
        const newQuests = await generateSecureObjectives(currentUserId);
        if (newQuests && newQuests.length > 0) {
            setObjectives(newQuests as Objective[]);
        }
        if (onRefresh) onRefresh();
        setLoading(false);
    };

    const hasNoObjectives = !objectives || objectives.length === 0;

    return (
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3 px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Zap size={12} className="text-indigo-500" /> Objectifs Spécifiques
                    Personnalisés
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !currentUserId}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[9px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
                        Générer
                    </button>
                    <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        <ShieldAlert size={10} className="text-emerald-500" /> Données
                        Anonymisées
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                {hasNoObjectives ? (
                    <div className="text-center py-6">
                        <p className="text-xs text-slate-400 font-medium mb-3">
                            Aucun objectif actif pour le moment.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !currentUserId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                            Générer mes quêtes
                        </button>
                    </div>
                ) : (
                    objectives.map((obj) => {
                        const percentage = Math.min(
                            ((obj.current_value || 0) / (obj.target_value || 1)) * 100,
                            100
                        );
                        return (
                            <div
                                key={obj.id}
                                className={`p-2.5 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between gap-3 transition-opacity ${obj.is_completed ? "opacity-60" : "opacity-100"}`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p
                                            className={`text-xs font-bold text-slate-700 truncate ${obj.is_completed ? "line-through" : ""}`}
                                        >
                                            {obj.title}
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-400 shrink-0 ml-2">
                                            {obj.is_completed ? (
                                                <span className="text-emerald-600 flex items-center gap-0.5">
                                                    <CheckCircle2 size={10} /> Fait
                                                </span>
                                            ) : (
                                                `${obj.current_value || 0} / ${obj.target_value}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${obj.is_completed ? "bg-emerald-500" : "bg-indigo-500"}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                                            +{obj.xp_reward} XP
                                        </span>
                                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">
                                            +{obj.league_points_reward} LP
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${obj.is_completed ? "bg-emerald-50 text-emerald-500" : "bg-indigo-50 text-indigo-500"}`}
                                >
                                    {obj.is_completed ? (
                                        <CheckCircle2 size={14} />
                                    ) : (
                                        <Zap size={14} />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
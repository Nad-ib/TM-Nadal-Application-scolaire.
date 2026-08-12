"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/Backend/lib/supabase";
import {
    getUserObjectives,
    deleteObjective,
    addObjectiveCustom,
    computeLocalObjectiveValue,
    UserObjective,
} from "@/Backend/services/bilan";
import {
    fetchBranchesWithData,
    fetchCustomGroupsWithData,
} from "@/Backend/services/branches";
import { BookOpen, Plus } from "lucide-react";

import BilanHeader from "@/components/Bilan/BilanHeader";
import BilanStatusBanner from "@/components/Bilan/BilanStatusBanner";
import BilanObjectiveItem from "@/components/Bilan/BilanObjectiveItem";
import BilanRuleForm from "@/components/Bilan/BilanRuleForm";

interface Branch {
    id: string;
    name: string;
    average: number;
    group_id?: string;
}

interface CustomGroup {
    id: string;
    name: string;
    average?: number;
    total_points?: number;
}

type EvaluationType = "general" | "specific_branch" | "negative_points" | "group_average" | "group_sum";

export default function BilanPage() {
    const [objectives, setObjectives] = useState<UserObjective[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [customGroups, setCustomGroups] = useState<CustomGroup[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [formStep, setFormStep] = useState<1 | 2>(1);
    const [evaluationType, setEvaluationType] = useState<EvaluationType>("general");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [newOperator, setNewOperator] = useState(">=");
    const [newTarget, setNewTarget] = useState("");

    async function loadAllData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [objectivesData, branchesData, groupsData] = await Promise.all([
                getUserObjectives(user.id),
                fetchBranchesWithData(),
                fetchCustomGroupsWithData(user.id),
            ]);

            setObjectives(objectivesData || []);
            setBranches(branchesData || []);
            setCustomGroups(groupsData || []);
        } catch (err) {
            console.error("Erreur de synchronisation globale :", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAllData();
    }, []);

    const checkCondition = (operator: string, current: number, target: number): boolean => {
        if (operator === "<=") return current <= target;
        if (operator === "==") return current === target;
        return current >= target;
    };

    const computedObjectives = useMemo(() => {
        return objectives.map(obj => {
            const current = computeLocalObjectiveValue(obj, branches, customGroups);
            const isPassed = checkCondition(obj.operator, current, Number(obj.target_value));
            
            return { 
                ...obj, 
                label: obj.title || obj.label || "",
                computedCurrent: current, 
                isPassed 
            };
        });
    }, [objectives, branches, customGroups]);

    const isYearPromoted = useMemo(() => {
        if (computedObjectives.length === 0) return false;
        return computedObjectives.every(obj => obj.isPassed);
    }, [computedObjectives]);

    const handleDelete = async (id: string) => {
        try {
            await deleteObjective(id);
            setObjectives(prev => prev.filter(o => o.id !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression du critère :", err);
        }
    };

    const handleAddCustom = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetNum = parseFloat(newTarget);
        if (isNaN(targetNum)) return;

        let finalTitle = "";
        if (evaluationType === "general") finalTitle = "Moyenne Générale";
        if (evaluationType === "negative_points") finalTitle = "Points Négatifs Globaux";
        if (evaluationType === "specific_branch" && selectedBranch) finalTitle = `Moyenne : ${selectedBranch}`;
        if (evaluationType === "group_average" && selectedGroup) finalTitle = `Groupe : ${selectedGroup}`;
        if (evaluationType === "group_sum" && selectedGroup) finalTitle = `Somme Groupe : ${selectedGroup}`;

        if (!finalTitle.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const newObj = await addObjectiveCustom(user.id, finalTitle, targetNum, newOperator);
                if (newObj) {
                    setObjectives(prev => [...prev, newObj]);
                    resetForm();
                }
            }
        } catch (err) {
            console.error("Erreur lors de l'ajout du critère :", err);
        }
    };

    const resetForm = () => {
        setNewTarget("");
        setShowAddForm(false);
        setFormStep(1);
        setSelectedBranch("");
        setSelectedGroup("");
    };

    if (loading) {
        return (
            <div className="bg-slate-50 w-screen h-dvh flex items-center justify-center text-xs font-semibold text-slate-400">
                Chargement des paramètres...
            </div>
        );
    }

    return (
        <div className="bg-slate-50 w-screen h-dvh text-slate-800 relative overflow-y-auto select-none pb-12 antialiased">
            <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
                
                <BilanHeader onRefresh={loadAllData} />

                <BilanStatusBanner isYearPromoted={isYearPromoted} branchCount={branches.length} />

                <div className="p-4 bg-white border border-slate-200/70 rounded-3xl shadow-xs flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <BookOpen size={13} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Vos verrous de promotion
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {computedObjectives.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-xs font-medium">
                                Aucun critère défini. Ajoutez une règle ci-dessous pour démarrer la simulation.
                            </div>
                        ) : (
                            computedObjectives.map((obj) => (
                                <BilanObjectiveItem key={obj.id} objective={obj} onDelete={handleDelete} />
                            ))
                        )}
                    </div>

                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-1 w-full py-3 border-2 border-dashed border-indigo-100 text-indigo-500 bg-indigo-50/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-indigo-50/30 transition-all cursor-pointer"
                        >
                            <Plus size={14} /> Ajouter une règle ou un groupe
                        </button>
                    ) : (
                        <BilanRuleForm
                            formStep={formStep}
                            setFormStep={setFormStep}
                            evaluationType={evaluationType}
                            setEvaluationType={setEvaluationType}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                            selectedGroup={selectedGroup}
                            setSelectedGroup={setSelectedGroup}
                            newOperator={newOperator}
                            setNewOperator={setNewOperator}
                            newTarget={newTarget}
                            setNewTarget={setNewTarget}
                            branches={branches}
                            customGroups={customGroups}
                            onSubmit={handleAddCustom}
                            onClose={resetForm}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
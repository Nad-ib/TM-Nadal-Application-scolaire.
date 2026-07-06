"use client";

import { X, Sliders, Sigma, Layers, Target, HelpCircle, Check } from "lucide-react";

type EvaluationType = "general" | "specific_branch" | "negative_points" | "group_average" | "group_sum";

interface Branch {
    id: string;
    name: string;
}

interface CustomGroup {
    id: string;
    name: string;
}

interface BilanRuleFormProps {
    formStep: 1 | 2;
    setFormStep: (step: 1 | 2) => void;
    evaluationType: EvaluationType;
    setEvaluationType: (type: EvaluationType) => void;
    selectedBranch: string;
    setSelectedBranch: (branch: string) => void;
    selectedGroup: string;
    setSelectedGroup: (group: string) => void;
    newOperator: string;
    setNewOperator: (operator: string) => void;
    newTarget: string;
    setNewTarget: (target: string) => void;
    branches: Branch[];
    customGroups: CustomGroup[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export default function BilanRuleForm({
    formStep,
    setFormStep,
    evaluationType,
    setEvaluationType,
    selectedBranch,
    setSelectedBranch,
    selectedGroup,
    setSelectedGroup,
    newOperator,
    setNewOperator,
    newTarget,
    setNewTarget,
    branches,
    customGroups,
    onSubmit,
    onClose,
}: BilanRuleFormProps) {
    return (
        <div className="mt-1 p-4 border border-slate-200 bg-slate-50 rounded-2xl flex flex-col gap-4 shadow-inner">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Nouvelle règle</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">
                        Étape {formStep}/2
                    </span>
                </div>
                <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer">
                    <X size={14} />
                </button>
            </div>

            {formStep === 1 ? (
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Quel type de calcul voulez-vous isoler ?
                    </span>

                    <button
                        type="button"
                        onClick={() => { setEvaluationType("general"); setFormStep(2); }}
                        className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Sliders size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Moyenne Générale Globale</p>
                            <p className="text-[10px] text-slate-400">Prend en compte l'entier des branches actives.</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setEvaluationType("group_sum"); setFormStep(2); }}
                        className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Sigma size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Somme des points d'un Groupe</p>
                            <p className="text-[10px] text-slate-400">Additionne les notes des branches du groupe (ex: Fra + Math + All ≥ 12).</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setEvaluationType("group_average"); setFormStep(2); }}
                        className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Layers size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Moyenne d'un Groupe de branches</p>
                            <p className="text-[10px] text-slate-400">Isoler les groupes personnalisés créés.</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setEvaluationType("specific_branch"); setFormStep(2); }}
                        className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Target size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Suivi d'une Branche Unique</p>
                            <p className="text-[10px] text-slate-400">Mettre un verrou strict sur une seule matière.</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setEvaluationType("negative_points"); setFormStep(2); }}
                        className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><HelpCircle size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Calculateur de points insuffisants</p>
                            <p className="text-[10px] text-slate-400">Règlement suisse (somme des écarts en dessous de 4.0).</p>
                        </div>
                    </button>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    {evaluationType === "specific_branch" && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Sélectionner la matière :</label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full text-xs bg-white border p-2.5 rounded-xl outline-none"
                                required
                            >
                                <option value="">-- Choisir parmi mes branches --</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(evaluationType === "group_average" || evaluationType === "group_sum") && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Sélectionner un Groupe :</label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="w-full text-xs font-semibold bg-white border p-2.5 rounded-xl outline-none"
                                required
                            >
                                <option value="">-- Choisir un groupe personnalisé --</option>
                                {customGroups.map((g) => (
                                    <option key={g.id} value={g.name}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Condition :</label>
                            <select
                                value={newOperator}
                                onChange={(e) => setNewOperator(e.target.value)}
                                className="text-xs bg-white border p-2.5 rounded-xl outline-none"
                            >
                                <option value=">=">Minimum (&ge;)</option>
                                <option value="<=">Maximum (&le;)</option>
                                <option value="==">Égal strict (=)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Valeur cible :</label>
                            <input
                                type="number"
                                step="0.05"
                                placeholder={
                                    evaluationType === "negative_points"
                                        ? "ex: 1.0"
                                        : evaluationType === "group_sum"
                                            ? "ex: 12.0"
                                            : "ex: 4.0"
                                }
                                value={newTarget}
                                onChange={(e) => setNewTarget(e.target.value)}
                                className="text-xs bg-white border p-2.5 rounded-xl font-bold outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setFormStep(1)}
                            className="w-1/3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                            Retour
                        </button>
                        <button
                            type="submit"
                            className="w-2/3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                            <Check size={14} /> Activer le filtre
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
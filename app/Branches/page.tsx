"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Branche from "@/components/NotesComponents/Branche";
import AddBranchCard from "@/components/AddBranchCard";
import { supabase } from "@/Backend/lib/supabase";
import {
    fetchBranchesWithData,
    deleteBranch,
    fetchCustomGroupsWithData,
} from "@/Backend/services/branches";
import SwipeToDelete from "@/components/SwipeToDelete";
import {
    FolderPlus,
    Plus,
    X,
    Layers,
    Loader2,
    Check,
    Folder,
    Trash2,
    ChevronRight,
    ChevronLeft,
    RefreshCw,
} from "lucide-react";

export default function Branches() {
    const [branches, setBranches] = useState<any[]>([]);
    const [customGroups, setCustomGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingGroup, setSubmittingGroup] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const [branchesData, groupsData, linksData] = await Promise.all([
                    fetchBranchesWithData(),
                    fetchCustomGroupsWithData(user.id),
                    supabase.from("group_branches").select("*"),
                ]);

                const links = linksData.data || [];
                const branchesWithGroups = (branchesData || []).map((b: any) => {
                    const foundLink = links.find((l: any) => l.branch_id === b.id);
                    return { ...b, group_id: foundLink ? foundLink.group_id : null };
                });

                setBranches(branchesWithGroups);
                setCustomGroups(groupsData || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const recalculateGroupAverage = (groupId: string, currentBranches: any[]) => {
        const branchesInGroup = currentBranches.filter(
            (b) => b.group_id === groupId,
        );
        const validBranches = branchesInGroup.filter(
            (b) => b.average && Number(b.average) > 0,
        );
        if (validBranches.length === 0) return 0;
        const sum = validBranches.reduce((acc, b) => acc + Number(b.average), 0);
        return sum / validBranches.length;
    };

    const handleDelete = async (id: string) => {
        try {
            setBranches((prev) => prev.filter((b) => b.id !== id));
            await deleteBranch(id);
        } catch (error) {
            console.error(error);
            loadData();
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim() || submittingGroup) return;

        setSubmittingGroup(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error("Utilisateur non connecté");

            const { data, error } = await supabase
                .from("custom_groups")
                .insert([{ name: newGroupName.trim().toUpperCase(), user_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setCustomGroups((prev) => [...prev, { ...data, average: 0 }]);
                setNewGroupName("");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création du groupe.");
        } finally {
            setSubmittingGroup(false);
        }
    };

    const handleDeleteGroup = async (groupId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            await supabase.from("group_branches").delete().eq("group_id", groupId);
            const { error } = await supabase
                .from("custom_groups")
                .delete()
                .eq("id", groupId);
            if (error) throw error;

            setBranches((prev) =>
                prev.map((b) =>
                    b.group_id === groupId ? { ...b, group_id: null } : b,
                ),
            );
            setCustomGroups((prev) => prev.filter((g) => g.id !== groupId));

            if (selectedGroupId === groupId) {
                setSelectedGroupId(null);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleToggleBranchInGroup = async (
        branchId: string,
        currentGroupId: string | null,
    ) => {
        if (!selectedGroupId) return;

        const isCurrentlyInSelectedGroup = currentGroupId === selectedGroupId;
        const nextGroupId = isCurrentlyInSelectedGroup ? null : selectedGroupId;

        const updatedBranches = branches.map((b) =>
            b.id === branchId ? { ...b, group_id: nextGroupId } : b,
        );

        setBranches(updatedBranches);

        const newAvg = recalculateGroupAverage(selectedGroupId, updatedBranches);
        setCustomGroups((prev) =>
            prev.map((g) =>
                g.id === selectedGroupId ? { ...g, average: newAvg } : g,
            ),
        );

        try {
            if (isCurrentlyInSelectedGroup) {
                await supabase
                    .from("group_branches")
                    .delete()
                    .eq("branch_id", branchId)
                    .eq("group_id", selectedGroupId);
            } else {
                if (currentGroupId) {
                    await supabase
                        .from("group_branches")
                        .delete()
                        .eq("branch_id", branchId);
                }
                await supabase
                    .from("group_branches")
                    .insert([{ branch_id: branchId, group_id: selectedGroupId }]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formatAverage = (avg: any) => {
        const num = Number(avg);
        if (isNaN(num) || num === 0) return "0.0";
        return num.toFixed(1);
    };

    const activeGroup = customGroups.find((g) => g.id === selectedGroupId);

    return (
        <div className="bg-slate-50 w-screen min-h-screen antialiased text-slate-800 pb-12">
            <div className="w-full p-6 flex flex-col gap-5">
                
               
                <div className="w-full max-w-md mx-auto flex items-center justify-between min-h-12">
                    <Link
                        href="/dashboard"
                        className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:scale-95 rounded-2xl transition-all shadow-xs"
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </Link>

                    <h1 className="text-xs font-black tracking-widest text-slate-900 uppercase">
                        Mes Matières
                    </h1>

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 active:scale-95 rounded-2xl transition-all shadow-xs disabled:opacity-60"
                    >
                        <RefreshCw 
                            size={16} 
                            strokeWidth={2.5} 
                            className={loading ? "animate-spin text-indigo-500" : ""} 
                        />
                    </button>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <button
                        onClick={() => setShowGroupModal(true)}
                        className="w-full py-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-black tracking-wide text-slate-700 shadow-xs active:scale-[0.98] transition-all hover:bg-slate-50 hover:border-slate-300 uppercase"
                    >
                        <FolderPlus size={14} strokeWidth={2.5} className="text-indigo-600" /> Gérer mes groupes ({customGroups.length})
                    </button>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
                    {!loading && <AddBranchCard onBranchAdded={loadData} />}

                    {loading ? (
                        <p className="text-slate-400 text-xs font-bold mt-8 flex items-center gap-2 tracking-wider">
                            <Loader2 size={14} className="animate-spin text-indigo-500" />{" "}
                            CHARGEMENT...
                        </p>
                    ) : branches.length > 0 ? (
                        branches.map((b) => (
                            <SwipeToDelete key={b.id} onDelete={() => handleDelete(b.id)}>
                                <div className="w-full flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                                    <Link
                                        href={`/resultat/${encodeURIComponent(b.name)}`}
                                        className="w-full flex justify-center active:scale-[0.99] transition-transform"
                                    >
                                        <Branche
                                            id={b.id}
                                            title={b.name}
                                            icon={b.icon || "mdi:folder"}
                                            note={b.average}
                                            trend={b.trend}
                                            onIconUpdate={(newIcon: string) => {
                                                setBranches((prev) =>
                                                    prev.map((item) =>
                                                        item.id === b.id
                                                            ? { ...item, icon: newIcon }
                                                            : item,
                                                    ),
                                                );
                                            }}
                                        />
                                    </Link>

                                    {b.group_id && (
                                        <div className="px-4 pb-3 flex items-center gap-1.5">
                                            <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl border border-slate-200 uppercase">
                                                <Folder size={10} strokeWidth={2.5} className="text-indigo-500" />
                                                {customGroups.find((g) => g.id === b.group_id)?.name || "GROUPE ASSIGNÉ"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </SwipeToDelete>
                        ))
                    ) : (
                        <p className="text-slate-400 text-center text-xs font-bold mt-10 uppercase tracking-widest">
                            Aucune branche enregistrée.
                        </p>
                    )}
                </div>
            </div>

     
            {showGroupModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 border border-slate-100 flex flex-col gap-4 max-h-[85vh] overflow-hidden shadow-xl">
                        
                        
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-slate-800">
                                <Layers size={15} className="text-indigo-600" strokeWidth={2.5} />
                                <h3 className="text-xs font-black tracking-widest uppercase">Groupes de branches</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowGroupModal(false);
                                    setSelectedGroupId(null);
                                }}
                                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                            >
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        </div>

                        
                        {!selectedGroupId ? (
                            <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                                <form onSubmit={handleCreateGroup} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="NOM DU GROUPE (EX: SCIENCES)"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="w-full text-xs bg-slate-50/60 border border-slate-200 p-2.5 rounded-xl font-bold tracking-wide placeholder:text-slate-400 uppercase outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                                        required
                                        disabled={submittingGroup}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingGroup}
                                        className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl active:scale-95 flex items-center justify-center min-w-9.5 transition-all shadow-xs"
                                    >
                                        {submittingGroup ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Plus size={15} strokeWidth={2.5} />
                                        )}
                                    </button>
                                </form>

                                <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-37.5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        1. Sélectionner un groupe
                                    </span>
                                    {customGroups.length === 0 ? (
                                        <p className="text-center py-8 text-[10px] font-bold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 uppercase tracking-widest">
                                            Aucun groupe créé.
                                        </p>
                                    ) : (
                                        customGroups.map((g) => {
                                            const count = branches.filter((b) => b.group_id === g.id).length;
                                            const hasValue = Number(g.average) > 0;
                                            return (
                                                <div
                                                    key={g.id}
                                                    onClick={() => setSelectedGroupId(g.id)}
                                                    className="w-full flex items-center justify-between p-3.5 border border-slate-200/60 bg-white hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-black tracking-wide text-slate-800 uppercase">
                                                            {g.name}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {count} MATIÈRE{count > 1 ? "S" : ""} LIÉE{count > 1 ? "S" : ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`font-mono text-xs px-2.5 py-1 rounded-lg border font-bold ${
                                                                hasValue 
                                                                    ? "bg-rose-50/60 border-rose-100 text-rose-600" 
                                                                    : "bg-rose-50/60 border-rose-100 text-rose-600"
                                                            }`}
                                                        >
                                                            {formatAverage(g.average)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDeleteGroup(g.id, e)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={14} strokeWidth={2} />
                                                        </button>
                                                        <ChevronRight size={14} className="text-slate-400" strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                           
                            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setSelectedGroupId(null)}
                                    className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest text-indigo-600 hover:text-indigo-700 uppercase self-start pb-1"
                                >
                                    <ChevronLeft size={13} strokeWidth={3} /> Retour aux groupes
                                </button>

                               
                                <div className="p-4 bg-emerald-600 text-white rounded-xl flex items-center justify-between shadow-xs">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase font-black tracking-widest text-emerald-200">
                                            Groupe sélectionné
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-widest truncate max-w-44">
                                            {activeGroup?.name}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs bg-emerald-700/50 px-2.5 py-1 border border-emerald-400/20 rounded-lg font-bold">
                                        MOY: {formatAverage(activeGroup?.average)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 flex-1 overflow-hidden mt-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                                        2. Associer les matières
                                    </span>

                                    <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1">
                                        {branches.length === 0 ? (
                                            <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Aucune branche disponible.
                                            </p>
                                        ) : (
                                            branches.map((b) => {
                                                const isChecked = b.group_id === selectedGroupId;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={b.id}
                                                        onClick={() => handleToggleBranchInGroup(b.id, b.group_id)}
                                                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-black tracking-wide border text-left transition-all uppercase ${
                                                            isChecked
                                                                ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                                                                : b.group_id
                                                                    ? "bg-slate-50/50 border-slate-100 text-slate-300 italic line-through cursor-not-allowed opacity-40"
                                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                        disabled={!!b.group_id && !isChecked}
                                                    >
                                                        <span>{b.name}</span>
                                                        {isChecked && (
                                                            <span className="p-0.5 bg-emerald-500 rounded-md text-white">
                                                                <Check size={11} className="stroke-3" />
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
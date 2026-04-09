"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/Backend/lib/supabase";
import { X } from "lucide-react";

interface AddButtonProps {
    branchId: string;
    parent_id?: string | null;
    onNoteAdded: () => void;
}

export default function AddButton({ branchId, parent_id = null, onNoteAdded }: AddButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [weight, setWeight] = useState("1.0");
    const [isGroup, setIsGroup] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Session introuvable.");
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from("notes")
            .insert([{
                title,
                value: isGroup ? null : parseFloat(value),
                weight: parseFloat(weight),
                branch_id: branchId,
                parent_id: parent_id,
                user_id: user.id,
                is_group: isGroup
            }]);

        if (error) {
            alert(`Erreur: ${error.message}`);
        } else {
            setIsOpen(false);
            setTitle("");
            setValue("");
            setWeight("1.0");
            setIsGroup(false);
            onNoteAdded(); 
        }
        setLoading(false);
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-lg z-40"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Ajouter {isGroup ? "une série" : "une note"}</h2>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Titre</label>
                                    <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Examen Final" className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100" />
                                </div>

                                {!isGroup && (
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Note (1-6)</label>
                                        <input required type="number" step="0.01" min="1" max="6" value={value} onChange={(e) => setValue(e.target.value)} placeholder="5.5" className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100" />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Poids</label>
                                    <input required type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100" />
                                </div>

                                <div className="flex items-center gap-2 py-2">
                                    <input type="checkbox" id="isGroup" checked={isGroup} onChange={(e) => setIsGroup(e.target.checked)} className="w-5 h-5 accent-[#1E3A8A]" />
                                    <label htmlFor="isGroup" className="text-sm text-gray-600 font-medium">Est-ce une série de notes ?</label>
                                </div>

                                <button disabled={loading} type="submit" className="bg-[#1E3A8A] text-white font-bold py-4 rounded-2xl shadow-lg mt-2 disabled:bg-gray-400 active:scale-95 transition-transform">
                                    {loading ? "Enregistrement..." : "Confirmer"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
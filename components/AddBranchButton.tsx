"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/Backend/lib/supabase";
import { X } from "lucide-react";

export default function AddBranchButton({ onBranchAdded }: { onBranchAdded: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert("Session expirée");

        const { error } = await supabase
            .from("branches")
            .insert([{ name, user_id: user.id }]);

        if (error) {
            alert(error.message);
        } else {
            setIsOpen(false);
            setName("");
            onBranchAdded(); // Recharge la liste
        }
        setLoading(false);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-lg text-white text-3xl">+</button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Nouvelle branche</h2>
                                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input 
                                    required 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Physique, Anglais..." 
                                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 text-black"
                                />
                                <button disabled={loading} className="bg-[#1E3A8A] text-white font-bold py-4 rounded-2xl">
                                    {loading ? "Création..." : "Ajouter"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
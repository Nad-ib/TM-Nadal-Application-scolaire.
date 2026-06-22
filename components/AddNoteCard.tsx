"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/Backend/lib/supabase";
import { X } from "lucide-react";
import { Icon } from "@iconify/react";

interface AddNoteCardProps {
	branchId: string;
	parent_id?: string | null;
	onNoteAdded: () => void;
}

export default function AddNoteCard({
	branchId,
	parent_id = null,
	onNoteAdded,
}: AddNoteCardProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [value, setValue] = useState("");
	const [weight, setWeight] = useState("1.0");
	const [isGroup, setIsGroup] = useState(false);

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("Session introuvable.");
			setLoading(false);
			return;
		}

		const { error } = await supabase.from("notes").insert([
			{
				title,
				value: isGroup ? null : parseFloat(value),
				weight: parseFloat(weight),
				branch_id: branchId,
				parent_id: parent_id,
				user_id: user.id,
				is_group: isGroup,
			},
		]);

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
			<button
				onClick={() => setIsOpen(true)}
				className="w-full max-w-md p-5 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 shadow-sm h-auto flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-gray-400 transition-all group min-h-22.5">
				<div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
					<Icon icon="mdi:plus-circle-outline" className="text-2xl" />
					<span className="font-semibold text-sm tracking-wide">
						Ajouter une note ou une série
					</span>
				</div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:items-center bg-gray-900/20 backdrop-blur-xs overflow-y-auto">
						<div
							className="absolute inset-0"
							onClick={() => setIsOpen(false)}
						/>

						<motion.div
							initial={{ scale: 0.96, opacity: 0, y: 10 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.96, opacity: 0, y: 10 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
							className="relative bg-white w-full max-w-sm rounded-xl p-5 shadow-xl border border-gray-100 select-none overflow-hidden">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-sm font-semibold text-gray-800">
									Ajouter {isGroup ? "une série" : "une note"}
								</h2>
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 active:scale-95 transition-all">
									<X size={16} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-0.5">
										Titre
									</label>
									<input
										required
										autoFocus
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Ex: Examen Final"
										className="w-full px-3 py-2 bg-gray-50 border border-gray-200/80 rounded-lg outline-none text-sm text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:bg-white transition-all"
									/>
								</div>

								{!isGroup && (
									<div className="flex flex-col gap-1">
										<label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-0.5">
											Note (1-6)
										</label>
										<input
											required
											type="number"
											step="0.5"
											min="1"
											max="6"
											value={value}
											onChange={(e) => setValue(e.target.value)}
											placeholder="5.5"
											className="w-full px-3 py-2 bg-gray-50 border border-gray-200/80 rounded-lg outline-none text-sm text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:bg-white transition-all"
										/>
									</div>
								)}

								<div className="flex flex-col gap-1">
									<label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-0.5">
										Poids
									</label>
									<input
										required
										type="number"
										step="0.1"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										className="w-full px-3 py-2 bg-gray-50 border border-gray-200/80 rounded-lg outline-none text-sm text-gray-800 focus:border-gray-300 focus:bg-white transition-all"
									/>
								</div>

								<div className="flex items-center gap-2.5 py-1 px-0.5">
									<input
										type="checkbox"
										id="isGroup"
										checked={isGroup}
										onChange={(e) => setIsGroup(e.target.checked)}
										className="w-4 h-4 rounded border-gray-300 text-[#1E3A8A] focus:ring-0 accent-[#1E3A8A] cursor-pointer"
									/>
									<label
										htmlFor="isGroup"
										className="text-xs text-gray-600 font-medium select-none cursor-pointer">
										Est-ce une série de notes ?
									</label>
								</div>

								<button
									disabled={loading}
									type="submit"
									className="w-full bg-[#1E3A8A] hover:bg-[#152a63] text-white font-medium text-xs py-2.5 rounded-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-1">
									{loading ? (
										<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										"Confirmer"
									)}
								</button>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

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
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						/>

						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-800">
									Ajouter {isGroup ? "une série" : "une note"}
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="text-gray-400 hover:text-gray-600">
									<X size={24} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<div>
									<label className="text-xs font-semibold text-gray-500 uppercase">
										Titre
									</label>
									<input
										required
										autoFocus
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Ex: Examen Final"
										className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100 focus:ring-2 ring-blue-500/20 transition-all"
									/>
								</div>

								{!isGroup && (
									<div>
										<label className="text-xs font-semibold text-gray-500 uppercase">
											Note (1-6)
										</label>
										<input
											required
											type="number"
											step="0.01"
											min="1"
											max="6"
											value={value}
											onChange={(e) => setValue(e.target.value)}
											placeholder="5.5"
											className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100 focus:ring-2 ring-blue-500/20 transition-all"
										/>
									</div>
								)}

								<div>
									<label className="text-xs font-semibold text-gray-500 uppercase">
										Poids
									</label>
									<input
										required
										type="number"
										step="0.1"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100 focus:ring-2 ring-blue-500/20 transition-all"
									/>
								</div>

								<div className="flex items-center gap-2 py-2">
									<input
										type="checkbox"
										id="isGroup"
										checked={isGroup}
										onChange={(e) => setIsGroup(e.target.checked)}
										className="w-5 h-5 accent-[#1E3A8A]"
									/>
									<label
										htmlFor="isGroup"
										className="text-sm text-gray-600 font-medium select-none">
										Est-ce une série de notes ?
									</label>
								</div>

								<button
									disabled={loading}
									type="submit"
									className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 disabled:bg-gray-400 active:scale-95  transition-colors">
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/Backend/lib/supabase";
import { X } from "lucide-react";

interface AddNoteToSeriesButtonProps {
	branchId: string;
	seriesId: string;
	onNoteAdded: () => void;
}

export default function AddNoteToSeriesButton({
	branchId,
	seriesId,
	onNoteAdded,
}: AddNoteToSeriesButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [value, setValue] = useState("");
	const [weight, setWeight] = useState("1.0");

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;

		const { error } = await supabase.from("notes").insert([
			{
				title,
				value: parseFloat(value),
				weight: parseFloat(weight),
				branch_id: branchId,
				parent_id: seriesId,
				user_id: user.id,
				is_group: false,
			},
		]);

		if (!error) {
			setIsOpen(false);
			setTitle("");
			setValue("");
			setWeight("1.0");
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
				className="fixed bottom-8 right-8 w-14 h-14 bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-lg z-40 text-white">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round">
					<line x1="12" y1="5" x2="12" y2="19" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</motion.button>

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
									Ajouter une note
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="text-gray-400">
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
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Ex: Vocabulaire 1"
										className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
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
											className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100"
										/>
									</div>
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
											className="w-full p-3 bg-gray-50 rounded-xl mt-1 text-black outline-none border border-gray-100"
										/>
									</div>
								</div>

								<button
									disabled={loading}
									type="submit"
									className="bg-[#1E3A8A] text-white font-bold py-4 rounded-2xl shadow-lg mt-2 disabled:bg-gray-400 active:scale-95 transition-transform">
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

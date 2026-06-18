"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/Backend/lib/supabase";
import { X } from "lucide-react";
import { Icon } from "@iconify/react";

export default function AddBranchCard({
	onBranchAdded,
}: {
	onBranchAdded: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return alert("Session expirée");

		const { error } = await supabase
			.from("branches")
			.insert([{ name, user_id: user.id }]);

		if (error) {
			alert(error.message);
		} else {
			setIsOpen(false);
			setName("");
			onBranchAdded();
		}
		setLoading(false);
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="w-full max-w-md p-5 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 shadow-sm h-auto flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-gray-400 transition-all group min-h-27.5">
				<div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
					<Icon icon="mdi:plus-circle-outline" className="text-2xl" />
					<span className="font-semibold text-sm tracking-wide">
						Ajouter une nouvelle matière
					</span>
				</div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-800">
									Nouvelle branche
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="text-gray-400 hover:text-gray-600">
									<X size={24} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<input
									required
									autoFocus
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Ex: Physique, Anglais..."
									className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 text-black focus:ring-2 ring-blue-500/20 transition-all"
								/>
								<button
									disabled={loading}
									className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50">
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

"use client";

import { motion } from "framer-motion";

export default function AddButton() {
	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			className="w-14 h-14 bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(30,58,138,0.4)] transition-shadow">
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
	);
}

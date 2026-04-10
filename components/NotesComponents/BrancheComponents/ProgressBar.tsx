"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
	value: number;
	max?: number;
}

export default function ProgressBar({ value, max = 6 }: ProgressBarProps) {
	const percentage = (value / max) * 100;
	return (
		<div className="flex-1 h-3.5 bg-[#FFEDD5] rounded-full overflow-hidden relative">
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: `${percentage}%` }}
				transition={{ type: "spring", stiffness: 50, damping: 15 }}
				className="h-full bg-[#22C55E] rounded-full"
			/>
		</div>
	);
}

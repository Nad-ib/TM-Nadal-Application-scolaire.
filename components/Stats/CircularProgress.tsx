"use client";

import { motion } from "framer-motion";

interface CircularProgressProps {
	percentage: number;
	level: number | string;
	size?: number; 
	strokeWidth?: number;
	color?: string;
}

export default function CircularProgress({
	percentage,
	level,
	size = 80,
	strokeWidth = 6,
	color = "#4ADE80",
}: CircularProgressProps) {
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	return (
		<div
			className="relative flex items-center justify-center"
			style={{ width: size, height: size }}>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="absolute">
				<circle
					cx={center}
					cy={center}
					r={radius}
					stroke="#DDDEF4"
					strokeWidth={strokeWidth}
					fill="transparent"
				/>
			</svg>
			<motion.svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="absolute -rotate-90">
				<motion.circle
					cx={center}
					cy={center}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					fill="transparent"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: percentage }}
					transition={{ duration: 1.5, ease: "easeInOut" }}
				/>
			</motion.svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span
					className="font-bold text-gray-800"
					style={{ fontSize: size * 0.3 }}>
					{level}
				</span>
			</div>
		</div>
	);
}

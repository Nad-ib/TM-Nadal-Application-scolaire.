"use client";

import { motion, useAnimationControls } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRef } from "react";

export default function SwipeToDelete({
	children,
	onDelete,
}: {
	children: React.ReactNode;
	onDelete: () => void;
}) {
	const controls = useAnimationControls();
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden rounded-2xl select-none touch-pan-y">
			<div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 pointer-events-none">
				<Trash2 className="text-white" size={24} />
			</div>
			<motion.div
				drag="x"
				animate={controls}
				initial={{ x: 0 }}
				dragDirectionLock
				dragConstraints={{ left: -140, right: 0 }}
				dragElastic={{ left: 0.1, right: 0 }}
				onDragEnd={async (_, info) => {
					const distanceX = info.offset.x;
					const velocityX = info.velocity.x;
					const isHardSwipe = distanceX < -100;
					const isIntentionalSwipe = distanceX < -60 && velocityX < -150;

					if (isHardSwipe || isIntentionalSwipe) {
						await controls.start({ x: "-100%", transition: { duration: 0.2 } });
						onDelete();
					} else {
						controls.start({
							x: 0,
							transition: { type: "spring", stiffness: 400, damping: 35 },
						});
					}
				}}
				className="relative bg-white z-10 w-full">
				{children}
			</motion.div>
		</div>
	);
}

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function SwipeToDelete({
	children,
	onDelete,
}: {
	children: React.ReactNode;
	onDelete: () => void;
}) {
	return (
		<div className="relative w-full overflow-hidden rounded-2xl">
			<div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6">
				<Trash2 className="text-white" size={24} />
			</div>

			<motion.div
				drag="x"
				dragConstraints={{ left: -100, right: 0 }}
				dragElastic={0.7}
				onDragEnd={(_, info) => {
					if (info.offset.x < -80) {
						onDelete();
					}
				}}
				className="relative bg-white z-10">
				{children}
			</motion.div>
		</div>
	);
}

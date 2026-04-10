import Image from "next/image";

interface image {
	name: string;
}

export default function Avatar() {
	return (
		<div className="relative w-6 h-6 overflow-hidden rounded-full border-gray-200 shadow-sm">
			<Image
				src="/buisnessman.svg"
				alt="Profil de Nadal"
				fill
				className="object-cover object-top"
				sizes="40px"
				priority
			/>
		</div>
	);
}

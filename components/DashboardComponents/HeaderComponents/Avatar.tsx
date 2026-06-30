import Image from "next/image";

interface AvatarProps {
	url?: string;
}

export default function Avatar({ url }: AvatarProps) {
	const avatarSrc = url && url.trim() !== "" ? url : "/buisnessman.svg";

	return (
		<div className="relative w-8 h-8 overflow-hidden rounded-full border border-slate-100 shadow-sm bg-white">
			<Image
				src={avatarSrc}
				alt="Avatar utilisateur"
				fill
				className="object-cover object-top"
				sizes="32px"
				priority
			/>
		</div>
	);
}

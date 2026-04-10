import Indicators from "./Indicators";

interface HeadLineProps {
	title: string;
	icon: string;
	value: 1 | 0 | -1;
}

export default function BranchHeadLine({ title, icon, value }: HeadLineProps) {
	return (
		<div className="flex items-center justify-between w-full mb-4">
			<div className="flex items-center gap-3">
				<img
					src={`/${icon}.svg`}
					alt={icon}
					className="w-6 h-6 object-contain"
				/>
				<span className="text-xl font-medium text-gray-800">{title}</span>
			</div>
			<Indicators value={value} />
		</div>
	);
}

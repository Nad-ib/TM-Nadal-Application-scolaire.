interface NoteCaseProps {
	title: string;
	icon: string;
	value: number;
}

export default function IndividualNoteCase({
	title,
	icon,
	value,
}: NoteCaseProps) {
	return (
		<div className="bg-white flex flex-col px-2 h-25 w-25 shadow-cards rounded-lg">
			<div className=" flex justify-between items ">
				<div className=" flex  flex-col">
					<div className="">{title}</div>
					<div className="-mt-2 second-font">avg:</div>
				</div>
				<img src={`/${icon}.svg`} alt="flag-germany" className="scale-65" />
			</div>

			<div className="flex flex-1 text-5xl items-center justify-center">
				{value}
			</div>
		</div>
	);
}

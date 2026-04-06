import TrueButton from "./TrueButton";
import FalseButton from "./FalseButton";

export default function BilanDashboard() {
	return (
		<div className="px-4 py-1 flex flex-col shadow-nadal bg-white col-span-3 rounded-lg">
			<div className="w-full flex">
				<img src="book.svg" alt="" className="scale-75 " />
				<span>Bilan</span>
			</div>
			<div className=" flex justify-center items-center  w-full   flex-1">
				<div className="w-full flex flex-col gap-y-2   ">
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-3">
							<TrueButton></TrueButton>
							<div className="text-xs">moyenne général</div>
						</div>
						<div className="text-xs">4</div>
					</div>
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-3">
							<TrueButton></TrueButton>
							<div className="text-xs">
								nombre de notes insuffisantes (max 4)
							</div>
						</div>
						<div className="text-xs">3</div>
					</div>
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-3">
							<FalseButton></FalseButton>
							<div className="text-xs">total du premier groupe (min 16)</div>
						</div>
						<div className="text-xs">15</div>
					</div>
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-3">
							<TrueButton></TrueButton>
							<div className="text-xs">Total(min 48 points)</div>
						</div>
						<div className="text-xs">53</div>
					</div>
					<div className="w-full flex justify-between items-center"></div>
				</div>
			</div>
		</div>
	);
}

"use client";

import CircularProgress from "./CircularProgress";

export default function StatsDashboard() {
	const xpPercentage = 0.35;

	return (
		<div className="px-2 py-1 flex flex-col shadow-nadal bg-white rounded-lg h-full">
			<div className="w-full">Stats</div>

			<div className="flex flex-col flex-1">
				<div className="second-font px-1 leading-none -mt-1">LVL :</div>

				<div className="flex items-center justify-center flex-1 -mt-2">
					<CircularProgress percentage={xpPercentage} level={9} size={55} />
				</div>

				<div className="second-font h-1/3">
					<div>insignes :</div>
					<div className="flex gap-2"></div>
				</div>
			</div>
		</div>
	);
}

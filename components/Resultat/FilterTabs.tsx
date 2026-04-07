"use client";

export default function FilterTabs() {
	return (
		<div className="w-full flex bg-gray-50 rounded-full p-1 border border-gray-200">
			<button className="flex-1 py-2.5 bg-[#43467F] text-white rounded-full text-sm font-semibold shadow-sm">
				Toutes Les notes
			</button>
			<button className="flex-1 py-2.5 text-gray-500 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
				TP
			</button>
		</div>
	);
}

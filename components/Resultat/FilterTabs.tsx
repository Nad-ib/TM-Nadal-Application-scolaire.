"use client";

interface FilterTabsProps {
	activeTab: "all" | "single" | "groups";
	setActiveTab: (tab: "all" | "single" | "groups") => void;
}

export default function FilterTabs({
	activeTab,
	setActiveTab,
}: FilterTabsProps) {
	return (
		<div className="w-full flex bg-gray-50 rounded-full p-1 border border-gray-200">
			<button
				onClick={() => setActiveTab("all")}
				className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
					activeTab === "all"
						? "bg-[#43467F] text-white shadow-sm"
						: "text-gray-500 hover:bg-gray-100"
				}`}>
				Toutes
			</button>
			<button
				onClick={() => setActiveTab("single")}
				className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
					activeTab === "single"
						? "bg-[#43467F] text-white shadow-sm"
						: "text-gray-500 hover:bg-gray-100"
				}`}>
				Notes
			</button>
			<button
				onClick={() => setActiveTab("groups")}
				className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
					activeTab === "groups"
						? "bg-[#43467F] text-white shadow-sm"
						: "text-gray-500 hover:bg-gray-100"
				}`}>
				Séries
			</button>
		</div>
	);
}

"use client";

import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import NotesDashboard from "@/components/DashboardComponents/Notes/NotesDashboard";
import GraphDashboard from "@/components/DashboardComponents/Graph/GraphDashboard";
import CommunityDashboard from "@/components/DashboardComponents/Community/CommunityDashboard";
import StatsDashboard from "@/components/DashboardComponents/Stats/StatsDashboard";
import BilanDashboard from "@/components/DashboardComponents/Bilan/BilanDashboard";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";

export default function Dashboard() {
	const { name } = useProfile();

	return (
		<div className="bg-white w-screen h-dvh overflow-hidden flex flex-col justify-start">
			<div className="w-full max-w-md mx-auto p-4 flex flex-col gap-3.5 h-full justify-start">
				<HeadInfos name={name} />

				<div className="grid grid-cols-3 grid-rows-[auto_1.2fr_1fr_auto] gap-3.5 flex-1 min-h-0 pb-2">
					<Link href="/Branches" className="col-span-3 block w-full h-auto">
						<NotesDashboard />
					</Link>

					<div className="col-span-3 w-full h-full min-h-0">
						<GraphDashboard />
					</div>

					<Link href="/community" className="col-span-2 block w-full h-full">
						<CommunityDashboard />
					</Link>

					<Link href="/stats" className="col-span-1 block w-full h-full">
						<StatsDashboard />
					</Link>

					<div className="col-span-3 w-full h-full min-h-0">
						<BilanDashboard />
					</div>
				</div>
			</div>
		</div>
	);
}

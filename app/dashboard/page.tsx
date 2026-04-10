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
		<div className="bg-white w-screen h-dvh   ">
			<div className="w-full h-full  p-6  flex flex-col">
				<HeadInfos name={name}></HeadInfos>
				<div className="grid grid-cols-3 grid-rows-4 gap-4 flex-1">
					<Link href="/Branches" className="contents">
						<NotesDashboard></NotesDashboard>
					</Link>

					<GraphDashboard></GraphDashboard>
					<CommunityDashboard></CommunityDashboard>
					<StatsDashboard></StatsDashboard>
					<BilanDashboard></BilanDashboard>
				</div>
			</div>
		</div>
	);
}

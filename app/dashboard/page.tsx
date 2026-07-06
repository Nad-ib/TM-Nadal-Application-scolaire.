"use client";

import { useEffect, useState } from "react";
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos";
import NotesDashboard from "@/components/DashboardComponents/Notes/NotesDashboard";
import GraphDashboard from "@/components/DashboardComponents/Graph/GraphDashboard";
import CommunityDashboard from "@/components/DashboardComponents/Community/CommunityDashboard";
import StatsDashboard from "@/components/DashboardComponents/Stats/StatsDashboard";
import BilanDashboard from "@/components/DashboardComponents/Bilan/BilanDashboard";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/Backend/lib/supabase";
import { getDashboardObjectives, UserObjective, computeLocalObjectiveValue } from "@/Backend/services/bilan";
import { fetchBranchesWithData, fetchCustomGroupsWithData } from "@/Backend/services/branches";

export default function Dashboard() {
    const { name, avatarUrl } = useProfile();
    const [recentObjectives, setRecentObjectives] = useState<UserObjective[]>([]);

    useEffect(() => {
        async function fetchDashboardBilan() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const [objectivesData, branchesData, groupsData] = await Promise.all([
                    getDashboardObjectives(user.id),
                    fetchBranchesWithData(),
                    fetchCustomGroupsWithData(user.id),
                ]);

                const computed = (objectivesData || []).map(obj => {
                    const realValue = computeLocalObjectiveValue(obj, branchesData || [], groupsData || []);
                    return {
                        ...obj,
                        current_value: realValue
                    };
                });

                setRecentObjectives([...computed].reverse().slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        }

        fetchDashboardBilan();
    }, []);

    return (
        <div className="bg-white w-screen h-dvh overflow-hidden flex flex-col justify-start">
            <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-3.5 h-full justify-start">
                <HeadInfos name={name} avatarUrl={avatarUrl} />

                <div className="grid grid-cols-3 grid-rows-[auto_1.2fr_1fr_auto] gap-3.5 flex-1 min-h-0 pb-2">
                    <Link href="/Branches" className="col-span-3 block w-full h-auto">
                        <NotesDashboard />
                    </Link>

                    <Link href="/graph" className="col-span-3 w-full h-full min-h-0">
                        <GraphDashboard />
                    </Link>

                    <Link href="/community" className="col-span-2 block w-full h-full">
                        <CommunityDashboard />
                    </Link>

                    <Link href="/stats" className="col-span-1 block w-full h-full">
                        <StatsDashboard />
                    </Link>

                    <Link href="/bilan" className="col-span-3 w-full h-full min-h-0 block">
                        <BilanDashboard data={{ objectives: recentObjectives }} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
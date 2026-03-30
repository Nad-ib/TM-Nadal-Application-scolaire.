import HeadInfos from "@/components/HeaderComponents/HeadInfos";
import NotesDashboard from "@/components/Notes/NotesDashboard";
import GraphDashboard from "@/components/Graph/GraphDashboard";
import CommunityDashboard from "@/components/Community/CommunityDashboard";
import StatsDashboard from "@/components/Stats/StatsDashboard";
import BilanDashboard from "@/components/Bilan/BilanDashboard";

export default function Home() {
  return (
    <div className="bg-white w-screen h-dvh   ">
      <div className="w-full h-full  p-6  flex flex-col">
        <HeadInfos></HeadInfos>
        <div className="grid grid-cols-3 grid-rows-4 gap-4 flex-1">
          <NotesDashboard ></NotesDashboard>
          <GraphDashboard ></GraphDashboard>
          <CommunityDashboard ></CommunityDashboard>
          <StatsDashboard ></StatsDashboard>
          <BilanDashboard ></BilanDashboard>
        </div> 
      </div>
    </div>
  );
}

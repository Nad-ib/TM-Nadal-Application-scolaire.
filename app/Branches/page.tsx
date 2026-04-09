import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos"
import Branche from "@/components/NotesComponents/Branche"
import AddButton from "@/components/AddButton"
import { useProfile } from "@/hooks/useProfile"
export default function Branches(){
    const {name} = useProfile()
    return(
        <div className="bg-white w-screen h-dvh">
            <div className="w-full h-full  p-6  flex flex-col gap-2">
                <HeadInfos name={name}/>
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Branche title="Mathématique" icon="math" note={5.6} trend={1}/>
                    <Branche title="Français" icon="flag-france" note={3.6} trend={-1}/>
                    <Branche title="Allemand" icon="flag-germany" note={4.5} trend={0}/>
                    <Branche title="Mathématique" icon="math" note={5.6} trend={1}/>
                    <Branche title="Français" icon="flag-france" note={3.6} trend={-1}/>
                    <Branche title="Allemand" icon="flag-germany" note={4.5} trend={0}/>
                    <Branche title="Mathématique" icon="math" note={5.6} trend={1}/>
                    <Branche title="Français" icon="flag-france" note={3.6} trend={-1}/>
                    <Branche title="Allemand" icon="flag-germany" note={4.5} trend={0}/>
                </div>
                
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <AddButton/>
            </div>
        </div>
    )
}
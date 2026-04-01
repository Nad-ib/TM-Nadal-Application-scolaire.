import NoteChart from "./Graph"
export default function GraphDashboard() {
    return(
        <div className="px-2 py-1 shadow-nadal bg-white col-span-3 rounded-lg">
            <div className="w-full ">evol avg</div>
            <div className="flex justify-center items-center gap-2 w-full  flex-1">
                <NoteChart/>
            </div>
        </div>
    )
}
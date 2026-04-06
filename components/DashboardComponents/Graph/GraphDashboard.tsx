import NoteChart from "./Graph"
export default function GraphDashboard() {
    return(
        <div className="h-full px-2 py-1 shadow-nadal bg-white col-span-3 flex flex-col rounded-lg">
            <div className="w-full shrink-0 flex items-center ">
                <img className="scale-70" src="graph-logo.svg" alt="" />
                <span>Graph</span>
            </div>
            <div className="w-full flex-1">
                <NoteChart/>
            </div>
        </div>
    )
}
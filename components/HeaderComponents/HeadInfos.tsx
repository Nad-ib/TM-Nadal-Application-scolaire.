import Avatar from "./Avatar"

export default function HeadInfos() {
    return(
        <div className="h-12  text-black flex justify-between items-center px-4">
            <div>Nadal</div>
            <div className=" flex  justify-center items-center gap-3">
            <div> Hi Nadal</div>
            <Avatar></Avatar>
            </div>
        </div>
    )
}
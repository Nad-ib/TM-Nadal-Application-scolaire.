import Avatar from "./Avatar"

interface UserInfos {
    name: string;
}

export default function HeadInfos({name}: UserInfos) {
    return(
        <div className="h-12  text-black flex justify-between items-center px-4">
            <div>NoteQuest</div>
            <div className=" flex  justify-center items-center gap-3">
            <div> Hi {name}</div>
            <Avatar></Avatar>
            </div>
        </div>
    )
}
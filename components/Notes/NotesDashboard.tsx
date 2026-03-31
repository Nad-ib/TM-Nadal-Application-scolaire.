import IndividualNoteCase from "./IndividualNoteCase"
export default function NotesDashboard() {
    return(
        <div className="px-2 py-1  flex flex-col shadow-nadal bg-white col-span-3 rounded-lg">
                <div className="w-full ">newest fields</div>
                <div className="flex justify-center items-center gap-2 w-full  flex-1">
                    <IndividualNoteCase title="All" icon="flag-germany" value={5.5}></IndividualNoteCase>
                    <IndividualNoteCase title="Fra" icon="flag-france" value={3.5}></IndividualNoteCase>
                    <IndividualNoteCase title="Math" icon="math" value={4}></IndividualNoteCase>
                </div>
        </div>
    )
}
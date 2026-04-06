interface SocialMedia {
    name: string;
    icon: string;
}

export default function ModulableButton({name, icon}:SocialMedia) {

    return(
        <div className="flex-1">
            <button className="w-full border rounded-lg border-[#DBDBDB] flex items-center justify-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors">
                <img src={`/${icon}.svg`} alt="" className="w-5 h-5"/>
                <span>{name}</span>
            </button>
        </div>
    )
}
interface SocialMedia {
    name: string;
    icon: string;
}

export default function ModulableButton({ name, icon }: SocialMedia) {
    return (
        <button className="w-full h-12 border border-slate-200/80 rounded-2xl flex items-center justify-center gap-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer shadow-xs">
            <img
                src={`/${icon.toLowerCase()}.svg`}
                alt={`${name} icon`}
                className="w-5 h-5 shrink-0 object-contain"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
            <span className="text-xs font-bold text-slate-700 tracking-tight">
                {name}
            </span>
        </button>
    );
}
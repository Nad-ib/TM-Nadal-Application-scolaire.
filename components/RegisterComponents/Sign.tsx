interface signUp {
    name: string;
    onClick?: () => void;
}

export default function Sign({ name, onClick }: signUp) {
    return (
        <button 
            onClick={onClick} 
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
            <span className="text-sm font-bold text-white tracking-tight">
                {name}
            </span>
        </button>
    );
}
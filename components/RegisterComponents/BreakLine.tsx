export default function BreakLine() {
    return (
        <div className="w-full flex flex-row justify-center items-center gap-4 py-1 select-none">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Or with
            </span>
            <div className="flex-1 h-px bg-slate-100"></div>
        </div>
    );
}
interface HeadInfos {
    name: string;
    message: string;
}

export default function HeaderComponents({ name, message }: HeadInfos) {
    return (
        <div className="flex flex-col gap-1.5 ml-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {name}
            </h1>
            <p className="text-sm font-medium text-slate-400 leading-snug">
                {message}
            </p>
        </div>
    );
}
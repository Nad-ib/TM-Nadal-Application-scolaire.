"use client"

interface ValuePossibility {
    value: 1 | 0 | -1;
}

export default function Indicators({ value }: ValuePossibility) {
    const config = {
        1: { color: "bg-[#99F6B4] text-[#166534]", label: "En Hausse", icon: "↗" },
        0: { color: "bg-gray-200 text-gray-600", label: "Stable", icon: "→" },
        "-1": { color: "bg-red-200 text-red-700", label: "En Baisse", icon: "↘" }
    };
    const current = config[value];

    return (
        <div className={`flex items-center gap-1 px-3 py-1 ${current.color} rounded-full text-[10px] font-bold transition-all duration-300`}>
            <span>{current.label}</span>
            <span className="text-xs">{current.icon}</span>
        </div>
    );
}
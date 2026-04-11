"use client";

import BranchHeadLine from "./BrancheComponents/BranchHeadLine";
import ProgressBar from "./BrancheComponents/ProgressBar";

interface BrancheProps {
    title: string;
    icon: string;
    note: number;
    trend: 1 | 0 | -1;
}

export default function Branche({
    title,
    icon,
    note,
    trend,
}: BrancheProps) {
    
    return (
        <div className="w-full max-w-md p-5 bg-white rounded-xl border border-gray-100 shadow-sm h-auto flex flex-col">
            <BranchHeadLine icon={icon} title={title} value={trend} />
            <div className="flex items-center gap-6">
                <span className="text-4xl font-semibold text-gray-800 leading-none">
                    {note.toFixed(1)}
                </span>
                <ProgressBar value={note} />
            </div>
        </div>
    );
}
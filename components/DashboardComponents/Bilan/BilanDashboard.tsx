"use client";

import TrueButton from "./TrueButton";
import FalseButton from "./FalseButton";
import { BookOpen } from "lucide-react";
import { UserObjective } from "@/Backend/services/bilan";

interface BilanDashboardProps {
    data: {
        objectives: UserObjective[];
    };
}

export default function BilanDashboard({ data }: BilanDashboardProps) {
    const objectivesList = data?.objectives || [];

    return (
        <div className="p-3.5 flex flex-col shadow-sm bg-white w-full h-auto justify-start overflow-hidden select-none rounded-xl border border-gray-100/80">
            <div className="w-full flex items-center gap-2 shrink-0 border-b border-gray-50 pb-2.5">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                    <BookOpen size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase truncate">
                        Bilan de promotion
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 justify-start mt-3 w-full">
                {objectivesList.length === 0 ? (
                    <div className="text-center py-4 text-[11px] text-gray-400 font-medium">
                        Aucun objectif configuré
                    </div>
                ) : (
                    objectivesList.map((item) => {
                        const isValid = 
                            item.operator === ">=" || item.operator === "min"
                                ? item.current_value >= item.target_value
                                : item.current_value <= item.target_value;

                        const hasError = !isValid;
                        const displayOperator = item.operator === ">=" || item.operator === "min" ? "min" : "max";

                        return (
                            <div
                                key={item.id}
                                className={`w-full h-9 flex justify-between items-center px-2.5 rounded-lg shrink-0 gap-2 border transition-colors ${
                                    hasError 
                                        ? "bg-red-50/40 border-red-100" 
                                        : "bg-gray-50/40 border-transparent hover:border-gray-100"
                                }`}
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="shrink-0 scale-90 origin-left flex items-center">
                                        {isValid ? <TrueButton /> : <FalseButton />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[12px] font-semibold text-gray-700 truncate block capitalize">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium leading-none">
                                            {displayOperator} {item.target_value}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`text-[12px] font-bold px-2 py-0.5 rounded shrink-0 leading-none ${
                                        hasError
                                            ? "bg-red-50 text-red-600 font-extrabold border border-red-100"
                                            : "text-gray-800 bg-gray-100/60"
                                    }`}
                                >
                                    {item.current_value.toFixed(2).replace(".00", "")}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
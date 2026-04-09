"use client";

import { Pencil, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NoteItemProps {
    id: string;      
    title: string;
    note: number | null; 
    weight: number;
    date: string;
    is_group?: boolean; 
}

export default function NoteItem({ id, title, note, weight, date, is_group = false }: NoteItemProps) {
    
    
    const CardContent = (
        <div className={`w-full p-4 bg-white rounded-2xl shadow-sm border flex flex-col gap-3 transition-colors ${is_group ? 'hover:bg-gray-50 border-blue-100' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                <div className="flex items-center gap-2">
                    
                    {is_group ? (
                        <ChevronRight size={20} className="text-blue-500" />
                    ) : (
                        <>
                            <div className="w-3.5 h-3.5 bg-[#22C55E] rounded-full" />
                            <Pencil size={18} className="text-gray-400 hover:text-gray-900 cursor-pointer" />
                        </>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                    Note:{" "}
                    <span className="font-bold text-gray-800">
                        {note !== null ? note.toFixed(2) : "--"}
                    </span>
                </span>
                <div className="w-px h-3 bg-gray-200" />
                <span>
                    Poids: <span className="font-bold text-gray-800">{weight}</span>
                </span>
                <div className="w-px h-3 bg-gray-200" />
                <span>
                    {is_group ? "Série" : `Date: ${date}`}
                </span>
            </div>
        </div>
    );

   
    if (is_group) {
        return (
            <Link href={`/series/${id}`} className="block w-full">
                {CardContent}
            </Link>
        );
    }

    
    return CardContent;
}

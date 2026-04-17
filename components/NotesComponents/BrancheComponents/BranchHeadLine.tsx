"use client";

import { useState } from "react";
import { Icon } from "@iconify/react"; 
import Indicators from "./Indicators";
import IconPicker from "./IconPicker";
import Portal from "@/components/Portalt";
import { supabase } from "@/Backend/lib/supabase";

interface HeadLineProps {
    branchId: string;
    title: string;
    icon: string; 
    value: 1 | 0 | -1;
    onIconUpdate: (newIcon: string) => void;
}

export default function BranchHeadLine({ branchId, title, icon, value, onIconUpdate }: HeadLineProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleIconSelect = async (newIcon: string) => {
        const { error } = await supabase
            .from("branches")
            .update({ icon: newIcon })
            .eq("id", branchId);

        if (!error) onIconUpdate(newIcon);
    };

    return (
        <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
                <button 
                    onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();  
                        setIsPickerOpen(true);
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
                >
                    <Icon icon={icon || "mdi:folder"} className="text-2xl" />
                </button>
                <span className="text-xl font-bold text-gray-800">{title}</span>
            </div>
            <Indicators value={value} />

            {isPickerOpen && (
                <Portal>
                    <IconPicker 
                        onSelect={handleIconSelect} 
                        onClose={() => setIsPickerOpen(false)} 
                    />
                </Portal>
            )}
        </div>
    );
}
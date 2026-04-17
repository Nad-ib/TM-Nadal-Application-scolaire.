"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface IconPickerProps {
    onSelect: (iconName: string) => void;
    onClose: () => void;
}

export default function IconPicker({ onSelect, onClose }: IconPickerProps) {
    const [search, setSearch] = useState("");
    const [icons, setIcons] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIcons = async () => {
            const query = search.trim() || "education";
            setLoading(true);
            
            try {
                const res = await fetch(`https://api.iconify.design/search?query=${query}&limit=32`);
                
                if (!res.ok) throw new Error("Erreur API");

                const data = await res.json();
                setIcons(data.icons || []);
            } catch (err) {
                console.error("Erreur Iconify:", err);
                setIcons([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchIcons, 400); 
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div 
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-125" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b">
                    <div className="relative">
                        <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Rechercher (ex: math, music...)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 text-gray-800 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">Chargement...</p>
                        </div>
                    ) : icons.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {icons.map((iconName) => (
                                <button
                                    key={iconName}
                                    onClick={() => {
                                        onSelect(iconName);
                                        onClose();
                                    }}
                                    className="aspect-square flex items-center justify-center hover:bg-blue-50 rounded-2xl transition-all hover:scale-110 group"
                                >
                                    <Icon icon={iconName} className="text-3xl text-gray-600 group-hover:text-blue-600" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Aucun résultat trouvé
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={onClose} 
                    className="p-4 text-xs text-gray-400 hover:text-gray-600 uppercase font-bold tracking-widest border-t transition-colors"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}
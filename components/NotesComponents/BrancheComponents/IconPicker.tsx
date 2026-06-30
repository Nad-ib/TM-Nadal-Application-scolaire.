"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface IconPickerProps {
    initialQuery?: string;
    onSelect: (iconName: string) => void;
    onClose: () => void;
}

export default function IconPicker({ initialQuery = "", onSelect, onClose }: IconPickerProps) {
    const [search, setSearch] = useState("");
    const [icons, setIcons] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIcons = async () => {
            const query = search.trim() || initialQuery.trim() || "education";
            setLoading(true);

            try {
                const res = await fetch(
                    `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=32`,
                );
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

        const timer = setTimeout(fetchIcons, 300);
        return () => clearTimeout(timer);
    }, [search, initialQuery]);

    return (
        <div
            className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 transition-all"
            onClick={onClose}>
            <div
                className="bg-white rounded-t-4xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[85vh] sm:h-125 max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}>
                
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 sm:hidden shrink-0" />

                <div className="px-5 pb-4 pt-2 sm:pt-5 border-b border-gray-100 shrink-0">
                    <div className="relative">
                        <Icon
                            icon="mdi:magnify"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Rechercher (ex: math, music...)"
                            className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-gray-50 rounded-2xl outline-none focus:bg-gray-100/80 focus:ring-2 ring-black/5 text-gray-800 text-base transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-none overscroll-contain">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-3">
                            <div className="w-7 h-7 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-xs font-medium">Chargement...</p>
                        </div>
                    ) : icons.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4 sm:gap-3">
                            {icons.map((iconName) => (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onSelect(iconName);
                                        onClose();
                                    }}
                                    className="aspect-square flex items-center justify-center bg-gray-50/50 active:bg-gray-100 sm:hover:bg-gray-100 rounded-2xl transition-all active:scale-90 sm:hover:scale-105 group">
                                    <Icon
                                        icon={iconName}
                                        className="text-3xl text-gray-700 transition-colors"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                            Aucun résultat trouvé
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 pb-safe sm:pb-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3.5 sm:py-2.5 bg-white sm:bg-transparent border border-gray-200 sm:border-none text-sm text-gray-500 active:text-gray-800 sm:hover:text-gray-800 font-semibold rounded-xl uppercase tracking-wider transition-colors">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}
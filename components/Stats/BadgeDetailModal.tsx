"use client";

import { Badge } from "@/Backend/services/gamification"

interface BadgeDetailModalProps {
    selectedBadge: Badge;
    onClose: () => void;
}

export default function BadgeDetailModal({ selectedBadge, onClose }: BadgeDetailModalProps) {
    return (
        <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-end justify-center p-4 transition-all duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-md rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col items-center text-center transform transition-transform duration-300 animate-in slide-in-from-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-10 h-1 bg-slate-200 rounded-full mb-4" />
                
                <div className={`text-4xl p-4 rounded-2xl mb-3 shadow-inner relative ${
                    selectedBadge.xp_reward >= 500 ? "bg-amber-50 border border-amber-100 text-amber-500" : "bg-slate-50 border border-slate-100"
                }`}>
                    {selectedBadge.icon || "🏅"}
                </div>
                
                <h3 className="text-sm font-black text-slate-800 tracking-tight">{selectedBadge.name}</h3>
                
                {selectedBadge.role && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1">
                        {selectedBadge.role}
                    </span>
                )}
                
                <p className="text-[11px] text-slate-500 font-medium mt-2 max-w-60 leading-relaxed">
                    {selectedBadge.description || "Insigne officiel de validation de jalon académique."}
                </p>
                
                <div className={`mt-4 px-3 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase border ${
                    selectedBadge.xp_reward >= 500 
                        ? "bg-amber-50 border-amber-200 text-amber-600" 
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                }`}>
                    +{selectedBadge.xp_reward} points d'effort
                </div>
                
                <button 
                    onClick={onClose}
                    className="mt-5 w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold active:scale-98 transition-transform cursor-pointer"
                >
                    Continuer l'apprentissage
                </button>
            </div>
        </div>
    );
}
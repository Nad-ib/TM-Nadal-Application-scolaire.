"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useModuleExploration } from "@/Backend/services/useModuleExploration";
import { supabase } from "@/Backend/lib/supabase";
import { updatePlayerStreak } from "@/Backend/services/gamification";

export default function XpTracker() {
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function fetchSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                setUserId(session.user.id);
                await updatePlayerStreak(session.user.id);
            }
        }
        
        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user?.id) {
                setUserId(session.user.id);
                await updatePlayerStreak(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const getModuleName = (path: string) => {
        if (path === "/dashboard") return "Dashboard";
        
        const segments = path.split("/").filter(Boolean);
        
        if (segments.length !== 1) return null;
        
        const lastSegment = segments[0];
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    const moduleName = getModuleName(pathname);
    
    const { notification, setNotification } = useModuleExploration(userId, moduleName || "");

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);

    if (!notification || !moduleName) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm overflow-hidden rounded-2xl border border-indigo-100/80 bg-white/95 backdrop-blur-md p-4 pr-10 shadow-[0_10px_30px_rgba(79,70,229,0.15)] transition-all animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center gap-3.5 pb-1">
                <div className="flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white font-black text-sm tracking-tight shadow-[0_4px_10px_rgba(79,70,229,0.3)] border border-indigo-400/20">
                    +50
                </div>
                
                <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600/90">
                        Exploration validée !
                    </p>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                        Tu as découvert le module <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 font-extrabold">{moduleName}</span>
                    </p>
                </div>
            </div>

            <button 
                onClick={() => setNotification(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-indigo-500 to-violet-600 w-full animate-shrink-horizontal ease-linear" />
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import { addXp } from "@/Backend/services/xpService";

export function useModuleExploration(userId: string | undefined, moduleName: string) {
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        
        if (
            !moduleName || 
            moduleName.trim() === "" || 
            /\d/.test(moduleName) || 
            moduleName.toLowerCase() === "dashboard" 
        ) {
            return;
        }

        const activeUserId = userId;

        async function triggerExploration() {
            const { data: alreadyRewarded, error } = await supabase
                .from("xp_history")
                .select("id")
                .eq("user_id", activeUserId)
                .eq("category", "exploration")
                .ilike("description", `%${moduleName}%`)
                .maybeSingle();

            if (error) {
                console.error("Erreur de vérification XP:", error);
                return;
            }

            if (alreadyRewarded) {
                return;
            }

            await addXp({
                userId: activeUserId,
                points: 50,
                category: "exploration",
                description: `Première visite du module ${moduleName}`
            });
            
            setNotification(`+50 XP : Module ${moduleName} exploré ! 🚀`);
        }

        triggerExploration();
    }, [userId, moduleName]);

    return { notification, setNotification };
}
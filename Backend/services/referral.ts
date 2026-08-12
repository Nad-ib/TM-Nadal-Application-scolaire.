import { supabase } from "@/Backend/lib/supabase";
import { syncCreateNoteObjective, syncStreakObjective } from "@/Backend/services/objectives";

interface ProcessReferralParams {
    referrerId: string; 
    referredId: string; 
}


export const processReferralReward = async ({ referrerId, referredId }: ProcessReferralParams) => {
    try {
       
        const { data: existingReferral } = await supabase
            .from("referrals")
            .select("id")
            .eq("referred_id", referredId)
            .single();

        if (existingReferral) {
            return { success: false, message: "Parrainage déjà pris en compte." };
        }

       
        const { error: referralError } = await supabase
            .from("referrals")
            .insert({
                referrer_id: referrerId,
                referred_id: referredId,
                status: "completed",
            });

        if (referralError) throw referralError;

      
        const { data: referrerProfile } = await supabase
            .from("profiles")
            .select("xp, league_points")
            .eq("id", referrerId)
            .single();

        if (referrerProfile) {
            await supabase
                .from("profiles")
                .update({
                    xp: (referrerProfile.xp || 0) + 100,
                    league_points: (referrerProfile.league_points || 0) + 50,
                })
                .eq("id", referrerId);
        }

       
        await validateActionQuest(referrerId, "refer_friend");

        return { success: true, message: "Récompenses attribuées avec succès !" };
    } catch (error) {
        console.error("Erreur validation parrainage :", error);
        return { success: false, error };
    }
};


export const validateActionQuest = async (
    userId: string,
    actionType: "create_note" | "streak_target" | "refer_friend" | "level_up_account",
    amount: number = 1
) => {
    try {
        switch (actionType) {
            case "create_note":
                await syncCreateNoteObjective(userId, amount);
                break;
            case "streak_target":
                await syncStreakObjective(userId);
                break;
            case "refer_friend":
               
                break;
            default:
                break;
        }
        return { success: true };
    } catch (error) {
        console.error(`Erreur validation quête (${actionType}) :`, error);
        return { success: false, error };
    }
};
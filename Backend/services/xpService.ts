import { supabase } from "@/Backend/lib/supabase";

interface AddXpParams {
    userId: string;
    points: number;
    category: "streak" | "exploration" | "objective" | "notes";
    description: string;
}

export async function addXp({ userId, points, category, description }: AddXpParams) {
    if (!userId) return { error: "User ID manquant" };

    const { error } = await supabase.rpc("add_user_xp", {
        p_user_id: userId,
        p_points: points,
        p_category: category,
        p_description: description
    });

    if (error) {
        console.error("Erreur lors de l'ajout d'XP:", error);
        return { success: false, error };
    }

    return { success: true };
}
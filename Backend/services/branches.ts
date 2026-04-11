import { supabase } from "../lib/supabase";

export const getBranches = async () => {
    const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return data;
};

export const createBranch = async (name: string, userId: string) => {
    const { data, error } = await supabase
        .from("branches")
        .insert([{ name: name, user_id: userId }])
        .select();

    if (error) throw error;
    return data;
};

export const getSeriesAverage = async (seriesId: string): Promise<number | null> => {
    const { data, error } = await supabase
        .from("moyennes_series")
        .select("moyenne_serie")
        .eq("parent_id", seriesId)
        .maybeSingle();

    if (error) {
        console.error(`Erreur moyenne série ${seriesId}:`, error.message);
        return null;
    }

    return data?.moyenne_serie ?? null;
};

export const getBranchAverage = async (branchId: string): Promise<number | null> => {
    const { data, error } = await supabase
        .from("moyenne_branches")
        .select("moyenne_globale")
        .eq("branch_id", branchId)
        .maybeSingle();

    if (error) {
        console.error(`Erreur moyenne branche ${branchId}:`, error.message);
        return null;
    }

    return data?.moyenne_globale ?? null;
};

export const deleteBranch = async (branchId: string) => {
    const { error } = await supabase.from("branches").delete().eq("id", branchId);
    if (error) throw error;
};

export const getBranchTrend = async (branchId: string): Promise<number> => {
    const { data } = await supabase
        .from("branche_tendances")
        .select("tendance")
        .eq("branch_id", branchId)
        .maybeSingle();
    return data?.tendance ?? 0;
};

export const getGlobalAverage = async (): Promise<number> => {
    const { data } = await supabase
        .from("moyenne_generale")
        .select("moyenne_totale")
        .maybeSingle();
    return data?.moyenne_totale ?? 0;
};

export const getLatestBranches = async (limit: number = 2) => {
    const { data } = await supabase
        .from("branches")
        .select("id, name")
        .order("created_at", { ascending: false })
        .limit(limit);
    
    if (!data) return [];

    return await Promise.all(data.map(async (b) => {
        const avg = await getBranchAverage(b.id);
        return { ...b, average: avg || 0 };
    }));
};
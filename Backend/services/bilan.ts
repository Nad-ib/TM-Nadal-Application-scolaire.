import { supabase } from "@/Backend/lib/supabase";

export interface UserObjective {
    id: string;
    user_id: string;
    title: string;
    label?: string;
    target_value: number;
    current_value: number;
    operator: string;
    group_type: string;
    created_at?: string;
}

export async function getUserObjectives(userId: string): Promise<UserObjective[]> {
    const { data, error } = await supabase
        .from("user_objectives")
        .select("*")
        .eq("user_id", userId)
        .neq("group_type", "daily_quest"); 
        
    if (error) throw error;
    return data || [];
}

export async function deleteObjective(id: string): Promise<void> {
    const { error } = await supabase
        .from("user_objectives")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

export async function addObjectiveCustom(
    userId: string,
    title: string,
    targetValue: number,
    operator: string
): Promise<UserObjective | null> {
    const { data, error } = await supabase
        .from("user_objectives")
        .insert([
            {
                user_id: userId,
                title: title,
                target_value: targetValue,
                current_value: 0,
                operator,
                group_type: "custom",
            },
        ])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export function computeLocalObjectiveValue(obj: UserObjective, branches: any[], customGroups: any[]): number {
    const titleText = obj.title || obj.label || "";
    const labelLower = titleText.toLowerCase();

    if (labelLower.includes("insuffisante") || labelLower.includes("négatif")) {
        return branches.reduce((acc, b) => 
            (b.average > 0 && b.average < 4) ? acc + (4 - b.average) : acc, 0
        );
    }

    if (labelLower.includes("somme") || labelLower.includes("total")) {
        let groupName = labelLower
            .replace(/somme\s*groupe\s*:\s*/g, "")
            .replace(/total\s*/g, "")
            .replace(/\s*groupe/g, "")
            .trim();

        const targetGroup = customGroups.find(g => {
            const gName = g.name.toLowerCase().trim();
            return gName === groupName || gName.includes(groupName) || groupName.includes(gName);
        });

        if (targetGroup) {
            if (targetGroup.total_points !== undefined && targetGroup.total_points !== null && targetGroup.total_points !== 0) {
                return targetGroup.total_points;
            }
            
            return branches
                .filter(b => {
                    if (b.group_id === targetGroup.id) return true;
                    if (Array.isArray(b.group_ids) && b.group_ids.includes(targetGroup.id)) return true;
                    if (Array.isArray(b.group_branches)) {
                        return b.group_branches.some((gb: any) => gb.group_id === targetGroup.id);
                    }
                    return false;
                })
                .reduce((acc, b) => acc + (b.average || 0), 0);
        }
        return 0;
    }

    if (labelLower.includes("groupe :")) {
        const groupName = titleText.replace(/Groupe\s*:\s*/i, "").toLowerCase().trim();
        const targetGroup = customGroups.find(g => g.name.toLowerCase().trim() === groupName);
        return targetGroup?.average || 0;
    }

    if (labelLower.includes("générale") || labelLower.includes("global")) {
        const validBranches = branches.filter(b => b.average > 0);
        if (validBranches.length === 0) return 0;
        return validBranches.reduce((acc, curr) => acc + curr.average, 0) / validBranches.length;
    }

    const matchedBranch = branches.find(b => labelLower.includes(b.name.toLowerCase()));
    if (matchedBranch) return matchedBranch.average || 0;

    return Number(obj.current_value) || 0;
}

export async function getDashboardObjectives(userId: string): Promise<UserObjective[]> {
    const { data } = await supabase
        .from("user_objectives")
        .select("*")
        .eq("user_id", userId)
        .neq("group_type", "daily_quest"); 
    return data || [];
}
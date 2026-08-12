import { supabase } from "../lib/supabase";

interface QuestTemplate {
    action_type: string;
    title_template: (subject: string, target: number) => string;
    generate_target: () => number;
    xp_per_unit: number;
    league_per_unit: number;
}

interface UserMetrics {
    subject: string;
    difficulty: string;
}

interface UserObjectivePayload {
    user_id: string;
    action_type: string;
    title: string;
    current_value: number;
    target_value: number;
    xp_reward: number;
    league_points_reward: number;
    is_completed: boolean;
    group_type: string;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
    {
        action_type: "streak_target",
        title_template: (_: string, target: number) =>
            `Focus intense : Atteins une série de ${target} jour${target > 1 ? "s" : ""} actif${target > 1 ? "s" : ""}`,
        generate_target: () => Math.floor(Math.random() * 5) + 1,
        xp_per_unit: 25,
        league_per_unit: 10,
    },
    {
        action_type: "create_note",
        title_template: (_: string, target: number) =>
            `Prise de note : Ajoute ${target} nouvelle${target > 1 ? "s" : ""} note${target > 1 ? "s" : ""} de cours`,
        generate_target: () => Math.floor(Math.random() * 3) + 1,
        xp_per_unit: 40,
        league_per_unit: 15,
    },
    {
        action_type: "level_up_account",
        title_template: () => `Ascension Majeure : Passe au niveau supérieur`,
        generate_target: () => 1,
        xp_per_unit: 500,
        league_per_unit: 300,
    },
];

export const generateSecureObjectives = async (
    userId: string,
    userMetrics: UserMetrics = { subject: "Général", difficulty: "Standard" }
) => {
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("streak_count, xp, league_points")
            .eq("id", userId)
            .single();

        const currentStreak = profile?.streak_count || 0;

        const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
        const selectedTemplates = shuffled.slice(0, 3);

        const payload: UserObjectivePayload[] = selectedTemplates.map((template) => {
            const target = template.generate_target();

            let initialValue = 0;
            let isCompleted = false;

            if (template.action_type === "streak_target") {
                initialValue = Math.min(currentStreak, target);
                isCompleted = currentStreak >= target;
            }

            return {
                user_id: userId,
                action_type: template.action_type,
                title: template.title_template(userMetrics.subject, target),
                current_value: initialValue,
                target_value: target,
                xp_reward: target * template.xp_per_unit,
                league_points_reward: target * template.league_per_unit,
                is_completed: isCompleted,
                group_type: "daily_quest",
            };
        });

        await supabase
            .from("user_objectives")
            .delete()
            .eq("user_id", userId)
            .eq("group_type", "daily_quest")
            .eq("is_completed", false);

        const { data: insertedData, error } = await supabase
            .from("user_objectives")
            .insert(payload)
            .select();

        if (error) throw error;

        const completedQuests = payload.filter((q) => q.is_completed);
        if (completedQuests.length > 0 && profile) {
            const bonusXp = completedQuests.reduce((acc, q) => acc + q.xp_reward, 0);
            const bonusLeaguePoints = completedQuests.reduce(
                (acc, q) => acc + q.league_points_reward,
                0
            );

            await supabase
                .from("profiles")
                .update({
                    xp: (profile.xp || 0) + bonusXp,
                    league_points: (profile.league_points || 0) + bonusLeaguePoints,
                })
                .eq("id", userId);
        }

        return insertedData;
    } catch (error) {
        console.error("Erreur lors de la génération des objectifs :", error);
        return [];
    }
};

export const getUserObjectives = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from("user_objectives")
            .select("*")
            .eq("user_id", userId)
            .eq("group_type", "daily_quest");

        if (error) return [];

        return data || [];
    } catch (error) {
        console.error("Erreur récupération des objectifs :", error);
        return [];
    }
};

export const syncStreakObjective = async (userId: string) => {
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("streak_count, xp, league_points")
            .eq("id", userId)
            .single();

        if (!profile) return;

        const currentStreak = profile.streak_count || 0;

        const { data: quests } = await supabase
            .from("user_objectives")
            .select("*")
            .eq("user_id", userId)
            .eq("group_type", "daily_quest")
            .eq("action_type", "streak_target")
            .eq("is_completed", false);

        if (!quests || quests.length === 0) return;

        for (const quest of quests) {
            const newCurrent = Math.min(currentStreak, quest.target_value);
            const isCompleted = currentStreak >= quest.target_value;

            await supabase
                .from("user_objectives")
                .update({
                    current_value: newCurrent,
                    is_completed: isCompleted,
                })
                .eq("id", quest.id);

            if (isCompleted) {
                await supabase
                    .from("profiles")
                    .update({
                        xp: (profile.xp || 0) + quest.xp_reward,
                        league_points:
                            (profile.league_points || 0) + quest.league_points_reward,
                    })
                    .eq("id", userId);
            }
        }
    } catch (error) {
        console.error("Erreur synchro streak objective :", error);
    }
};

export const syncCreateNoteObjective = async (
    userId: string,
    countAdded: number = 1
) => {
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("xp, league_points")
            .eq("id", userId)
            .single();

        if (!profile) return;

        const { data: quests } = await supabase
            .from("user_objectives")
            .select("*")
            .eq("user_id", userId)
            .eq("group_type", "daily_quest")
            .eq("action_type", "create_note")
            .eq("is_completed", false);

        if (!quests || quests.length === 0) return;

        for (const quest of quests) {
            const newCurrent = Math.min(
                quest.current_value + countAdded,
                quest.target_value
            );
            const isCompleted = newCurrent >= quest.target_value;

            await supabase
                .from("user_objectives")
                .update({
                    current_value: newCurrent,
                    is_completed: isCompleted,
                })
                .eq("id", quest.id);

            if (isCompleted) {
                await supabase
                    .from("profiles")
                    .update({
                        xp: (profile.xp || 0) + quest.xp_reward,
                        league_points:
                            (profile.league_points || 0) + quest.league_points_reward,
                    })
                    .eq("id", userId);
            }
        }
    } catch (error) {
        console.error("Erreur synchro note objective :", error);
    }
};

export const syncLevelUpAccountObjective = async (
    userId: string,
    hasLeveledUp: boolean = true
) => {
    if (!hasLeveledUp) return;

    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("xp, league_points")
            .eq("id", userId)
            .single();

        if (!profile) return;

        const { data: quests } = await supabase
            .from("user_objectives")
            .select("*")
            .eq("user_id", userId)
            .eq("group_type", "daily_quest")
            .eq("action_type", "level_up_account")
            .eq("is_completed", false);

        if (!quests || quests.length === 0) return;

        for (const quest of quests) {
            await supabase
                .from("user_objectives")
                .update({
                    current_value: 1,
                    is_completed: true,
                })
                .eq("id", quest.id);

            await supabase
                .from("profiles")
                .update({
                    xp: (profile.xp || 0) + quest.xp_reward,
                    league_points:
                        (profile.league_points || 0) + quest.league_points_reward,
                })
                .eq("id", userId);
        }
    } catch (error) {
        console.error("Erreur synchro level up objective :", error);
    }
};
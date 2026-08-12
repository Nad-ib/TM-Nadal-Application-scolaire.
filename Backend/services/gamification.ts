import { supabase } from "../lib/supabase";
import { syncLevelUpAccountObjective } from "@/Backend/services/objectives";

export interface Badge {
    id: string;
    name: string;
    role?: string;
    description: string;
    icon: string;
    xp_reward: number;
}

export const MOCK_BADGES: Badge[] = [
    { 
        id: "b1", 
        name: "Leonhard Euler", 
        role: "Mathématicien suisse", 
        description: "Père de la théorie des graphes et des notations mathématiques modernes.", 
        icon: "📐", 
        xp_reward: 500 
    },
    { 
        id: "b2", 
        name: "Guillaume Tell", 
        role: "Héros populaire suisse", 
        description: "Symbole de la précision absolue et de la quête de liberté.", 
        icon: "🏹", 
        xp_reward: 150 
    },
    { 
        id: "b3", 
        name: "Jean Piaget", 
        role: "Psychologue & Épistémologue suisse", 
        description: "Pionnier de l'étude du développement de l'intelligence chez l'enfant.", 
        icon: "🧠", 
        xp_reward: 300 
    },
    { 
        id: "b4", 
        name: "Daniel Bernoulli", 
        role: "Physicien suisse", 
        description: "A découvert la mécanique des fluides et le principe de sustentation.", 
        icon: "🌊", 
        xp_reward: 350 
    },
    { 
        id: "b5", 
        name: "Auguste Piccard", 
        role: "Physicien & Explorateur suisse", 
        description: "Inventeur du bathyscaphe et pionnier de l'exploration stratosphérique.", 
        icon: "🎈", 
        xp_reward: 400 
    },
    { 
        id: "b6", 
        name: "Albert Einstein", 
        role: "Physicien théorique (Berne/Zurich)", 
        description: "A formulé la théorie de la relativité restreinte durant ses années à Berne.", 
        icon: "⚛️", 
        xp_reward: 600 
    },
    { 
        id: "b7", 
        name: "Isaac Newton", 
        role: "Physicien & Mathématicien", 
        description: "A établi la loi de la gravitation universelle et le calcul infinitésimal.", 
        icon: "🍎", 
        xp_reward: 500 
    },
    { 
        id: "b8", 
        name: "Marie Curie", 
        role: "Physicienne & Chimiste", 
        description: "Pionnière de la radioactivité et seule femme double Prix Nobel.", 
        icon: "🧪", 
        xp_reward: 550 
    },
    { 
        id: "b9", 
        name: "Ada Lovelace", 
        role: "Pionnière de l'informatique", 
        description: "Autrice du tout premier programme informatique de l'histoire.", 
        icon: "💻", 
        xp_reward: 450 
    },
    { 
        id: "b10", 
        name: "Galilée", 
        role: "Astronome & Physicien", 
        description: "Père de l'astronomie observationnelle et de la méthode scientifique.", 
        icon: "🔭", 
        xp_reward: 400 
    }
];

export const MOCK_USER_BADGES = [
    { id: "ub1", badge_id: "b1", created_at: "2026-01-01" },
    { id: "ub2", badge_id: "b2", created_at: "2026-01-02" },
    { id: "ub3", badge_id: "b6", created_at: "2026-01-03" },
];

export const getRequiredXpForNextLevel = (level: number): number => {
    if (level >= 100) return 10000;
    return Math.round(100 + 0.99 * Math.pow(level, 2));
};

export const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    let totalXp = 0;
    for (let i = 1; i < level; i++) {
        totalXp += getRequiredXpForNextLevel(i);
    }
    return totalXp;
};

export const getLevelFromXp = (xp: number): number => {
    let level = 1;
    while (xp >= getXpForLevel(level + 1)) {
        level++;
    }
    return level;
};

export const getXpPercentage = (xp: number): number => {
    const currentLevel = getLevelFromXp(xp);
    const xpForCurrent = getXpForLevel(currentLevel);
    const xpForNext = getXpForLevel(currentLevel + 1);
    const totalRequiredForLevel = xpForNext - xpForCurrent;
    const currentLevelProgress = xp - xpForCurrent;
    return totalRequiredForLevel > 0 ? currentLevelProgress / totalRequiredForLevel : 0;
};

export const getXpInCurrentLevel = (xp: number): number => {
    const currentLevel = getLevelFromXp(xp);
    return xp - getXpForLevel(currentLevel);
};

export const addXpToUser = async (userId: string, xpToAdd: number) => {
    try {
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("xp")
            .eq("id", userId)
            .single();

        if (error || !profile) throw error;

        const oldXp = profile.xp || 0;
        const newXp = oldXp + xpToAdd;

        const oldLevel = getLevelFromXp(oldXp);
        const newLevel = getLevelFromXp(newXp);

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ xp: newXp })
            .eq("id", userId);

        if (updateError) throw updateError;

        if (newLevel > oldLevel) {
            await syncLevelUpAccountObjective(userId, true);
        }

        return { success: true, newXp, newLevel, leveledUp: newLevel > oldLevel };
    } catch (e) {
        console.error("Erreur lors de l'ajout d'XP:", e);
        return { success: false };
    }
};

export const getUserGamification = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("xp, streak_count, last_activity, xp_start_of_week")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw error;
        return data ?? { xp: 0, streak_count: 0, last_activity: null, xp_start_of_week: 0 };
    } catch (e) {
        console.error("Erreur SQL profils:", e);
        return { xp: 0, streak_count: 0, last_activity: null, xp_start_of_week: 0 };
    }
};

export const updatePlayerStreak = async (userId: string) => {
    try {
        const { data: profile, error: fetchError } = await supabase
            .from("profiles")
            .select("streak_count, last_activity, xp")
            .eq("id", userId)
            .maybeSingle();

        if (fetchError || !profile) return null;

        const todayStr = new Date().toISOString().split("T")[0];
        const currentXp = profile.xp || 0;
        
        if (!profile.last_activity) {
            await supabase
                .from("profiles")
                .update({ streak_count: 1, last_activity: todayStr, xp_start_of_week: currentXp })
                .eq("id", userId);
            return { streakCount: 1 };
        }

        const lastActivityDate = new Date(profile.last_activity);
        const todayDate = new Date(todayStr);
        
        const diffTime = todayDate.getTime() - lastActivityDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = profile.streak_count || 0;
        let updatePayload: any = { last_activity: todayStr };

        if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        } else {
            return { streakCount: newStreak };
        }

        updatePayload.streak_count = newStreak;

        const currentDay = new Date().getDay();
        if (currentDay === 1 || diffDays > 6) {
            updatePayload.xp_start_of_week = currentXp;
        }

        await supabase
            .from("profiles")
            .update(updatePayload)
            .eq("id", userId);

        return { streakCount: newStreak };
    } catch (e) {
        console.error("Erreur lors de la mise à jour de la streak:", e);
        return null;
    }
};

export const getBadgesList = async () => {
    return MOCK_BADGES;
};

export const getUserBadges = async (userId: string) => {
    return MOCK_USER_BADGES;
};

export const getFullGamificationDashboard = async (userId: string) => {
    const [profileStats, badgesObtained, allAvailableBadges] = await Promise.all([
        getUserGamification(userId),
        getUserBadges(userId),
        getBadgesList(),
    ]);

    const todayStr = new Date().toISOString().split("T")[0];
    const lastActivityStr = profileStats?.last_activity;
    
    let isStreakActiveToday = false;
    if (lastActivityStr) {
        const diffTime = new Date(todayStr).getTime() - new Date(lastActivityStr).getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
            isStreakActiveToday = true;
        }
    }

    const currentStreakCount = isStreakActiveToday ? (profileStats?.streak_count ?? 0) : 0;

    const daysName = ["L", "M", "M", "J", "V"];
    const currentDayIndex = new Date().getDay(); 
    
    const currentWeekHistory = daysName.map((day, index) => {
        const dayPosition = index + 1;
        return {
            dayName: day,
            isCompleted: dayPosition === currentDayIndex && isStreakActiveToday
        };
    });

    const currentXp = profileStats?.xp ?? 0;
    const startXp = profileStats?.xp_start_of_week ?? 0;
    let weeklyProgressPercentage = 0;

    if (startXp > 0) {
        weeklyProgressPercentage = Math.round(((currentXp - startXp) / startXp) * 100);
    } else if (currentXp > 0) {
        weeklyProgressPercentage = 100;
    }

    return {
        stats: {
            xp: currentXp,
            streak_count: currentStreakCount,
            week_history: currentWeekHistory,
            weekly_growth: weeklyProgressPercentage
        },
        badgesObtained: badgesObtained,
        allBadges: allAvailableBadges,
    };
};

export const getLeaderboard = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, gamertag, xp")
        .not("gamertag", "is", null) 
        .order("xp", { ascending: false }) 
        .limit(20); 

    if (error) throw error;
    return data ?? [];
};
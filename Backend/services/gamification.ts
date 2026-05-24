import { supabase } from "../lib/supabase";

const XP_PER_LEVEL = 1000;

const MOCK_BADGES = [
    { id: "b1", name: "Guardian", description: "Protège tes acquis", icon: "🛡️", xp_reward: 100 },
    { id: "b2", name: "Tech Expert", description: "Maîtrise le code", icon: "💾", xp_reward: 200 },
    { id: "b3", name: "Data Weaver", description: "Dompte les flux de données", icon: "🌐", xp_reward: 300 },
    { id: "b4", name: "Ninja", description: "Discret et efficace", icon: "🥷", xp_reward: 400 },
    { id: "b5", name: "Apprenti", description: "Premier pas", icon: "👨‍🎓", xp_reward: 50 },
    { id: "b6", name: "Expert", description: "Le sommet", icon: "🚀", xp_reward: 500 },
];
const MOCK_USER_BADGES = [
    { id: "ub1", badge_id: "b1", created_at: "2026-01-01" },
    { id: "ub2", badge_id: "b2", created_at: "2026-01-02" },
    { id: "ub3", badge_id: "b3", created_at: "2026-01-03" },
];

export const getUserGamification = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", userId)
        .maybeSingle();

    if (error) throw error;
    return data ?? { xp: 0 };
};

export const getLevelFromXp = (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const getXpInCurrentLevel = (xp: number): number => {
    return xp % XP_PER_LEVEL;
};

export const getXpPercentage = (xp: number): number => {
    return getXpInCurrentLevel(xp) / XP_PER_LEVEL;
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

    return {
        stats: profileStats,
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
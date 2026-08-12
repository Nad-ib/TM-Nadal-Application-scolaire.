import { supabase } from "@/Backend/lib/supabase";

export async function updatePlayerStreak(userId: string) {
	const { data: profile, error: fetchError } = await supabase
		.from("profiles")
		.select("streak_count, last_activity")
		.eq("id", userId)
		.single();

	if (fetchError || !profile) return null;

	const today = new Date().toISOString().split("T")[0];

	if (!profile.last_activity) {
		await supabase
			.from("profiles")
			.update({ streak_count: 1, last_activity: today })
			.eq("id", userId);
		return { streakCount: 1 };
	}

	const lastActivityDate = new Date(profile.last_activity);
	const todayDate = new Date(today);

	const diffTime = todayDate.getTime() - lastActivityDate.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	let newStreak = profile.streak_count || 0;

	if (diffDays === 1) {
		newStreak += 1;
	} else if (diffDays > 1) {
		newStreak = 1;
	} else {
		return { streakCount: newStreak };
	}

	await supabase
		.from("profiles")
		.update({ streak_count: newStreak, last_activity: today })
		.eq("id", userId);

	return { streakCount: newStreak };
}

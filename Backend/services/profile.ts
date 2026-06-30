import { supabase } from "../lib/supabase";

export interface ProfileData {
	gamertag: string;
	full_name: string;
	avatar_url?: string;
}

export const getProfile = async (
	userId: string,
): Promise<ProfileData | null> => {
	const { data, error } = await supabase
		.from("profiles")
		.select("gamertag, full_name, avatar_url")
		.eq("id", userId)
		.maybeSingle();

	if (error) throw error;
	return data;
};

export const updateProfile = async (
	userId: string,
	updates: Partial<ProfileData>,
) => {
	const { data, error } = await supabase
		.from("profiles")
		.update(updates)
		.eq("id", userId)
		.select();

	if (error) throw error;

	if (!data || data.length === 0) {
		throw new Error(
			"Mise à jour impossible. Vérifie tes politiques RLS sur Supabase.",
		);
	}

	return data[0];
};

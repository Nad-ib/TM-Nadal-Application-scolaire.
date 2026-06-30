import { useState, useEffect } from "react";
import { supabase } from "@/Backend/lib/supabase";

export function useProfile() {
	const [name, setName] = useState("Utilisateur");
	const [avatarUrl, setAvatarUrl] = useState("/buisnessman.svg");

	useEffect(() => {
		async function getProfile() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data } = await supabase
					.from("profiles")
					.select("full_name, avatar_url")
					.eq("id", user.id)
					.single();

				if (data) {
					if (data.full_name) setName(data.full_name);
					if (data.avatar_url) setAvatarUrl(data.avatar_url);
				}
			}
		}
		getProfile();
	}, []);

	return { name, avatarUrl };
}

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

export const deleteBranch = async (branchId: string) => {
	const { error } = await supabase.from("branches").delete().eq("id", branchId);
	if (error) throw error;
};

export const deleteNote = async (id: string) => {
	const { error } = await supabase.from("notes").delete().eq("id", id);
	if (error) throw error;
};

export const getBranchAverage = async (
	branchId: string,
): Promise<number | null> => {
	const { data, error } = await supabase
		.from("moyenne_branches")
		.select("moyenne_globale")
		.eq("branch_id", branchId)
		.maybeSingle();
	return error ? null : (data?.moyenne_globale ?? null);
};

export const getBranchTrend = async (branchId: string): Promise<number> => {
	const { data } = await supabase
		.from("branche_tendances")
		.select("tendance")
		.eq("branch_id", branchId)
		.maybeSingle();
	return data?.tendance ?? 0;
};

export const getSeriesAverage = async (
	seriesId: string,
): Promise<number | null> => {
	const { data, error } = await supabase
		.from("moyennes_series")
		.select("moyenne_serie")
		.eq("parent_id", seriesId)
		.maybeSingle();
	return error ? null : (data?.moyenne_serie ?? null);
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
		.select("id, name, icon")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (!data) return [];

	return await Promise.all(
		data.map(async (b) => {
			const avg = await getBranchAverage(b.id);
			return { ...b, average: avg || 0 };
		}),
	);
};

export const fetchBranchesWithData = async () => {
	const { data: rawBranches, error } = await supabase
		.from("branches")
		.select("*, group_branches(group_id)")
		.order("name", { ascending: true });

	if (error) throw error;
	if (!rawBranches) return [];

	return await Promise.all(
		rawBranches.map(async (b) => {
			const [avg, trend] = await Promise.all([
				getBranchAverage(b.id),
				getBranchTrend(b.id),
			]);
			return { ...b, average: avg || 0, trend: trend || 0 };
		}),
	);
};

export const getBranchDetails = async (branchName: string) => {
	const { data: branch } = await supabase
		.from("branches")
		.select("id, name, icon")
		.ilike("name", branchName)
		.maybeSingle();

	if (!branch) return null;

	const [avg, trend, { data: notesData }] = await Promise.all([
		getBranchAverage(branch.id),
		getBranchTrend(branch.id),
		supabase
			.from("notes")
			.select("*")
			.eq("branch_id", branch.id)
			.is("parent_id", null)
			.order("created_at", { ascending: false }),
	]);

	const notesWithAverages = notesData
		? await Promise.all(
				notesData.map(async (n) => ({
					...n,
					displayNote: n.is_group ? await getSeriesAverage(n.id) : n.value,
				})),
			)
		: [];

	return {
		branch: { ...branch, average: avg || 0, trend: trend || 0 },
		notes: notesWithAverages,
	};
};

export const getMonthlyAverages = async (): Promise<
	{ name: string; avg: number }[]
> => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];

	const { data: notes, error } = await supabase
		.from("notes")
		.select("value, created_at, is_group")
		.eq("user_id", user.id)
		.order("created_at", { ascending: true });

	if (error || !notes || notes.length === 0) return [];

	const monthsMapping = [
		"J",
		"F",
		"M",
		"A",
		"M",
		"J",
		"J",
		"A",
		"S",
		"O",
		"N",
		"D",
	];
	const grouped: { [key: number]: { sum: number; count: number } } = {};

	for (const note of notes) {
		if (note.is_group || note.value === null || note.value === undefined)
			continue;

		const date = new Date(note.created_at);
		const monthIndex = date.getMonth();

		if (!grouped[monthIndex]) {
			grouped[monthIndex] = { sum: 0, count: 0 };
		}
		grouped[monthIndex].sum += note.value;
		grouped[monthIndex].count += 1;
	}

	return Object.keys(grouped).map((key) => {
		const monthIdx = parseInt(key);
		return {
			name: monthsMapping[monthIdx],
			avg:
				Math.round((grouped[monthIdx].sum / grouped[monthIdx].count) * 10) / 10,
		};
	});
};

export const createCustomGroup = async (name: string, userId: string) => {
	const { data, error } = await supabase
		.from("custom_groups")
		.insert([{ name, user_id: userId }])
		.select()
		.single();
	if (error) throw error;
	return data;
};

export const linkBranchesToGroup = async (
	groupId: string,
	branchIds: string[],
) => {
	const inserts = branchIds.map((branchId) => ({
		group_id: groupId,
		branch_id: branchId,
	}));
	const { error } = await supabase.from("group_branches").insert(inserts);
	if (error) throw error;
	return true;
};

export const fetchCustomGroupsWithData = async (userId: string) => {
	const { data: groups, error: groupError } = await supabase
		.from("custom_groups")
		.select("*")
		.eq("user_id", userId);

	if (groupError) throw groupError;
	if (!groups) return [];

	return await Promise.all(
		groups.map(async (group) => {
			const { data: links } = await supabase
				.from("group_branches")
				.select("branch_id")
				.eq("group_id", group.id);

			const branchIds = links?.map((l) => l.branch_id) || [];
			if (branchIds.length === 0) {
				return { ...group, branches: [], average: 0 };
			}

			const { data: averagesData } = await supabase
				.from("moyenne_branches")
				.select("branch_id, moyenne_globale")
				.in("branch_id", branchIds);

			const validAverages =
				averagesData?.filter(
					(b) => b.moyenne_globale && b.moyenne_globale > 0,
				) || [];

			const totalPoints = validAverages.reduce(
				(acc, b) => acc + b.moyenne_globale,
				0,
			);
			const average =
				validAverages.length > 0 ? totalPoints / validAverages.length : 0;

			return {
				...group,
				branches: branchIds.map((id) => ({ id })),
				total_points: totalPoints,
				average,
			};
		}),
	);
};

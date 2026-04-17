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
		.select("*")
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

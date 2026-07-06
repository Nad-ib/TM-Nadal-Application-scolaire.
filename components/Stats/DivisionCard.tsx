"use client";

import {
	Award,
	ChevronRight,
	Sparkles,
	Shield,
	Flame,
	Trophy,
	ArrowUpRight,
	Crown,
} from "lucide-react";

export type LeagueType =
	| "bronze"
	| "argent"
	| "or"
	| "diamant"
	| "master"
	| "immortel";

interface DivisionCardProps {
	league?: LeagueType;
	rank?: string;
	progress?: number;
	pointsToNext?: number;
	onClick?: () => void;
}

const LEAGUE_CONFIGS = {
	bronze: {
		name: "Bronze",
		badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
		iconColor: "text-amber-700",
		iconBg: "bg-amber-50 border-amber-200",
		barColor: "bg-amber-600",
		nextLeague: "Argent",
	},
	argent: {
		name: "Argent",
		badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
		iconColor: "text-slate-600",
		iconBg: "bg-slate-50 border-slate-200",
		barColor: "bg-slate-500",
		nextLeague: "Or",
	},
	or: {
		name: "Or",
		badgeBg: "bg-yellow-100 text-yellow-900 border-yellow-200",
		iconColor: "text-yellow-600",
		iconBg: "bg-yellow-50 border-yellow-200",
		barColor: "bg-yellow-500",
		nextLeague: "Diamant",
	},
	diamant: {
		name: "Diamant",
		badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-200",
		iconColor: "text-indigo-600",
		iconBg: "bg-indigo-50 border-indigo-200",
		barColor: "bg-indigo-600",
		nextLeague: "Master",
	},
	master: {
		name: "Master",
		badgeBg: "bg-rose-100 text-rose-900 border-rose-200",
		iconColor: "text-rose-600",
		iconBg: "bg-rose-50 border-rose-200",
		barColor: "bg-rose-600",
		nextLeague: "Immortel",
	},
	immortel: {
		name: "Top 10 Mondial",
		badgeBg:
			"bg-neutral-900 text-yellow-400 border-neutral-800 font-black tracking-tight",
		iconColor: "text-yellow-500",
		iconBg: "bg-neutral-900 border-neutral-800",
		barColor: "bg-yellow-500",
		nextLeague: "Légende",
	},
};

const LEAGUE_ICONS = {
	bronze: Shield,
	argent: Award,
	or: Trophy,
	diamant: Sparkles,
	master: Flame,
	immortel: Crown,
};

export default function DivisionCard({
	league = "immortel",
	rank = "Rang #4",
	progress = 85,
	pointsToNext = 420,
	onClick,
}: DivisionCardProps) {
	const config = LEAGUE_CONFIGS[league];
	const IconComponent = LEAGUE_ICONS[league];
	const isImmortel = league === "immortel";

	return (
		<button
			onClick={onClick}
			disabled={!onClick}
			className={`w-full text-left p-4 rounded-2xl flex flex-col gap-4 transition-all outline-none border ${
				isImmortel
					? "bg-neutral-950 border-neutral-800 shadow-xl shadow-yellow-500/5 relative"
					: "bg-white border-slate-200"
			} ${
				onClick
					? isImmortel
						? "hover:bg-neutral-900 active:scale-[0.99] cursor-pointer"
						: "hover:bg-slate-50/50 active:scale-[0.99] cursor-pointer"
					: "cursor-default"
			}`}>
			{isImmortel && (
				<div className="absolute top-0 right-12 w-24 h-px bg-linear-to-r from-transparent via-yellow-500/30 to-transparent" />
			)}

			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}>
						<IconComponent
							size={18}
							strokeWidth={2.5}
							className={isImmortel ? "animate-pulse" : ""}
						/>
					</div>

					<div className="flex flex-col">
						<p
							className={`text-xs font-medium uppercase tracking-wider leading-none mb-1 ${isImmortel ? "text-yellow-500/70" : "text-slate-400"}`}>
							{isImmortel ? "Élite Absolue" : "Ligue Actuelle"}
						</p>
						<p
							className={`text-base font-extrabold tracking-tight leading-none ${isImmortel ? "text-white" : "text-slate-900"}`}>
							{config.name}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="text-right">
						<span
							className={`text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-tight tabular-nums ${config.badgeBg}`}>
							{rank}
						</span>
					</div>
					{onClick && (
						<ChevronRight
							size={14}
							className={
								isImmortel
									? "text-neutral-600 shrink-0"
									: "text-slate-400 shrink-0"
							}
							strokeWidth={2.5}
						/>
					)}
				</div>
			</div>

			<div className="w-full space-y-1.5">
				<div
					className={`w-full h-2 rounded-full overflow-hidden border ${isImmortel ? "bg-neutral-900 border-neutral-800" : "bg-slate-100 border-slate-200/40"}`}>
					<div
						className={`h-full ${config.barColor} transition-all duration-500 rounded-full ${isImmortel ? "shadow-sm shadow-yellow-500/50" : ""}`}
						style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
					/>
				</div>

				<div className="flex items-center justify-between text-[10px] font-bold tracking-wide uppercase">
					<span className={isImmortel ? "text-neutral-500" : "text-slate-400"}>
						{isImmortel ? "Stabilité du Rang" : `${progress}% complété`}
					</span>
					<span
						className={`flex items-center gap-0.5 ${isImmortel ? "text-yellow-500" : "text-slate-500"}`}>
						{isImmortel
							? `${pointsToNext} pts de marge`
							: `${pointsToNext} pts avant ${config.nextLeague}`}
						{!isImmortel && (
							<ArrowUpRight
								size={10}
								strokeWidth={3}
								className="text-slate-400"
							/>
						)}
					</span>
				</div>
			</div>
		</button>
	);
}

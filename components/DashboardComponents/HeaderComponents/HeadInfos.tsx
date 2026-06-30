"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import Avatar from "./Avatar";

interface HeadInfosProps {
	name: string;
	avatarUrl?: string;
}

export default function HeadInfos({ name, avatarUrl }: HeadInfosProps) {
	return (
		<div className="flex items-center justify-between w-full py-2 border-b border-slate-50">
			<div className="flex flex-col">
				<span className="text-xs text-slate-400 font-medium">
					Content de te revoir,
				</span>
				<h2 className="text-lg font-black text-slate-800 tracking-tight">
					Hi {name} !
				</h2>
			</div>

			<div className="flex items-center gap-3">
				<Avatar url={avatarUrl} />

				<Link
					href="/settings"
					className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-slate-600 active:scale-95 transition-all flex items-center justify-center"
					aria-label="Paramètres">
					<Icon icon="lucide:settings" className="text-lg" />
				</Link>
			</div>
		</div>
	);
}

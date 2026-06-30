"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

interface MyChartProps {
	data: { name: string; avg: number }[];
}

export default function MyChart({ data }: MyChartProps) {
	if (data.length === 0) {
		return (
			<div className="h-full w-full flex items-center justify-center text-xs text-gray-400 font-medium">
				Aucune note disponible
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				data={data}
				margin={{ top: 5, right: 10, left: 10, bottom: 2 }}
				style={{
					pointerEvents: "none",
					userSelect: "none",
					outline: "none",
				}}>
				<CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />

				<XAxis
					dataKey="name"
					axisLine={false}
					tickLine={false}
					tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 500 }}
					dy={4}
				/>
				<YAxis domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} hide={true} />

				<Line
					type="monotone"
					dataKey="avg"
					stroke="#1E3A8A"
					strokeWidth={2.5}
					activeDot={false}
					dot={{
						r: 3.5,
						fill: "#1E3A8A",
						strokeWidth: 2,
						stroke: "white",
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

const data = [
	{ name: "J", avg: 4.0 },
	{ name: "F", avg: 4.2 },
	{ name: "M", avg: 3.8 },
	{ name: "A", avg: 4.5 },
	{ name: "M", avg: 4.8 },
	{ name: "J", avg: 5.0 },
];

export default function MyChart() {
	return (
		<div className="w-full h-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{ top: 10, right: 15, left: -40, bottom: 0 }}
					style={{
						pointerEvents: "none",
						userSelect: "none",
						outline: "none",
					}}>
					<CartesianGrid
						strokeDasharray="3"
						stroke="#aaa"
						vertical={false}
					/>

					<XAxis
						dataKey="name"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 10, fill: "black" }}
					/>
					<YAxis
						domain={[1, 6]}
						ticks={[1, 2, 3, 4, 5, 6]}
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 10, fill: "black" }}
						interval={0}
					/>

					<Line
						type="monotone"
						dataKey="avg"
						stroke="#6366f1"
						strokeWidth={3}
						activeDot={false}
						dot={{
							r: 4,
							fill: "#6366f1",
							strokeWidth: 2,
							stroke: "white",
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

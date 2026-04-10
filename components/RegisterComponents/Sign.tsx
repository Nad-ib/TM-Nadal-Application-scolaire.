interface signUp {
	name: string;
	onClick?: () => void;
}

export default function Sign({ name, onClick }: signUp) {
	return (
		<button onClick={onClick} className="w-full h-12 bg-black rounded-lg">
			<span className="text-white">{name}</span>
		</button>
	);
}

import InputComponent from "./InputComponent";

interface ConnexionProps {
	label: string;
	name: string;
	role: string;
	icon?: any;
	value: string;
	onChange: (val: string) => void;
}

export default function ConnexionInput({
	label,
	name,
	role,
	icon,
	value,
	onChange,
}: ConnexionProps) {
	return (
		<div className="w-full">
			<div>
				<span>{label}</span>
			</div>
			<InputComponent
				role={role}
				name={name}
				icon={icon}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}

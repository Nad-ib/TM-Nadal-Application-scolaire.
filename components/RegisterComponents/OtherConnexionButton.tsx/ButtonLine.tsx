import ModulableButton from "./ModulableButton";

export default function ButtonLine() {
	return (
		<div className="w-full flex flex-row items-center gap-4">
			<ModulableButton name="Facebook" icon="facebook" />
			<ModulableButton name="Google" icon="google" />
		</div>
	);
}

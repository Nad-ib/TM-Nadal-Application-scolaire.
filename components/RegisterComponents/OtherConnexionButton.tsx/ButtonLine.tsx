import ModulableButton from "./ModulableButton";

export default function ButtonLine() {
    return (
        <div className="w-full flex flex-row items-center gap-3">
            <div className="flex-1">
                <ModulableButton name="Facebook" icon="facebook" />
            </div>
            <div className="flex-1">
                <ModulableButton name="Google" icon="google" />
            </div>
        </div>
    );
}
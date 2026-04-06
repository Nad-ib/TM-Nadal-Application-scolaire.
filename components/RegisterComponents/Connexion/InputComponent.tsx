interface InputInfos {
	name: string;
	role: string;
    icon?: React.ReactNode
}

export default function InputComponent({ name, role, icon }: InputInfos) {
	return (
		<div className="w-full relative flex items-center ">
			<input
				className="w-full pl-6  py-4 rounded-lg border border-[#CEC7C7] outline-none"
				type={role}
				placeholder={name}
			/>
            <div className="absolute right-6 text-gray-400">
                <img src={`/${icon}.svg`} alt="" className="scale-100"/>
            </div>
		</div>
	);
}

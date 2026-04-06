import InputComponent from "./InputComponent"

interface InputInfos {
    name: string;
    role: string
    icon?: React.ReactNode
}

export default function ConnexionInput({name, role, icon}:InputInfos) {

    return(
        <div className="w-full">
            <div><span>Email</span></div>
            <InputComponent role={role} name={name} icon={icon}/>
        </div>
    )
}
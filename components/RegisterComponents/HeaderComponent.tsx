interface HeadInfos {
    name: string;
    message: string;
}

export default function HeaderComponents({name, message}:HeadInfos) {

    return(
        <div className="flex flex-col gap-2">
            <div><span>{name}</span></div>
            <div><span>{message}</span></div>
        </div>
    )
}
interface Direction {
    name: string;
}

export default function LinkConnexion({name}:Direction) {

    return(
        <div className="flex items-center justify-center w-full"><span>{name}</span></div>
    )
}
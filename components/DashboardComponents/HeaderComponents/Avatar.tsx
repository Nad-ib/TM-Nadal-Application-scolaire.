import Image from "next/image";

export default function Avatar() {
    return(
        <div className="relative w-6 h-6 overflow-hidden rounded-full border-gray-200 shadow-sm">
            <Image
                src="/buisne.avif" 
                alt="Profil de Nadal"
                fill 
                className="object-cover object-top" 
                sizes="40px" 
                priority 
            />
        </div>
    )
}
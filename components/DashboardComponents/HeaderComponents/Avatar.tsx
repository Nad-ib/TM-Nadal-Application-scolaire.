import Image from "next/image";

interface AvatarProps {
    url?: string;
}

export default function Avatar({ url }: AvatarProps) {
    const avatarSrc = url && url.trim() !== "" ? url : "/buisnessman.svg";

    return (
        <div className="relative w-9 h-9">
            
            <div className="relative w-full h-full overflow-hidden rounded-xl bg-linear-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-xs">
                <Image
                    src={avatarSrc}
                    alt="Avatar utilisateur"
                    fill
                    className="object-cover object-top"
                    sizes="36px"
                    priority
                />
            </div>
           
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
    );
}
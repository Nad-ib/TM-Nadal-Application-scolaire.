"use client";

import Link from "next/link";

interface Direction {
    name: string;
    href: string; 
}

export default function LinkConnexion({ name, href }: Direction) {
    return (
        <div className="flex items-center justify-center w-full">
            <Link 
                href={href} 
                className="text-sm text-gray-600 hover:text-[#1E3A8A] transition-colors cursor-pointer"
            >
                {name}
            </Link>
        </div>
    );
}
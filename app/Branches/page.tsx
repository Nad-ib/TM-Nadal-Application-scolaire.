"use client"

import { useEffect, useState } from "react"
import Link from "next/link" 
import { supabase } from "@/Backend/lib/supabase"
import HeadInfos from "@/components/DashboardComponents/HeaderComponents/HeadInfos"
import Branche from "@/components/NotesComponents/Branche"
import AddBranchButton from "@/components/AddBranchButton" 
import { useProfile } from "@/hooks/useProfile"

export default function Branches() {
    const { name } = useProfile()
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchBranches = async () => {
        setLoading(true)
        const { data } = await supabase
            .from("branches")
            .select("*")
            .order("name", { ascending: true })
        
        if (data) setBranches(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchBranches()
    }, [])

    return (
        <div className="bg-white w-screen min-h-screen">
            <div className="w-full p-6 flex flex-col gap-6">
                <HeadInfos name={name} />
                
                <div className="flex flex-col gap-4 items-center">
                    {loading ? (
                        <p className="text-gray-400">Chargement des matières...</p>
                    ) : branches.length > 0 ? (
                        branches.map((b) => (
                            
                            <Link 
                                key={b.id} 
                                href={`/resultat/${encodeURIComponent(b.name)}`}
                                className="w-full flex justify-center active:scale-95 transition-transform"
                            >
                                <Branche 
                                    title={b.name} 
                                    icon="math" 
                                    note={0} 
                                    trend={0} 
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center mt-10">Aucune branche. Cliquez sur + pour commencer !</p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <AddBranchButton onBranchAdded={fetchBranches} />
            </div>
        </div>
    )
}
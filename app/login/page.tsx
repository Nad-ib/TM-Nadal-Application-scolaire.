"use client"

import { supabase } from '@/Backend/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from "react"
import ConnexionInput from "@/components/RegisterComponents/Connexion/ConnexionInput"
import HeaderComponents from "@/components/RegisterComponents/HeaderComponent"
import LinkConnexion from "@/components/RegisterComponents/LinkConnexion"
import BreakLine from "@/components/RegisterComponents/BreakLine"
import ButtonLine from "@/components/RegisterComponents/OtherConnexionButton.tsx/ButtonLine"
import Sign from "@/components/RegisterComponents/Sign"

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    

    const handleSignIn = async () => {
        if (!email || !password) {
            setMessage("Veuillez remplir tous les champs")
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setMessage("Erreur : " + error.message)
        } else {
            setMessage("Connexion réussie ! Redirection...")
            setTimeout(() => {
                window.location.href = "/dashboard"
            }, 500)
        }
    }

    return (
        <div className="bg-white w-screen h-dvh">
            <div className="w-full h-full px-6 py-12 flex flex-col justify-between">
                <div className="flex flex-col gap-8">
                    <HeaderComponents name="Sign in" message="Welcome back you've been missed" />
                    <div className="flex flex-col gap-6">
                        <ConnexionInput
                            label="Email"
                            role="email"
                            name="Enter Email"
                            value={email}
                            onChange={setEmail}
                        />
                        <ConnexionInput
                            label="Password"
                            role="password"
                            name="Enter password"
                            icon="eye-off"
                            value={password}
                            onChange={setPassword}
                        />
                    </div>
                    <div className="flex flex-col gap-7">
                        <Sign name="Sign In" onClick={handleSignIn} />
                        {message && (
                            <p className={`text-center text-sm ${message.includes('réussie') ? 'text-green-500' : 'text-red-500'}`}>
                                {message}
                            </p>
                        )}
                        <BreakLine />
                        <ButtonLine />
                    </div>
                </div>
                <div>
                    <LinkConnexion href="/" name="Don't have an acount? Sign Up" />
                </div>
            </div>
        </div>
    )
}
"use client";

import { supabase } from "@/Backend/lib/supabase";
import { useState } from "react";
import ConnexionInput from "@/components/RegisterComponents/Connexion/ConnexionInput";
import HeaderComponents from "@/components/RegisterComponents/HeaderComponent";
import LinkConnexion from "@/components/RegisterComponents/LinkConnexion";
import BreakLine from "@/components/RegisterComponents/BreakLine";
import ButtonLine from "@/components/RegisterComponents/OtherConnexionButton.tsx/ButtonLine";
import Sign from "@/components/RegisterComponents/Sign";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!email || !password) {
            setMessage("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage("Erreur : " + error.message);
            setLoading(false);
        } else {
            setMessage("Connexion réussie ! Redirection...");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-white md:bg-slate-50/40 select-none antialiased flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white md:border md:border-slate-200/60 md:rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-screen md:min-h-0 md:h-auto gap-12 md:shadow-2xl md:shadow-slate-100/80">
                
                <form onSubmit={handleSignIn} className="flex flex-col gap-8 mt-6 md:mt-0 grow justify-center md:justify-start">
                    <HeaderComponents
                        name="Sign in"
                        message="Welcome back you've been missed"
                    />
                    
                    <div className="flex flex-col gap-5">
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
                    
                    <div className="flex flex-col gap-5 mt-2">
                        <Sign 
                            name={loading ? "Connexion..." : "Sign In"} 
                        />
                        
                        {message && (
                            <div className={`text-center text-xs font-bold tracking-tight px-4 py-3 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                                message.includes("réussie") 
                                    ? "bg-green-50 text-green-600 border-green-100" 
                                    : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                                {message}
                            </div>
                        )}
                        
                        <BreakLine />
                        <ButtonLine />
                    </div>
                </form>
                
                <div className="pb-6 md:pb-0 pt-4 border-t border-slate-100/80 w-full flex justify-center mt-auto md:mt-0">
                    <LinkConnexion href="/register" name="Don't have an account? Sign Up" />
                </div>
            </div>
        </div>
    );
}
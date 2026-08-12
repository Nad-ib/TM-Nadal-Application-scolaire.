"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/Backend/lib/supabase";
import { generateSecureObjectives } from "@/Backend/services/objectives";
import { processReferralReward } from "@/Backend/services/referral";

import HeaderComponents from "@/components/RegisterComponents/HeaderComponent";
import ConnexionInput from "@/components/RegisterComponents/Connexion/ConnexionInput";
import Sign from "@/components/RegisterComponents/Sign";
import BreakLine from "@/components/RegisterComponents/BreakLine";
import LinkConnexion from "@/components/RegisterComponents/LinkConnexion";
import ButtonLine from "@/components/RegisterComponents/OtherConnexionButton.tsx/ButtonLine";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get("ref");
      if (refParam) {
        setReferralCode(refParam);
      }
    }
  }, []);

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password || !passwordVerify) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== passwordVerify) {
      setMessage("Les mots de passe ne correspondent pas !");
      return;
    }

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          referrer_id: referralCode.trim() || null,
        },
      },
    });

    if (error) {
      setMessage("Erreur : " + error.message);
      setLoading(false);
    } else {
      if (data?.user) {
        await generateSecureObjectives(data.user.id);

        const cleanReferralCode = referralCode.trim();
        if (cleanReferralCode && cleanReferralCode !== data.user.id) {
          await processReferralReward({
            referrerId: cleanReferralCode,
            referredId: data.user.id,
          });
        }
      }

      setMessage("Succès ! Inscription réussie, redirection...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-slate-50/40 select-none antialiased flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white md:border md:border-slate-200/60 md:rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-screen md:min-h-0 md:h-auto gap-12 md:shadow-2xl md:shadow-slate-100/80">
        <form onSubmit={handleSignUp} className="flex flex-col gap-8 mt-6 md:mt-0 grow justify-center md:justify-start">
          <HeaderComponents name="Sign Up" message="Get Started Now" />

          <div className="flex flex-col gap-4">
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
            <ConnexionInput
              label="Confirm Password"
              role="password"
              name="Confirm password"
              icon="eye-off"
              value={passwordVerify}
              onChange={setPasswordVerify}
            />
            <ConnexionInput
              label="Referral Code (Optional)"
              role="text"
              name="Enter referral code"
              value={referralCode}
              onChange={setReferralCode}
            />
          </div>

          <div className="flex flex-col gap-5 mt-2">
            <Sign name={loading ? "Inscription..." : "Sign Up"} />

            {message && (
              <div
                className={`text-center text-xs font-bold tracking-tight px-4 py-3 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                  message.includes("Succès") || message.includes("réussie")
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                {message}
              </div>
            )}
            <BreakLine />
            <ButtonLine />
          </div>
        </form>

        <div className="pb-6 md:pb-0 pt-4 border-t border-slate-100/80 w-full flex justify-center mt-auto md:mt-0">
          <LinkConnexion href="/" name="Already have an account? Sign In" />
        </div>
      </div>
    </div>
  );
}
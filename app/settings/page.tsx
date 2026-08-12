"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Backend/lib/supabase";
import { getProfile, updateProfile } from "@/Backend/services/profile";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

const AVAILABLE_AVATARS = [
  "/buisnessman.svg",
  "/avatar2.jpg",
  "/avatar3.jpg",
  "/avatar4.jpg",
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [gamertag, setGamertag] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/buisnessman.svg");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  

  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/");
          return;
        }

        setUserId(user.id);

        
        const profile = await getProfile(user.id);
        if (profile) {
          setGamertag(profile.gamertag || "");
          setFullName(profile.full_name || "");
          if (profile.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        }

      
        const { count, error } = await supabase
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id);

        if (!error && count !== null) {
          setReferralCount(count);
        }

      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non trouvé");

      await updateProfile(user.id, {
        gamertag: gamertag,
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      setMessage({ text: "Modifications enregistrées !", isError: false });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        text: err.message || "Une erreur est survenue",
        isError: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyReferralLink = () => {
    if (!userId) return;
    const referralLink = `${window.location.origin}/register?ref=${userId}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const referralLink = userId ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${userId}` : "";

  return (
    <div className="min-h-screen bg-slate-50 w-screen flex flex-col items-center p-4 font-sans pb-safe select-none">
      <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl rounded-4xl p-6 flex flex-col gap-6 my-auto transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl active:scale-95 transition-all text-slate-700 border border-slate-100">
              <Icon icon="lucide:arrow-left" className="text-lg" />
            </Link>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Mon Profil
            </h1>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Settings
          </span>
        </div>

       
        <div className="flex flex-col items-center gap-3 bg-slate-50/60 rounded-3xl p-4 border border-slate-100">
          <div className="relative w-20 h-20 group">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md relative bg-white">
              <Image
                src={avatarUrl}
                alt="Profil"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-xl shadow-md hover:bg-black transition-all active:scale-90">
              <Icon icon="lucide:camera" className="text-xs" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            Changer d'avatar
          </button>

          {showAvatarSelector && (
            <div className="flex gap-3 mt-2 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-150">
              {AVAILABLE_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(avatar);
                    setShowAvatarSelector(false);
                  }}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all active:scale-90 ${avatarUrl === avatar ? "border-indigo-600 scale-105" : "border-transparent"}`}>
                  <Image
                    src={avatar}
                    alt="Option"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

      
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Gamertag (Pseudo)
            </label>
            <div className="relative flex items-center">
              <Icon
                icon="lucide:user"
                className="absolute left-4 text-slate-400 text-lg"
              />
              <input
                type="text"
                placeholder="Ex: Nadal42"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-slate-300 focus:bg-white focus:ring-4 ring-slate-900/5 text-slate-800 text-sm font-semibold transition-all"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Nom complet
            </label>
            <div className="relative flex items-center">
              <Icon
                icon="lucide:id-card"
                className="absolute left-4 text-slate-400 text-lg"
              />
              <input
                type="text"
                placeholder="Ex: Rafael Nadal"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-slate-300 focus:bg-white focus:ring-4 ring-slate-900/5 text-slate-800 text-sm font-semibold transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold text-center border animate-in fade-in slide-in-from-top-2 duration-200 ${
                message.isError
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={updating}
            className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
            {updating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Icon icon="lucide:check" className="text-base" />
                <span>Sauvegarder les modifications</span>
              </>
            )}
          </button>
        </form>

        
        <div className="flex flex-col gap-3 bg-linear-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl p-4 border border-indigo-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                <Icon icon="lucide:gift" className="text-sm" />
              </div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Parrainage
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-xs">
              {referralCount} {referralCount > 1 ? "filleuls" : "filleul"}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Invite tes amis et gagne de l'XP bonus pour chaque inscription effectuée avec ton lien.
          </p>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-mono truncate outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopyReferralLink}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              }`}>
              <Icon icon={copied ? "lucide:check" : "lucide:copy"} className="text-sm" />
              <span>{copied ? "Copié !" : "Copier"}</span>
            </button>
          </div>
        </div>

        
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 bg-red-50/60 hover:bg-red-50 text-red-600 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm border border-red-100/30">
            <Icon icon="lucide:log-out" className="text-base" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
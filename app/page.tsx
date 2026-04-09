"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/Backend/lib/supabase';

import HeaderComponents from "@/components/RegisterComponents/HeaderComponent";
import ConnexionInput from "@/components/RegisterComponents/Connexion/ConnexionInput";
import RememberLine from "@/components/RegisterComponents/Infos/RememberLine";
import Sign from "@/components/RegisterComponents/Sign";
import BreakLine from "@/components/RegisterComponents/BreakLine";
import LinkConnexion from "@/components/RegisterComponents/LinkConnexion";
import ButtonLine from "@/components/RegisterComponents/OtherConnexionButton.tsx/ButtonLine";



export default function Home() {

	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordVerify, setPasswordVerify] = useState("")
	const [message, setMessage] = useState("")

	const handleSignUp = async () => {
		if(!email || !password || !passwordVerify) {
			setMessage("veuillez remplir tous les champs.")
			return;
		}

		if (password !== passwordVerify) {
			setMessage("les mots de passe ne correspondent pas !")
			return;
		}

		if (password.length < 6) {
			setMessage("Le mot de passe doit contenir au moins 6 caractères.")
			return;
		}

		const {data, error} = await supabase.auth.signUp({
			email: email,
			password: password,
		})

		if (error) {
			setMessage("Erreur : " + error.message)
		} else {
			setMessage("Succès ! Redirection")

			setTimeout(() => {
				router.push("/dashboard")
			},2000)
		}
	}

	return (
		<div className="bg-white w-screen h-dvh   ">
			<div className="w-full h-full  px-6 py-12   flex flex-col  justify-between">
				<div className=" flex flex-col gap-8">
					<HeaderComponents name="sign Up" message="Gert Started Now"/>
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
						<ConnexionInput
							label="Confirm Password"
							role="password"
							name="Enter password"
							icon="eye-off"
							value={passwordVerify}
							onChange={setPasswordVerify}
						/>
					</div>

					<div className="flex flex-col gap-7">
						
						<Sign name="Sign Up" onClick={handleSignUp}/>
						
						{message && (
							<p className={`text-center text-sm ${message.includes('Succès') ? 'text-green-500' : 'text-red-500'}`}>
								{message}
							</p>
						)}
						<BreakLine />
						<ButtonLine />
					</div>
				</div>
				<div>
					<LinkConnexion href="/login" name="Already have an acount? Sign In" />
				</div>
			</div>
		</div>
	);
}

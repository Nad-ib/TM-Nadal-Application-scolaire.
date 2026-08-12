"use client" 

import { useState } from 'react'
import { supabase } from '@/Backend/lib/supabase' 

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage("Succès ! Vérifie tes emails ou rafraîchis Supabase.")
    }
  }

  return (
    <div className="p-20 flex flex-col gap-4 max-w-md">
      <h1 className="text-2xl font-bold">Test d'inscription</h1>
      <input 
        type="email" 
        placeholder="Email" 
        className="border p-2 rounded text-black"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Mot de passe" 
        className="border p-2 rounded text-black"
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button 
        onClick={handleSignUp}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Créer mon compte
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
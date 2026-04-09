import { useState, useEffect } from 'react';
import { supabase } from '@/Backend/lib/supabase'; // On utilise l'instance unique !

export function useProfile() {
  const [name, setName] = useState("Chargement...");

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data?.full_name) {
          setName(data.full_name);
        } else {
          setName("Utilisateur");
        }
      }
    }
    getProfile();
  }, []);

  return { name };
}
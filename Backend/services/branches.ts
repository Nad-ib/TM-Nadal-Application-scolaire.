import { supabase } from "../lib/supabase"

// Fonction pour récupérer les matières de l'élève connecté
export const getBranches = async () => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

// Fonction pour ajouter une matière
export const createBranch = async (name: string, userId: string) => {
  const { data, error } = await supabase
    .from('branches')
    .insert([{ name: name, user_id: userId }])
    .select()

  if (error) throw error
  return data
}
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'



const AuthContext = createContext(null)



export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [profile, setProfile] = useState(null)

  const [loading, setLoading] = useState(true)



  useEffect(() => {

    supabase.auth.getSession()

      .then(({ data: { session } }) => {

        setUser(session?.user ?? null)

        if (session?.user) fetchProfile(session.user.id)

        setLoading(false)

      })

      .catch(() => setLoading(false))



    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

      setUser(session?.user ?? null)

      if (session?.user) fetchProfile(session.user.id)

      else setProfile(null)

    })



    return () => subscription?.unsubscribe?.()

  }, [])



  const fetchProfile = async (userId) => {

    const { data } = await supabase

      .from('users')

      .select('*')

      .eq('id', userId)

      .single()

    setProfile(data)

  }



  // --- NEW UPDATE FUNCTION ---

  const updateProfile = async (updates) => {

    try {

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('No user logged in')



      const { error } = await supabase

        .from('users')

        .update(updates)

        .eq('id', user.id)



      if (error) throw error

     

      // Refresh local state so Dashboard/Profile update instantly

      setProfile(prev => ({ ...prev, ...updates }))

      return { error: null }

    } catch (error) {

      console.error('Error updating profile:', error.message)

      return { error }

    }

  }



  const signUp = async (email, password, name) => {

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) throw error

    if (data.user) {

      // Note: Using 'name' to match your table schema

      await supabase.from('users').insert({

        id: data.user.id,

        email,

        name,

        created_at: new Date().toISOString()

      })

    }

    return data

  }



  const signIn = async (email, password) => {

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error

    return data

  }



  const signOut = async () => {

    await supabase.auth.signOut()

    setUser(null)

    setProfile(null)

  }



  return (

    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, fetchProfile, updateProfile }}>

      {children}

    </AuthContext.Provider>

  )

}



export const useAuth = () => {

  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')

  return ctx

}
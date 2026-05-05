"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase: replace with onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    setLoading(false)
  }, [])

  const signIn = async (email: string, _password: string) => {
    // Firebase: await signInWithEmailAndPassword(auth, email, password)
    setUser({ uid: 'mock-uid', email, displayName: email.split('@')[0] })
  }

  const register = async (email: string, _password: string, displayName: string) => {
    // Firebase: await createUserWithEmailAndPassword(auth, email, password)
    //           await updateProfile(userCred.user, { displayName })
    setUser({ uid: 'mock-uid', email, displayName })
  }

  const signOut = async () => {
    // Firebase: await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const ADMIN_SESSION_KEY = 'torkia_admin_session'

function getStoredSession(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function setStoredSession(loggedIn: boolean) {
  try {
    if (loggedIn) sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
    else sessionStorage.removeItem(ADMIN_SESSION_KEY)
  } catch {}
}

interface AdminAuthContextValue {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(getStoredSession())
  }, [])

  const login = useCallback((password: string): boolean => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'
    if (password.trim() !== expected) return false
    setStoredSession(true)
    setIsAdmin(true)
    return true
  }, [])

  const logout = useCallback(() => {
    setStoredSession(false)
    setIsAdmin(false)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

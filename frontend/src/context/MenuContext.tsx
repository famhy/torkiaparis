'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchCategories, fetchProducts } from '../api/client'
import { mapApiProductToMenuItem } from '../api/menu'
import type { MenuItem } from '../types'

interface MenuContextValue {
  categories: { id: string; label: string }[]
  menuItems: MenuItem[]
  formuleMidiItem: MenuItem | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [formuleMidiItem, setFormuleMidiItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cats, products] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ])
      setCategories(
        cats.map((c) => ({ id: c.slug, label: c.name }))
      )
      const items = products.map(mapApiProductToMenuItem)
      setMenuItems(items)
      const formule = items.find((i) => i.name.toLowerCase().includes('formule') && i.name.toLowerCase().includes('midi'))
      setFormuleMidiItem(formule ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement du menu')
      setCategories([])
      setMenuItems([])
      setFormuleMidiItem(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <MenuContext.Provider
      value={{
        categories,
        menuItems,
        formuleMidiItem,
        loading,
        error,
        refetch: load,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within MenuProvider')
  return ctx
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfile } from '../types/auth'
import { authApi } from '../api/client'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'kurio_auth_token'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const queryClient = useQueryClient()

  const refreshUser = async () => {
    try {
      const currentToken = localStorage.getItem(TOKEN_KEY)
      if (!currentToken) {
        setUser(null)
        setIsLoading(false)
        return
      }
      const data = await authApi.getSession()
      setUser(data.user)
    } catch (error) {
      console.warn('Session check failed or expired', error)
      setUser(null)
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()

    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener('kurio:auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('kurio:auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem(TOKEN_KEY, res.token)
    setToken(res.token)
    setUser(res.user)
    // Invalidate user-scoped queries so new session loads fresh private data
    queryClient.invalidateQueries({ queryKey: ['cart'] })
    queryClient.invalidateQueries({ queryKey: ['favorites'] })
    queryClient.invalidateQueries({ queryKey: ['wallets'] })
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await authApi.register({ username, email, password })
    localStorage.setItem(TOKEN_KEY, res.token)
    setToken(res.token)
    setUser(res.user)
    queryClient.invalidateQueries({ queryKey: ['cart'] })
    queryClient.invalidateQueries({ queryKey: ['favorites'] })
    queryClient.invalidateQueries({ queryKey: ['wallets'] })
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      // ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    // Clear all queries to prevent leaking cached data across user sessions
    queryClient.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

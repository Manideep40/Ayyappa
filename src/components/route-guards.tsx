import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/components/auth-provider'

type Props = {
  children: React.ReactNode
  redirectTo?: string
}

// Renders children only when the user is NOT authenticated
export function AnonOnly({ children, redirectTo = '/' }: Props) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={redirectTo} replace />
  return <>{children}</>
}

// Renders children only when the user IS authenticated
export function RequireAuth({ children, redirectTo = '/login' }: Props) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to={redirectTo} replace />
  return <>{children}</>
}


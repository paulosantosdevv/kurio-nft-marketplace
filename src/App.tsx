import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ScenarioProvider } from './context/ScenarioContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Do not retry 4xx errors
        if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 30,
    },
  },
})

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ScenarioProvider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </ScenarioProvider>
    </QueryClientProvider>
  )
}

export default App

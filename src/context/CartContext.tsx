import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '../types/cart'
import { cartApi } from '../api/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socketService, NFTUpdatedEvent } from '../socket/socketClient'

interface CartContextType {
  items: CartItem[]
  count: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addToCart: (nftId: string, quantity?: number, edition?: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => void
  priceAlert: string | null
  clearPriceAlert: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [priceAlert, setPriceAlert] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    staleTime: 1000 * 30,
  })

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: (payload: { nftId: string; quantity?: number; edition?: string }) => cartApi.addToCart(payload),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
      setIsOpen(true)
    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => cartApi.updateQuantity(id, quantity),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
    },
  })

  // Remove Mutation
  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart)
    },
  })

  // Real-time Socket.IO synchronization for Cart items
  useEffect(() => {
    const handleNFTUpdated = (event: NFTUpdatedEvent) => {
      const cartFromQuery = queryClient.getQueryData<CartItem[]>(['cart'])
      const currentCart = (cartFromQuery && cartFromQuery.length > 0) ? cartFromQuery : items
      const affectedItem = currentCart.find((item) => item.nftId === event.nftId)

      if (affectedItem) {
        // Price changed
        if (affectedItem.unitPrice !== event.newPrice) {
          const msg = `Atenção: O valor de "${affectedItem.nft.title}" mudou de ${affectedItem.unitPrice} ETH para ${event.newPrice} ETH em tempo real.`
          setPriceAlert(msg)
        }
        // Editions changed
        if (affectedItem.quantity > event.availableEditions) {
          setPriceAlert(
            `Atenção: Apenas ${event.availableEditions} edições de "${affectedItem.nft.title}" continuam disponíveis.`
          )
        }

        // Revalidate cart from server
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }

    socketService.on('nft.updated', handleNFTUpdated)
    return () => {
      socketService.off('nft.updated', handleNFTUpdated)
    }
  }, [queryClient, items])

  const addToCart = async (nftId: string, quantity = 1, edition?: string) => {
    await addMutation.mutateAsync({ nftId, quantity, edition })
  }

  const updateQuantity = async (id: string, quantity: number) => {
    await updateMutation.mutateAsync({ id, quantity })
  }

  const removeItem = async (id: string) => {
    await removeMutation.mutateAsync(id)
  }

  const clearCart = () => {
    queryClient.setQueryData(['cart'], [])
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        priceAlert,
        clearPriceAlert: () => setPriceAlert(null),
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

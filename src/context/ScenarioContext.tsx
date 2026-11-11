import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MockScenario, scenarioManager } from '../mocks/scenarios'
import { mockStore } from '../mocks/db/mockStore'
import { socketService } from '../socket/socketClient'
import { useQueryClient } from '@tanstack/react-query'

interface ScenarioContextType {
  scenario: MockScenario
  setScenario: (s: MockScenario) => void
  resetDatabase: () => void
  simulateSocketPriceChange: () => void
  isToolbarVisible: boolean
  setIsToolbarVisible: (v: boolean) => void
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined)

export const ScenarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scenario, setScenarioState] = useState<MockScenario>(() => scenarioManager.getScenario())
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)
  const queryClient = useQueryClient()

  const setScenario = (s: MockScenario) => {
    scenarioManager.setScenario(s)
    setScenarioState(s)
  }

  const resetDatabase = () => {
    mockStore.reset()
    scenarioManager.reset()
    setScenarioState('default')
    queryClient.clear()
    window.location.reload()
  }

  const simulateSocketPriceChange = () => {
    // Dynamically change Emerald Ape price from 1.19 to 1.89
    socketService.simulateNFTPriceChange('nft-1', '1.89')
    queryClient.invalidateQueries({ queryKey: ['nfts'] })
    queryClient.invalidateQueries({ queryKey: ['nft', 'nft-1'] })
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  return (
    <ScenarioContext.Provider
      value={{
        scenario,
        setScenario,
        resetDatabase,
        simulateSocketPriceChange,
        isToolbarVisible,
        setIsToolbarVisible,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  )
}

export const useScenario = () => {
  const context = useContext(ScenarioContext)
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider')
  }
  return context
}

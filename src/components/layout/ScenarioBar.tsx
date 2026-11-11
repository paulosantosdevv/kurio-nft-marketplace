import React, { useState } from 'react'
import { useScenario } from '../../context/ScenarioContext'
import { MockScenario } from '../../mocks/scenarios'
import { Button } from '../ui/Button'
import { Settings2, RotateCcw, Zap, ChevronUp, ChevronDown } from 'lucide-react'

export const ScenarioBar: React.FC = () => {
  const { scenario, setScenario, resetDatabase, simulateSocketPriceChange } = useScenario()
  const [isOpen, setIsOpen] = useState(false)

  const scenariosList: { id: MockScenario; label: string }[] = [
    { id: 'default', label: 'Padrão (Sucesso)' },
    { id: 'slow_network', label: 'Rede Lenta (2200ms)' },
    { id: 'server_error', label: 'Erro 500 no Servidor' },
    { id: 'session_expired', label: 'Sessão Expirada (401)' },
    { id: 'price_surge', label: 'Preço Alterado no Checkout' },
    { id: 'stock_out', label: 'Edição Esgotada' },
    { id: 'payment_timeout', label: 'Timeout no Pedido' },
    { id: 'payment_rejected', label: 'Pagamento Recusado' },
  ]

  return (
    <aside
      aria-label="Painel de controle de cenários e testes"
      className="fixed bottom-20 right-3 md:bottom-3 md:right-3 z-[100] flex flex-col items-end opacity-85 hover:opacity-100 transition-opacity"
    >
      {isOpen && (
        <div
          role="region"
          aria-label="Opções de simulação de rede e tempo real"
          className="bg-[#1b120e] border border-[#d28a4c]/50 rounded-xl p-4 shadow-2xl mb-2 w-80 text-xs text-[#f7f4ed] backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#3d2b21] pb-2 mb-3">
            <span className="font-bold flex items-center gap-1.5 text-[#d28a4c]">
              <Settings2 className="w-4 h-4" /> Simulação MSW & Socket.IO
            </span>
            <span className="text-[10px] text-[#a69a8f] uppercase tracking-wider">Modo Avaliação</span>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="scenario-select" className="text-[11px] text-[#a69a8f] block mb-1">
                Cenário de Rede & Falhas:
              </label>
              <select
                id="scenario-select"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as MockScenario)}
                className="w-full bg-[#241914] text-[#f7f4ed] border border-[#3d2b21] rounded p-2 text-xs focus:border-[#d28a4c] outline-none"
              >
                {scenariosList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={simulateSocketPriceChange}
                className="w-full text-xs justify-start"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Disparar `nft.updated` (Socket)
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetDatabase}
                className="w-full text-xs justify-start text-red-400 hover:text-red-300"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar Banco Mock
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Alternar painel de cenários de teste"
        className="bg-[#241914] hover:bg-[#2e201a] text-[#d28a4c] border border-[#d28a4c]/40 rounded-full px-3 py-1.5 shadow-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>MSW: {scenariosList.find((s) => s.id === scenario)?.label.split(' ')[0]}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </aside>
  )
}

export type MockScenario =
  | 'default' // normal success
  | 'slow_network' // 2000ms latency
  | 'server_error' // 500 error on queries
  | 'session_expired' // 401 unauthorized
  | 'price_surge' // price changes during checkout
  | 'stock_out' // NFT edition exhausts during purchase
  | 'payment_timeout' // order creates but response times out (test idempotency)
  | 'payment_rejected' // order created with 'rejected' status

export interface ScenarioState {
  current: MockScenario
  latencyMs: number
}

const SCENARIO_STORAGE_KEY = 'kurio_mock_scenario'

class ScenarioManager {
  private scenario: MockScenario = 'default'
  private customLatency: number = 200

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SCENARIO_STORAGE_KEY)
      if (saved) {
        this.scenario = saved as MockScenario
      }
    }
  }

  public getScenario(): MockScenario {
    return this.scenario
  }

  public setScenario(s: MockScenario) {
    this.scenario = s
    if (typeof window !== 'undefined') {
      localStorage.setItem(SCENARIO_STORAGE_KEY, s)
    }
  }

  public getDelay(): number {
    switch (this.scenario) {
      case 'slow_network':
        return 2200
      case 'payment_timeout':
        return 4000
      default:
        return this.customLatency
    }
  }

  public reset() {
    this.setScenario('default')
  }
}

export const scenarioManager = new ScenarioManager()

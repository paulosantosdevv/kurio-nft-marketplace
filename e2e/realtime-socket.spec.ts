import { test, expect } from '@playwright/test'

test.describe('5. Tempo Real com Socket.IO e Reconciliação', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('kurio_mock_db_v3')
    })
    await page.reload()
  })

  test('deve refletir alteração de preço em tempo real durante navegação', async ({ page }) => {
    await page.goto('/')

    // Inicialmente o Emerald Ape está em 1.19 ETH
    await expect(page.getByText('1.19 ETH').first()).toBeVisible()

    // Disparar evento de socket pelo painel de avaliação
    await page.locator('button[aria-label="Alternar painel de cenários de teste"]').click()
    await page.getByRole('button', { name: /Disparar `nft.updated`/i }).click()

    // O preço deve atualizar em tempo real para 1.89 ETH sem necessidade de recarregar a página
    await expect(page.getByText('1.89 ETH').first()).toBeVisible()
  })

  test('deve alertar o usuário no carrinho se o preço do item mudar em tempo real', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR/i }).first().click()

    // Aguardar o item ser adicionado e estar visível no carrinho
    await expect(page.locator('#cart-title')).toBeVisible()
    await expect(page.getByText('Emerald Ape #842').first()).toBeVisible()

    // Com o carrinho aberto, disparar alteração de preço via socket
    await page.locator('button[aria-label="Alternar painel de cenários de teste"]').click()
    await page.getByRole('button', { name: /Disparar `nft.updated`/i }).click()

    // Deve exibir banner de aviso de atualização em tempo real
    await expect(page.getByText(/O valor de "Emerald Ape #842" mudou/i)).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('5. Tempo Real com Socket.IO e Reconciliação', () => {
  test('deve refletir alteração de preço em tempo real durante navegação', async ({ page }) => {
    await page.goto('/')

    // Inicialmente o Emerald Ape está em 1.19 ETH
    await expect(page.getByText('1.19 ETH')).toBeVisible()

    // Disparar evento de socket pelo painel de avaliação
    await page.locator('button[aria-label="Alternar painel de cenários de teste"]').click()
    await page.getByRole('button', { name: /Disparar `nft.updated`/i }).click()

    // O preço deve atualizar em tempo real para 1.89 ETH sem necessidade de recarregar a página
    await expect(page.getByText('1.89 ETH')).toBeVisible()
  })

  test('deve alertar o usuário no carrinho se o preço do item mudar em tempo real', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR AGORA/i }).click()

    // Com o carrinho aberto, disparar alteração de preço via socket
    await page.locator('button[aria-label="Alternar painel de cenários de teste"]').click()
    await page.getByRole('button', { name: /Disparar `nft.updated`/i }).click()

    // Deve exibir banner de aviso de atualização em tempo real
    await expect(page.getByText(/O valor de "Emerald Ape #842" mudou/i)).toBeVisible()
  })
})

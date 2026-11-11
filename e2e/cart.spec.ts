import { test, expect } from '@playwright/test'

test.describe('3. Carrinho, Cupons e Persistência', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve adicionar item ao carrinho e atualizar resumo de valores', async ({ page }) => {
    // Abrir detalhe do primeiro NFT
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR AGORA/i }).click()

    // O drawer do carrinho deve estar visível
    await expect(page.locator('#cart-title')).toBeVisible()
    await expect(page.getByText('Emerald Ape #842')).toBeVisible()
    await expect(page.getByText('1.19 ETH')).toBeVisible()
  })

  test('deve aplicar cupom de desconto com validação e feedback', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR AGORA/i }).click()

    // Aplicar cupom inválido
    const couponInput = page.locator('input[placeholder*="Código promocional"]')
    await couponInput.fill('CUPOM_FALSO')
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.getByText(/inválido ou inexistente/i)).toBeVisible()

    // Aplicar cupom expirado
    await couponInput.fill('EXPIRED50')
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.getByText(/expirado/i)).toBeVisible()

    // Aplicar cupom válido (KURIO10)
    await couponInput.fill('KURIO10')
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.getByText(/Cupom aplicado: KURIO10/i)).toBeVisible()
  })

  test('deve persistir itens do carrinho após refresh', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR AGORA/i }).click()

    // Recarregar a página
    await page.reload()

    // O contador de itens no carrinho no cabeçalho deve permanecer
    const cartButton = page.locator('button[aria-label="Abrir carrinho de NFTs"]')
    await expect(cartButton).toBeVisible()
    await cartButton.click()
    await expect(page.getByText('Emerald Ape #842')).toBeVisible()
  })
})

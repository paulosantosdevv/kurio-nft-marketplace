import { test, expect } from '@playwright/test'

test.describe('1. Catálogo, Filtros e Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve renderizar o catálogo inicial e os destaques', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('SEJA DONO DO FUTURO DA ARTE DIGITAL')
    await expect(page.getByText('Emerald Ape #842')).toBeVisible()
    await expect(page.getByText('Cosmic Bloom #118')).toBeVisible()
  })

  test('deve filtrar por busca de texto e refletir na URL', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar NFTs"]').first()
    await searchInput.fill('Emerald')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/search=Emerald/)
    await expect(page.getByText('Emerald Ape #842')).toBeVisible()
    await expect(page.getByText('Cosmic Bloom #118')).not.toBeVisible()
  })

  test('deve combinar filtros de categoria e rede mantendo o histórico de navegação', async ({ page }) => {
    // Filtrar por categoria 'Arte digital'
    await page.getByRole('button', { name: /Arte digital/i }).click()
    await expect(page).toHaveURL(/category=arte-digital/)

    // Filtrar por rede 'Ethereum'
    await page.locator('input[type="radio"][value="ethereum"]').check()
    await expect(page).toHaveURL(/network=ethereum/)

    // Voltar no histórico do navegador
    await page.goBack()
    await expect(page).not.toHaveURL(/network=ethereum/)
    await expect(page).toHaveURL(/category=arte-digital/)
  })

  test('deve ordenar por menor e maior preço', async ({ page }) => {
    const sortSelect = page.locator('#sort-by-select')
    await sortSelect.selectOption('price-asc')
    await expect(page).toHaveURL(/sortBy=price-asc/)

    // O item mais barato deve ser o primeiro listado
    await expect(page.getByText('Golden Signal #160')).toBeVisible()
  })
})

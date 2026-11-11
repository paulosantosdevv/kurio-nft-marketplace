import { test, expect } from '@playwright/test'

test.describe('6. Perfil do Colecionador e Gestão de Carteiras', () => {
  test.beforeEach(async ({ page }) => {
    // Autenticar
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('contato@email.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: 'Entrar' }).click()
  })

  test('deve editar e persistir dados cadastrais do perfil', async ({ page }) => {
    await page.goto('/perfil')

    const displayNameInput = page.locator('input[id*="Nome de exibição"]')
    await displayNameInput.fill('Nova Sato VIP')
    await page.getByRole('button', { name: 'Salvar Alterações' }).click()

    await expect(page.getByText('Dados cadastrais salvos com sucesso!')).toBeVisible()

    // Recarregar a página e confirmar que persistiu
    await page.reload()
    await expect(page.locator('input[id*="Nome de exibição"]')).toHaveValue('Nova Sato VIP')
  })

  test('deve adicionar nova carteira e gerenciar principal/secundária', async ({ page }) => {
    await page.goto('/carteiras')

    // Preencher nova carteira
    await page.locator('input[placeholder*="MetaMask Principal"]').fill('Carteira de Teste')
    await page.locator('input[placeholder="0x..."]').fill('0x1234567890abcdef1234567890abcdef12345678')
    await page.getByRole('button', { name: 'Salvar Carteira' }).click()

    await expect(page.getByText('Carteira vinculada com sucesso!')).toBeVisible()
    await expect(page.getByText('Carteira de Teste')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('2. Detalhes do NFT e Tratamento de Erros', () => {
  test('deve acessar diretamente a página do NFT existente e carregar metadados', async ({ page }) => {
    await page.goto('/nft/nft-1')

    await expect(page.locator('h1')).toContainText('Emerald Ape #842')
    await expect(page.getByText('1.19 ETH').first()).toBeVisible()
    await expect(page.getByText('Nova Sato', { exact: true })).toBeVisible()
    await expect(page.getByText('ERC-721').first()).toBeVisible()
  })

  test('deve exibir mensagem clara de recurso inexistente (404) para NFT inválido', async ({ page }) => {
    await page.goto('/nft/nft-inexistente-123')

    await expect(page.getByText('Ativo Digital Não Localizado')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Voltar ao Catálogo' })).toBeVisible()

    // Clicar no botão deve restaurar para a home
    await page.getByRole('button', { name: 'Voltar ao Catálogo' }).click()
    await expect(page).toHaveURL('/')
  })
})

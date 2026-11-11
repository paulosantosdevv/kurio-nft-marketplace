import { test, expect } from '@playwright/test'

test.describe('4. Autenticação, Checkout Idempotente e Confirmação', () => {
  test('deve realizar login com sucesso e redirecionar para rota anterior', async ({ page }) => {
    await page.goto('/login?redirect=/perfil')

    await page.locator('form input[type="email"]').first().fill('contato@email.com')
    await page.locator('form input[type="password"]').first().fill('password123')
    await page.locator('form button[type="submit"]').click()

    await expect(page).toHaveURL('/perfil')
    await expect(page.getByText('Nova Sato').first()).toBeVisible()
  })

  test('deve tratar conflito de cadastro com e-mail já existente', async ({ page }) => {
    await page.goto('/cadastro')

    await page.locator('form input[placeholder*="cryptokid"]').first().fill('novouser')
    await page.locator('form input[type="email"]').first().fill('contato@email.com') // email já existente
    await page.locator('form input[type="password"]').first().fill('password123')
    await page.locator('form input[type="password"]').nth(1).fill('password123')
    await page.getByRole('button', { name: 'Criar Perfil' }).first().click()

    await expect(page.getByText(/já está em uso/i).first()).toBeVisible()
  })

  test('deve completar compra de ponta a ponta e exibir recibo com snapshot', async ({ page }) => {
    // 1. Fazer login
    await page.goto('/login')
    await page.locator('form input[type="email"]').first().fill('contato@email.com')
    await page.locator('form input[type="password"]').first().fill('password123')
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL((url) => !url.pathname.includes('/login'))

    // 2. Adicionar NFT ao carrinho
    await page.goto('/nft/nft-1')
    await page.getByRole('button', { name: /COMPRAR/i }).first().click()

    // 3. Avançar para pagamento
    await page.getByRole('button', { name: 'Avançar para Pagamento' }).first().click()
    await expect(page).toHaveURL('/pagamento')

    // 4. Confirmar compra
    await page.getByRole('button', { name: /Confirmar Compra/i }).first().click()

    // 5. Verificar tela de confirmação
    await expect(page).toHaveURL(/\/confirmacao\/ord_/)
    await expect(page.getByText('THANK YOU').first()).toBeVisible()
    await expect(page.getByText('Seus NFTs agora estão na sua carteira').first()).toBeVisible()
    await expect(page.getByText('Emerald Ape #842').first()).toBeVisible()
    await expect(page.getByText('Ver no Etherscan').first()).toBeVisible()
  })
})

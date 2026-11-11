import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'
import { scenarioManager } from '../scenarios'
import { getUserIdFromRequest } from './authHelper'

export const authHandlers = [
  // Session check
  http.get('/api/auth/session', async ({ request }) => {
    await delay(scenarioManager.getDelay())

    if (scenarioManager.getScenario() === 'session_expired') {
      return HttpResponse.json({ message: 'Sessão expirada. Faça login novamente.' }, { status: 401 })
    }

    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ user: null })
    }

    const user = mockStore.findUserById(userId)

    if (!user) {
      return HttpResponse.json({ user: null })
    }

    const { passwordHash: _, ...safeUser } = user as any
    return HttpResponse.json({ user: safeUser })
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    await delay(scenarioManager.getDelay())

    if (scenarioManager.getScenario() === 'server_error') {
      return HttpResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 })
    }

    const body = (await request.json()) as any
    const { email, password } = body

    if (!email || !password) {
      return HttpResponse.json({ message: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }

    const user = mockStore.findUserByEmail(email)
    if (!user || user.passwordHash !== password) {
      return HttpResponse.json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' }, { status: 401 })
    }

    const token = `tok_${user.id}_${Date.now()}`
    const { passwordHash: _, ...safeUser } = user

    // Merge any guest cart into user cart
    mockStore.mergeGuestCart(user.id)

    return HttpResponse.json({
      token,
      user: safeUser,
    })
  }),

  // Register
  http.post('/api/auth/register', async ({ request }) => {
    await delay(scenarioManager.getDelay())

    const body = (await request.json()) as any
    const { username, email, password } = body

    if (!username || !email || !password) {
      return HttpResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }

    if (password.length < 6) {
      return HttpResponse.json({ message: 'A senha deve conter no mínimo 6 caracteres.' }, { status: 400 })
    }

    const existingUser = mockStore.findUserByEmail(email)
    if (existingUser) {
      return HttpResponse.json(
        { message: 'Este endereço de e-mail já está em uso por outro colecionador.' },
        { status: 409 }
      )
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      username,
      email,
      displayName: username,
      nickname: username.toLowerCase(),
      avatarUrl: '/assets/avatars/default-avatar.png',
      ensName: `${username.toLowerCase()}.eth`,
      createdAt: new Date().toISOString(),
      passwordHash: password,
    }

    mockStore.createUser(newUser)
    mockStore.mergeGuestCart(newUser.id)

    const token = `tok_${newUser.id}_${Date.now()}`
    const { passwordHash: _, ...safeUser } = newUser

    return HttpResponse.json({
      token,
      user: safeUser,
    })
  }),

  // Logout
  http.post('/api/auth/logout', async () => {
    await delay(100)
    return HttpResponse.json({ success: true })
  }),
]

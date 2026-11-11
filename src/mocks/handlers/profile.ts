import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'

function getUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '').split('_')[1] || null
  }
  return null
}

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    await delay(100)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const user = mockStore.findUserById(userId)
    if (!user) {
      return HttpResponse.json({ message: 'Perfil não encontrado.' }, { status: 404 })
    }

    const { passwordHash: _, ...safeUser } = user
    return HttpResponse.json(safeUser)
  }),

  http.patch('/api/profile', async ({ request }) => {
    await delay(150)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as any
    const updated = mockStore.updateUser(userId, body)

    if (!updated) {
      return HttpResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 })
    }

    const { passwordHash: _, ...safeUser } = updated
    return HttpResponse.json(safeUser)
  }),

  http.post('/api/profile/password', async ({ request }) => {
    await delay(200)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as any
    const { currentPassword, newPassword } = body

    const user = mockStore.findUserById(userId)
    if (!user || user.passwordHash !== currentPassword) {
      return HttpResponse.json({ message: 'A senha atual informada está incorreta.' }, { status: 400 })
    }

    if (!newPassword || newPassword.length < 6) {
      return HttpResponse.json({ message: 'A nova senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    user.passwordHash = newPassword
    return HttpResponse.json({ success: true, message: 'Senha atualizada com sucesso!' })
  }),
]

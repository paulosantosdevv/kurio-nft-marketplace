export function getUserIdFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }
  const token = auth.replace('Bearer ', '')
  if (token.startsWith('tok_')) {
    const lastUnderscore = token.lastIndexOf('_')
    if (lastUnderscore > 4) {
      return token.slice(4, lastUnderscore)
    }
    return token.slice(4)
  }
  return token
}

export interface UserProfile {
  id: string
  username: string
  email: string
  displayName: string
  nickname: string
  avatarUrl: string
  ensName?: string
  bio?: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: UserProfile
}

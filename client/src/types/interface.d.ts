export interface User {
  id: string
  email: string
  names: string
  lastNames: string
  iat?: number
  exp?: number
}

export interface LoginResponse {
  message: string
  userData: User
}
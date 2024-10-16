export interface User {
  id: string
  email: string
  names: string
  lastNames: string
}

export interface LoginResponse {
  message: string
  userData: User
}
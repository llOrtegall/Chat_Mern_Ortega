import { Router } from 'express'
import { login, profile, register, people } from '../Controllers/User.controller.js'

export const userRoutes = Router()

userRoutes.post('/login', login)

userRoutes.post('/register', register)

userRoutes.get('/profile', profile)

userRoutes.get('/people', people)
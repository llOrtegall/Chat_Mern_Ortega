import { Router } from 'express'
import { messages } from '../Controllers/Mess.controllers.js'

export const messRoutes = Router()

messRoutes.get('/messages/:userId', messages)
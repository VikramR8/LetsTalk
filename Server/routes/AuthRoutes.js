import {Router} from 'express'
import { login, signup } from '../controllers/AuthController.js'


const authRoutes = Router()
authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.put("/getUserInfo", getUserInfo)

export default authRoutes

import {Router} from 'express'
import { getUserInfo, login, signup, updateprofile,addProfileImage, deleteProfileImage } from '../controllers/AuthController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js'
import multer from "multer"


const authRoutes = Router()
const upload=multer({dest:"/uploads/profiles/"})

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.get("/userinfo",verifyToken, getUserInfo)
authRoutes.post("/updateinfo",verifyToken, updateprofile)
authRoutes.post("/profileimage", verifyToken, upload.single("profile-image"), addProfileImage)
authRoutes.delete("/deleteprofileimage", verifyToken,deleteProfileImage)

export default authRoutes

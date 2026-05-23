
import express from 'express'

import { getAdminStats } from '../controller/adminStats.js'
import { isAdmin } from '../middleware/auth.middleware.js'
const router=express.Router()



router.get("/admin/stats",isAdmin,getAdminStats)

export default router
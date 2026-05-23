

import express from 'express'
import { addReview, getAllDj_withSorting, getAllReviewForSingleDj } from '../controller/addReview.js'
import { checkUser } from '../middleware/auth.middleware.js'

const router =express.Router()



router.post("/add-review/:id",checkUser,addReview,)
router.get("/get-top-rated-dj",getAllDj_withSorting)
router.get("/get-all-reviews-of-dj/:id",getAllReviewForSingleDj)





export default router
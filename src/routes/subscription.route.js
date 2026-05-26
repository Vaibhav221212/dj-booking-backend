import express from "express"
import { createSubscription,confirmSubscription,checkSubscription, cancelPayment } from "../controller/subscription.js"
import { checkVendor } from "../middleware/vendorAuth.middleware.js"
const router =express.Router()

router.post("/create-payment",createSubscription)
router.post("/confirm-payment",confirmSubscription)
router.get("/check-subscription",checkVendor,checkSubscription)
router.post("/cancel-payment",cancelPayment)



export default router
import express from "express";
import { checkUser } from "../middleware/auth.middleware.js";
import {
    acceptBooking,
  cancelBooking,
  crateBooking,
  getsingleBooking,
  rejectBooking,
  userBookings,
  vendorBooking,
} from "../controller/book.controller.js";
import { checkVendor } from "../middleware/vendorAuth.middleware.js";


 const router = express.Router();

router.post("/create-booking/:id", checkUser, crateBooking);
router.delete("/cancel-booking/:id", checkUser, cancelBooking);

// not need currently
router.get("/get-single-booking/:id", checkUser, getsingleBooking); //not need currently

router.get("/get-all-user-bookings/:role", userBookings);
router.get("/get-all-vendor-bookings",checkVendor,vendorBooking);
router.patch("/accept-booking/:id",checkVendor,acceptBooking);
router.patch("/reject-booking/:id",checkVendor,rejectBooking);


export default router 

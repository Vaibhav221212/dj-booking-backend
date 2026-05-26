import express from "express";
import {
  createDjProfile,
  getDjProfiles,
  getSingleProfile,
  vendorProfile,
  updateAvailability,
  updateDjProfile,
  deleteDjProfile,
} from "../controller/dj.controller.js";

import { checkVendor } from "../middleware/vendorAuth.middleware.js";
import { checkUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadFile.js";
const router = express.Router();

router.post(
  "/createDjProfile",
  checkVendor,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 10 },
  ]),
  createDjProfile,
);
// based on user search
router.get("/getAll-dj-Profile", getDjProfiles);
router.get("/getSingle-dj-profile/:id", getSingleProfile); // when user a click a single dj profile
router.get("/getSingle-dj-profile-for-vendor", checkVendor, vendorProfile); //when vendor click there profile

router.delete("/deleteDjProfile", checkVendor, deleteDjProfile);

router.patch(
  "/updateDjProfile",
  checkVendor,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 10 },
  ]),
  updateDjProfile,
);
router.patch("/updateAvailability", checkVendor, updateAvailability);

export default router;

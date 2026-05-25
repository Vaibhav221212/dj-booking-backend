import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";

import userRoutes from "./src/routes/user.route.js";
import djRoutes from "./src/routes/dj.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import reviewRoutes from "./src/routes/review.route.js";
import adminRoutes from "./src/routes/admin.route.js";

dns.setDefaultResultOrder("ipv4first");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// ✅ FIXED CORS (this was wrong in your code)
app.use(
  cors({
    origin: [
      "https://dmixx.netlify.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    credentials: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(userRoutes);
app.use(djRoutes);
app.use(bookingRoutes);
app.use(reviewRoutes);
app.use("/uploads", express.static("uploads"));
app.use(adminRoutes);

export default app;

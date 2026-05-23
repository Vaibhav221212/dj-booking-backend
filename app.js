import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRutes from "./src/routes/user.route.js";
import djRoutes from "./src/routes/dj.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import revireRoutes from "./src/routes/review.route.js";
import adminRoutes from './src/routes/admin.route.js'

import reviewModel from "./src/models/review.model.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:  "http://10.138.90.235:5173",
    credentials: true,
  }),
);

app.get(req,res)=>
{
  res.send("hello")
}
app.use(userRutes);
app.use(djRoutes);
app.use(bookingRoutes);
app.use(revireRoutes);
app.use("/uploads", express.static("uploads"));
app.use(adminRoutes)


export default app;

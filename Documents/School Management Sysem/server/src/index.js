import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:517\d$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
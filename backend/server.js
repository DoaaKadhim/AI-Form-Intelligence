import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// AI ROUTES
app.use("/api/ai", aiRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
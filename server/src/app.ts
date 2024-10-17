import express from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import { errorHandler } from "./utils/errorHandler";
import { config } from "./config/config";

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;

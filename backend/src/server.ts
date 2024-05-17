import express, { Request, Response } from "express";
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const app = express();
const PORT = process.env.PORT ?? 5000;
const excelRoutes=require("./routes/excelRoutes")
require("dotenv").config();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api", excelRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

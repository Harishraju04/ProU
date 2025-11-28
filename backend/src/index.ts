import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
import { teamRouter } from "./routes/team";
import { taskRouter } from "./routes/task";
import { adminRouter } from "./routes/admin";
import { analyticRouter } from "./routes/analytic";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3001",   // frontend origin
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/team",teamRouter);
app.use("/api/v1/task",taskRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/analytics",analyticRouter);

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
})
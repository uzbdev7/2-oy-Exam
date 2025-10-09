import express from "express"
import dotenv from "dotenv";
import UserRouter from "./routes/userRoutes";

dotenv.config();

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000;
app.use("/users",UserRouter)

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti`);
});
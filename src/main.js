import express from "express"
import dotenv from "dotenv";
import mainRouter from "./routes/main.routes.js"

dotenv.config();

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000;

app.use("/", mainRouter);

// Bu yerda har qanday hatoni tutib oladi.
app.use((err, req, res, next) => {
  console.error("Error handler:", err.message);

// kelgan hatoni statusini belgilab consolga chiqaradi.
  const status = err.status || 500;

  res.status(status).json({
    message: err.message || "Serverda xatolik yuz berdi."
  });
});

app.listen(PORT, () => {console.log(`✅ Server ${PORT}-portda ishlayapti`);});


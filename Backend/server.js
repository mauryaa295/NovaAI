import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cors from "cors";

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const port = 3000;
app.listen(port, () => {
  console.log("server is lisening on port :", port);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with DataBase");
  } catch (err) {
    console.log("Failed to connect with Db", err);
  }
};

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       options,
//     );
//     const data = await response.json();
//     res.send(data?.choices[0]?.message?.content);
//   } catch (error) {
//     console.log(error);
//   }
// });

// import Groq from "groq-sdk";
// const client = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// let message = "bubble sort code";

// const response = await client.chat.completions.create({
//   model: "llama-3.1-8b-instant",
//   messages: [
//     {
//       role: "user",
//       content: message,
//     },
//   ],
// });

// console.log(response.choices[0].message.content);

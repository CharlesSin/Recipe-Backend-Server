import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/recipes", recipesRouter);

app.get("/", function (req, res) {
    res.send("Server Start Up Successfull")
})

app.listen(3001, () => console.log("Server started"));

import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { userRouter } from "./src/routes/user.js";
import { recipesRouter } from "./src/routes/recipes.js";

dotenv.config();

const app = express();

const whitelist = [process.env.WHITELISTAPI01, process.env.WHITELISTAPI02]
// whitelist.push(process.env.WHITELISTAPI01);
// whitelist.push(process.env.WHITELISTAPI02);

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/auth", userRouter);
app.use("/api/recipes", recipesRouter);

app.get("/", function (req, res) {
    res.send("Server Start Up Successfull")
})

app.listen(3001, () => console.log("Server started"));

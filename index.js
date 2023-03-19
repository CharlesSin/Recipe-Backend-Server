import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { userRouter } from "./src/routes/user.js";
import { recipesRouter } from "./src/routes/recipes.js";

dotenv.config();

const app = express();

const whitelist = [process.env.WHITELISTAPI01, process.env.WHITELISTAPI02];
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(express.json());
app.use(cors(corsOptionsDelegate));

app.use("/api/auth", userRouter);
app.use("/api/recipes", recipesRouter);

app.get("/", cors(), (req, res) => {
    res.send("Server Start Up Successfull")
})

app.listen(3001, () => console.log("Server started"));

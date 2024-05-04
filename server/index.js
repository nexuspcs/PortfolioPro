import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
/* Configurations (mainly used as a boiler plate to config these packages in the long run m*/
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


console.log("Helloss World");
/* Mongoose SETUP */
const PORT = process.env.PORT || 9000;
console.log("Port from ENV", PORT);


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
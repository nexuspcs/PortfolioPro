import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import kpiRoutes from "./routes/kpi.js";
import KPI from "./models/KPI.js";
import { kpis } from "./data/data.js";
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

/* Routes */
app.use("/kpi", kpiRoutes);

console.log(" "); // using for whitespace
console.log("Helloss World");
/* Mongoose SETUP */
const PORT = process.env.PORT || 9000;
console.log("Port from as specified from .env file: ", PORT);
console.log(" "); // using for whitespace


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        db.dropDatabase()
        //await mongoose.connection.db.dropDatabase(); // seed data base with info, but remove initial data.
        // KPI.insertMany(kpis) .then(insertedDocuments => {
        //     console.log('KPIs inserted successfully:', insertedDocuments);
        //   }).catch(error => {
        //     console.error('Error inserting KPIs:', error);
        //   });// seed database with data
    })
    .catch((error) => console.log(`${error} did not connect`));
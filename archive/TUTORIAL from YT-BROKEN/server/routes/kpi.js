import express from "express";
import KPI from "../models/KPI.js";

const router = express.Router();

router.get("/kpis", async (req, res) => {
    try {
        const kpis = await KPI.find();
        res.status(200).json(kpis); // return a success response with the data to the front end (200 status code means success)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;
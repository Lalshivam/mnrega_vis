import express from "express";
import { getBiharDistricts, getMeta, getDistrictData } from "../controllers/district.controller.js";


const router = express.Router();



router.get("/bihar", getBiharDistricts); // /api/bihar?fin_year=2024-2025



// Add meta + data endpoints used by frontend
router.get("/meta", getMeta); // GET /api/meta
router.get("/data", getDistrictData); // GET /api/data?district_code=0509&fin_year=2021-2022

export default router;

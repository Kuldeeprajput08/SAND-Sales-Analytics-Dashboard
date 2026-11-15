import express from "express";
import {
  getAllSales,
  getSalesSummary,
  getSalesByCategory,
  getSalesByRegion,
  getSalesByTrend,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.get("/summary", getSalesSummary);
router.get("/by-category", getSalesByCategory);
router.get("/by-region", getSalesByRegion);
router.get("/trend", getSalesByTrend);
export default router;

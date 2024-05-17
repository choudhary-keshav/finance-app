import express from "express";
import { saveExcelData } from "../controllers/excelController";

const router = express.Router();

router.post("/saveExcelData", saveExcelData);

module.exports = router;

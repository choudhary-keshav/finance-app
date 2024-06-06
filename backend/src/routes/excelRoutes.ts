import express from 'express';
import { saveExcelData } from '../controllers/excelControllers';

const router = express.Router();

router.post('/saveExcelData', saveExcelData);

module.exports = router;

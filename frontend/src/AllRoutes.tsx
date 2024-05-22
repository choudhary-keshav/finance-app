import React from "react";
import { Route, Routes } from "react-router-dom";
import { Settings } from "./components/SettingsComponent/Settings";
import { UploadExcel } from "./components/UploadComponent/UploadExcel";
import { AnalyseExpense } from "./components/AnalyseExpenseComponent/AnalyseExpense";
import { ViewExpense } from "./components/ViewExpenseComponent/ViewExpense";

const AllRoutes = () => {
  return (
    <div className="AllRoutes">
      <Routes>
        <Route path="/upload" element={<UploadExcel />} />
        <Route path="/view" element={<ViewExpense />} />
        <Route path="/analyse" element={<AnalyseExpense />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;

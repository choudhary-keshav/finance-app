import React from "react";
import { Route, Routes } from "react-router-dom";
import UploadExcel from "./components/UploadComponent/UploadExcel";
import { AnalyseExpense } from "./components/AnalyseExpenseComponent/AnalyseExpense";
import { ViewExpense } from "./components/ViewExpenseComponent/ViewExpense";
import Dashboard from "./components/DashboardComponent/Dashboard";
import Profile from "./components/Profile/Profile";

const AllRoutes = () => {
  return (
    <div className="AllRoutes" style={{ width: "100%" }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadExcel />} />
        <Route path="/view" element={<ViewExpense />} />
        <Route path="/analyse" element={<AnalyseExpense />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;

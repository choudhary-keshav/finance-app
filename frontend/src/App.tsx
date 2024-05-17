import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import ProfilePage from "./pages/Profilepage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;

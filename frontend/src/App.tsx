import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/login/Signup/UserAuthentication";
import ProfilePage from "./pages/HomePage/Profilepage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage children={undefined} />} />
      </Routes>
    </div>
  );
}

export default App;

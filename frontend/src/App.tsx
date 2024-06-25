import React from "react";
import { Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/HomePage/Profilepage";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import UserVerification from "./components/UserVerification/userVerification";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/login" element={<UserAuthentication />} />
            <Route path="/Signup" element={<UserAuthentication />} />
            <Route element={<UserVerification />}>
              <Route path="/*" element={<ProfilePage children={undefined} />} />
            </Route>
          </Routes>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;

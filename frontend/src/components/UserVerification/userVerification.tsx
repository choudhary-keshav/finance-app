import { Outlet } from "react-router-dom";
import UserAuthentication from "../../pages/UserAuthentication/UserAuthentication";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authenticationSlice";

const UserVerification = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  if (token) {
    const userData: {
      payload: {
        _id: string;
        name: string;
        email: string;
        pic: string;
      };
    } = jwtDecode(token || "");
    dispatch(setUser({ data: { ...userData.payload } }));
  }
  return token ? <Outlet /> : <UserAuthentication />;
};

export default UserVerification;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./styles.css";
import { useLazyViewTransactionQuery } from "../../redux/services/updateProfileApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.authentication);
  const originalName = user?.data?.name;
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editName, setEditName] = useState(originalName);
  const [editPassword, setEditPassword] = useState("");
  const [updateTrigger] = useLazyViewTransactionQuery();
  const [show, setShow] = useState(false);
  const passwordRegex = /(?=.*[!@#\$%\^\&*\)\(+=._-])/g;
  const handleEditNameToggleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isEditingName) {
      setEditName(originalName);
    }
    setIsEditingName(!isEditingName);
  };

  const handleEditPasswordToggleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isEditingPassword) {
      setEditPassword("");
    }
    setIsEditingPassword(!isEditingPassword);
  };
  const toast = useToast();

  const showNotification = (
    title: string,
    status: "error" | "info" | "warning" | "success" | "loading" | undefined
  ) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleSubmitName = () => {
    if (!editName) {
      showNotification("Please fill the name", "warning");
      return;
    }
    if (editName.length > 60) {
      showNotification("Name cannot be longer than 60 characters", "warning");
      return;
    }
    try {
      setIsEditingName(false);
      const query = { updatedName: editName };
      updateTrigger(query).then((response: any) => {
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          navigate("/profile");
        }
      });
      showNotification("Update Successful", "success");
    } catch (err: any) {
      err && showNotification(err, "error");
    }
  };

  const handleSubmitPassword = () => {
    if (editPassword.length < 8 || editPassword.length > 60) {
      showNotification("Password cannot be smaller than 8 and longer than 60 characters", "warning");
      return;
    }
    if (!editPassword.match(passwordRegex)) {
      showNotification("Password must have atleast one special character", "warning");
      return;
    }
    try {
      setIsEditingPassword(false);
      const query = { updatedPassword: editPassword };
      updateTrigger(query).then((response: any) => {
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          navigate("/profile");
        }
      });
      showNotification("Update Successful", "success");
      setEditPassword("");
    } catch (err: any) {
      err && showNotification(err, "error");
    }
  };
  return (
    <div className="container">
      <h1>UserProfile</h1>
      <div className="profileWrapper">
        <h3>Profile Image</h3>
        <div className="imageContainer">
          <img src={user?.data?.pic} alt="" />
        </div>
        <h3>Profile Details</h3>
        <label htmlFor="email">Name:</label>
        <div className="userDetail">
          <input
            className="detailInput"
            type="text"
            value={editName}
            disabled={!isEditingName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={(e) => handleEditNameToggleButton(e)}>
            {isEditingName ? "Cancel Edit" : "Edit Name"}
          </button>
          {isEditingName && (
            <button type="button" className="btn btn-success" onClick={handleSubmitName}>
              Submit
            </button>
          )}
        </div>
        <label htmlFor="email">New Password:</label>
        <div className="userDetail">
          <InputGroup size="md">
            <Input
              className="detailInput"
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={editPassword}
              disabled={!isEditingPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" className="showButton" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <button type="button" className="btn btn-primary" onClick={(e) => handleEditPasswordToggleButton(e)}>
            {isEditingPassword ? "Cancel" : "Make New"}
          </button>
          {isEditingPassword && (
            <button type="button" className="btn btn-success" onClick={handleSubmitPassword}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

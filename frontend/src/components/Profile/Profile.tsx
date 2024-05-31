import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./styles.css";
import { useLazyViewTransactionQuery } from "../../redux/services/updateProfileApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.authentication);
  const originalName = user?.data?.name;
  const originalEmail = user?.data?.email;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(originalName);
  const [editEmail, setEditEmail] = useState(originalEmail);
  const [updateTrigger] = useLazyViewTransactionQuery();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEditButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isEditing) {
      setEditName(originalName);
      setEditEmail(originalEmail);
    }
    setIsEditing(!isEditing);
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

  const handleSubmit = () => {
    if (!editName || !editEmail) {
      showNotification("Please Fill all the Fields", "warning");
      return;
    }
    if (editName.length > 60) {
      showNotification("Name cannot be longer than 60 characters", "warning");
      return;
    }
    if (editEmail.length > 320) {
      showNotification("Email cannot be longer than 320 characters", "warning");
      return;
    }
    if (!editEmail.match(emailRegex)) {
      showNotification("Email must be a valid address", "warning");
      return;
    }
    try {
      setIsEditing(false);
      const query = { updatedName: editName, updatedEmail: editEmail };
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
        <input type="text" value={editName} disabled={!isEditing} onChange={(e) => setEditName(e.target.value)} />
        <label htmlFor="email">Email:</label>
        <input type="text" value={editEmail} disabled={!isEditing} onChange={(e) => setEditEmail(e.target.value)} />
        <div className="buttonDiv">
          <button type="button" className="btn btn-primary" onClick={(e) => handleEditButton(e)}>
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

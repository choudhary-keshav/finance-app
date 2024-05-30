import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./styles.css";

const Profile = () => {
  const user = useSelector((state: RootState) => state.authentication);
  const originalName = user?.data?.name;
  const originalEmail = user?.data?.email;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(originalName);
  const [editEmail, setEditEmail] = useState(originalEmail);
  const handleEditButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isEditing) {
      setEditName(originalName);
      setEditEmail(originalEmail);
    }
    setIsEditing(!isEditing);
  };
  return (
    <div className="container">
      <div className="profileWrapper">
        <div className="imageContainer">
          <img src="https://i.pinimg.com/474x/0a/5e/80/0a5e80c2696ffa0c07304fe22631b738.jpg" alt="" />
        </div>
        <label htmlFor="email">Name:</label>
        {isEditing ? (
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
        ) : (
          <span>{originalName}</span>
        )}
        <br />
        <label htmlFor="email">Email:</label>
        {isEditing ? (
          <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
        ) : (
          <span>{originalEmail}</span>
        )}
        <br />
        <button type="button" className="btn btn-primary" onClick={(e) => handleEditButton(e)}>
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-success" onClick={(e) => handleEditButton(e)}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

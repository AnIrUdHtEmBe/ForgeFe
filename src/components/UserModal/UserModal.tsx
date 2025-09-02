import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
import { DEFAULT_ICON_SIZE } from "../../default";
import type { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";
import { uploadImage } from "../../api/images";
import { useNavigate } from "react-router-dom";

interface UserModalProps {
  modal: (value: boolean) => void;
  profilePic?: string | null; // Add this prop
}

function UserModal(props: UserModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(
    props.profilePic || null
  ); // Add this state

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddingPicture = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar("Picture added successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        setCurrentProfilePic(response.data?.photoThumbUrl || null);

        // Optionally close modal after success
        props.modal(false);
      } else {
        console.error("Failed to add picture");
      }
    };

    const onReject = (error: unknown) => {
      enqueueSnackbar("Failed to add picture", {
        variant: "error",
        autoHideDuration: 3000,
      });
    };

    const userId = localStorage.getItem("userId");
    if (!userId) {
      enqueueSnackbar("User ID not found", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    uploadImage(onAccept, onReject, userId, selectedFile);
  };
  const handleCancel = () => {
    setSelectedFile(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="profile-overlay" onClick={() => props.modal(false)}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="profile-button" onClick={() => props.modal(false)}>
          &times;
        </button>
        <div className="profile-content">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile Preview"
              className="profile-preview"
            />
          ) : currentProfilePic ? (
            <img
              src={currentProfilePic}
              alt="Current Profile"
              className="profile-preview"
            />
          ) : (
            <FaRegUserCircle size={100} color="var(--grey-900)" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="profile-details">Add a Profile Picture</div>

        {selectedFile ? (
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button
              className="profile-btn"
              onClick={handleAddingPicture}
              style={{ flex: 1 }}
            >
              SAVE
            </button>
            <button
              className="profile-btn"
              onClick={handleCancel}
              style={{ flex: 1, backgroundColor: "var(--grey-200)" }}
            >
              CANCEL
            </button>
          </div>
        ) : (
          <button className="profile-btn" onClick={handleAddingPicture}>
            ADD
          </button>
        )}

        <button
          className="profile-btn"
          onClick={() => {
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserModal;

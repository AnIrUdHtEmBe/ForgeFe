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
  profilePic?: string | null;
}

function UserModal(props: UserModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(
    props.profilePic || null
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false); // Add this state

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add logout confirmation handlers
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    // Clear user data if needed
    localStorage.removeItem("userId");
    // Add any other logout logic here
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="profile-overlay" onClick={() => props.modal(false)}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="profile-button" onClick={() => props.modal(false)}>
          &times;
        </button>
        
        {/* Show logout confirmation dialog */}
        {showLogoutConfirm ? (
          <div className="profile-content">
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h3 style={{ marginBottom: "20px", color: "var(--grey-900)" }}>
                Confirm Logout
              </h3>
              <p style={{ marginBottom: "30px", color: "var(--grey-700)" }}>
                Are you sure you want to logout?
              </p>
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <button
                  className="profile-btn"
                  onClick={handleLogoutCancel}
                  style={{ 
                    flex: 1, 
                    backgroundColor: "var(--grey-200)" 
                  }}
                >
                  CANCEL
                </button>
                    <button
                      className="profile-btn"
                      onClick={handleLogoutConfirm}
                      style={{ 
                        flex: 1, 
                        backgroundColor: "var(--rust-500)" 
                      }}
                    >
                      LOGOUT
                    </button>
              </div>
            </div>
          </div>
        ) : (
          // Show normal profile content
          <>
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
                  onClick={handleCancel}
                  style={{ flex: 1, backgroundColor: "var(--grey-200)" }}
                >
                  CANCEL
                </button>
                <button
                  className="profile-btn"
                  onClick={handleAddingPicture}
                  style={{ flex: 1 }}
                >
                  SAVE
                </button>
              </div>
            ) : (
              <button className="profile-btn" onClick={handleAddingPicture}>
                ADD
              </button>
            )}

            <button
              className="profile-btn"
              onClick={handleLogoutClick} // Changed from direct navigation
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserModal;
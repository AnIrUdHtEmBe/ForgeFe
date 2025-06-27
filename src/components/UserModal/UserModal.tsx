import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
import { DEFAULT_ICON_SIZE } from "../../default";
import type { Axios, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";
import { uploadImage } from "../../api/images";

interface UserModalProps {
  modal: (value: boolean) => void;
}

function UserModal(props: UserModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click(); // open file dialog
  };

  const handelAddingPicture = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar("Picture added successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
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

    if (!selectedFile) {
      enqueueSnackbar("No image selected", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }

    uploadImage(onAccept, onReject, userId, selectedFile);
  };

  return (
    <div className="profile-overlay" onClick={() => props.modal(false)}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="profile-button" onClick={() => props.modal(false)}>
          &times;
        </button>
        <div className="profile-content" onClick={handleImageClick}>
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile Preview"
              className="profile-preview"
            />
          ) : (
            <FaRegUserCircle size={100} color="#999" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="profile-details">Add a Profile Picture</div>

        <button
          className="profile-btn"
          onClick={handelAddingPicture}
          disabled={!selectedFile}
        >
          ADD
        </button>
      </div>
    </div>
  );
}

export default UserModal;

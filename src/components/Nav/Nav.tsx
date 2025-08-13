import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
import { DEFAULT_ICON_SIZE } from "../../default";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserModal from "../UserModal/UserModal";
import type { AxiosResponse } from "axios";
import { getImagesById } from "../../api/images";
import { enqueueSnackbar } from "notistack";
import { TbMessage } from "react-icons/tb";

const Nav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [profileModal, setProfileModal] = useState(false);

  const [profilePic, setProfilePic] = useState<string | null>(null);

  const getProfilePhoto = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log("Response received:", response.data);
        if (response.data !== null) {
          setProfilePic(response.data);
          console.log("Profile photo fetched successfully:", response.data);
        } else {
          console.error("No image found for the user");
          return null;
        }
      } else {
        console.error("Failed to fetch profile photo");
        return null;
      }
    };
    const onReject = (error: unknown) => {
      console.error("Error fetching profile photo:", error);
      return null;
    };

    const userId = localStorage.getItem("userId");
    if (!userId) {
      enqueueSnackbar("User ID not found", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    getImagesById(onAccept, onReject, userId);
  };

  useEffect(() => {
    if (currentPath !== "/") {
      getProfilePhoto();
    }
  }, [currentPath]);

  return (
    <div className="top-nav-container">
      <div className="nav-left">
        <div
          className="--logo"
          onClick={() => {
            if (currentPath !== "/") {
              navigate("/");
            }
          }}
        >
          <img src="Play_Logo.svg" alt="Logo" />
        </div>
        <div className="--center">
          <span>Sarjapur</span>
        </div>
      </div>

      {currentPath === "/" ? (
        ""
      ) : (
        <div className="nav-right">
          <TbMessage
            size={DEFAULT_ICON_SIZE}
            // onClick={() => {
            // 	navigate(E_Routes.Communications, {
            // 		state: { notifications: notifications },
            // 	});
            // }}
            onClick={() => {
  const userId = localStorage.getItem("userId")?.replace(/^"|"$/g, "");
  window.location.href = `https://chatapp.forgehub.in/?clientId=${userId}`;
}}

            style={{ fontSize: "30px", color: "black" }}
          />
          <span className="--username">
            {localStorage?.getItem("userName")?.slice(1).slice(0, -1)}
          </span>
          <div
            className="--icon"
            onClick={() => setProfileModal(!profileModal)}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="profile-icon"
                // onClick={getProfilePhoto}
              />
            ) : (
              <FaRegUserCircle size={DEFAULT_ICON_SIZE} />
            )}
          </div>
        </div>
      )}

      {profileModal && <UserModal modal={setProfileModal}></UserModal>}
    </div>
  );
};

export default Nav;

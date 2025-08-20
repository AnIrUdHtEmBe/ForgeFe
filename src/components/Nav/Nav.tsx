import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
// git stash
import { DEFAULT_ICON_SIZE } from "../../default";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UserModal from "../UserModal/UserModal";
import type { AxiosResponse } from "axios";
import { getImagesById } from "../../api/images";
import { enqueueSnackbar } from "notistack";
import { TbMessage } from "react-icons/tb";
import * as Ably from "ably";
import { ChatClient, LogLevel } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import axios from "axios";

const Nav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [profileModal, setProfileModal] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Notification states
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [userRoomsData, setUserRoomsData] = useState<any[]>([]);
  const [monitoredRooms, setMonitoredRooms] = useState<Set<string>>(new Set());
  
  // Refs for cleanup
  const roomConnections = useRef<{ [key: string]: any }>({});
  const subscribedRooms = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get client ID
  const clientId = localStorage.getItem("userId")?.slice(1, -1) || "";
  
  // Ably setup
  const CHAT_API_KEY = "0DwkUw.pjfyJw:CwXcw14bOIyzWPRLjX1W7MAoYQYEVgzk8ko3tn0dYUI";
  const realtimeClient = useMemo(
    () => new Ably.Realtime({ key: CHAT_API_KEY, clientId }),
    [clientId]
  );
  
  const chatClient = useMemo(
    () => new ChatClient(realtimeClient, { logLevel: LogLevel.Info }),
    [realtimeClient]
  );

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

  // Cleanup connections function
  const cleanupConnections = useCallback(async () => {
    console.log("🧹 Nav: Starting connection cleanup");
    
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Cleanup room connections
    const connectionsToCleanup = Object.entries(roomConnections.current);
    
    for (const [roomKey, room] of connectionsToCleanup) {
      try {
        console.log("🗑️ Nav: Cleaning up room:", roomKey);
        if (room && room.status !== "released" && typeof room.detach === 'function') {
          await room.detach();
        }
      } catch (error) {
        console.error(`Nav: Error detaching room ${roomKey}:`, error);
      }
    }
    
    roomConnections.current = {};
    setMonitoredRooms(new Set());
    subscribedRooms.current = new Set();
    
    console.log("✅ Nav: Connection cleanup completed");
  }, []);

  // Setup notification monitoring
  const setupNotificationMonitoring = useCallback(async () => {
    if (!clientId || !chatClient) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.get(
        `https://play-os-backend.forgehub.in/human/human/${clientId}`,
        { signal: abortControllerRef.current.signal }
      );
      
      const rooms = Array.isArray(response.data) ? response.data : response.data.rooms || [];
      setUserRoomsData(rooms);

      const roomTypes = ['FITNESS', 'WELLNESS', 'SPORTS', 'NUTRITION', 'RM'];
      let hasAnyUnread = false;
      
      for (const roomType of roomTypes) {
        const room = rooms.find((r: any) => r.roomType === roomType);
        if (!room) continue;

        const roomKey = `${room.chatId}`;

        // Skip if we're already monitoring this room
        if (monitoredRooms.has(roomKey) && roomConnections.current[roomKey]) {
          console.log("✅ Nav: Already monitoring room:", roomKey);
          continue;
        }

        try {
          console.log("🔄 Nav: Setting up monitoring for:", roomKey);
          
          const ablyRoom = await chatClient.rooms.get(roomKey);
          
          // Check if room was released during async operation
          if (ablyRoom.status === "released") {
            console.log("⚠️ Nav: Room was released during setup:", roomKey);
            continue;
          }
          
          if (ablyRoom.status !== "attached") {
            await ablyRoom.attach();
          }

          // Double-check room status after attach
          if (ablyRoom.status === "released" as any) {
            console.log("⚠️ Nav: Room released after attach:", roomKey);
            continue;
          }

          roomConnections.current[roomKey] = ablyRoom;

          // Check for initial unread messages
          const checkInitialMessages = async () => {
            try {
              if (ablyRoom.status === "released") return;
              
              const messageHistory = await ablyRoom.messages.history({ limit: 60 });
              const messages = messageHistory.items;
              const seenByTeamAtDate = new Date(room.handledAt * 1000);
              
              let hasNewFromOthers = false;
              
              messages.forEach((message: any) => {
                const messageTimestamp = message.createdAt || message.timestamp;
                const isFromOtherUser = message.clientId !== clientId;
                
                if (
                  messageTimestamp &&
                  new Date(messageTimestamp) > seenByTeamAtDate &&
                  isFromOtherUser
                ) {
                  hasNewFromOthers = true;
                }
              });

              if (hasNewFromOthers) {
                hasAnyUnread = true;
              }
            } catch (error) {
              console.error(`Nav: Initial message check error for ${roomKey}:`, error);
            }
          };

          await checkInitialMessages();

          // Subscribe to new messages
          if (!subscribedRooms.current.has(roomKey)) {
            const messageListener = (messageEvent: any) => {
              if (ablyRoom.status === "released") return;
              
              const message = messageEvent.message || messageEvent;
              const messageTimestamp = message.createdAt || message.timestamp;
              const isFromOtherUser = message.clientId !== clientId;

              setUserRoomsData((prevRooms) => {
                const currentRoom = prevRooms.find(r => r.roomType === roomType);
                if (!currentRoom) return prevRooms;
                
                const currentSeenByTeamAtDate = new Date(currentRoom.handledAt * 1000);

                if (
                  messageTimestamp &&
                  new Date(messageTimestamp) > currentSeenByTeamAtDate &&
                  isFromOtherUser
                ) {
                  setHasUnreadMessages(true);
                }

                return prevRooms;
              });
            };

            ablyRoom.messages.subscribe(messageListener);
            subscribedRooms.current.add(roomKey);
          }

          setMonitoredRooms(prev => new Set([...prev, roomKey]));
          console.log("✅ Nav: Successfully set up monitoring for:", roomKey);
          
        } catch (error) {
          console.error(`Nav: Failed to setup monitoring for ${roomType}:`, error);
        }
      }

      // Update the overall unread state
      setHasUnreadMessages(hasAnyUnread);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Nav: Failed to setup notification monitoring:", error);
      }
    }
  }, [clientId, chatClient]);

  // Handle TbMessage click - clear notifications and navigate
  const handleMessageClick = () => {
    // Clear the notification state
    setHasUnreadMessages(false);
    
    // Navigate to chat app
    const userId = localStorage.getItem("userId")?.replace(/^"|"$/g, "");
    window.location.href = `https://chatapp.forgehub.in/?clientId=${userId}`;
  };

  useEffect(() => {
    if (currentPath !== "/") {
      getProfilePhoto();
    }
  }, [currentPath]);

  // Setup notification monitoring
  useEffect(() => {
    if (clientId && chatClient && currentPath !== "/") {
      setupNotificationMonitoring();

      // Set up periodic refresh (every 30 seconds)
      const intervalId = setInterval(() => {
        setupNotificationMonitoring();
      }, 30000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [clientId, chatClient, currentPath, setupNotificationMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupConnections();
    };
  }, [cleanupConnections]);

  if (!realtimeClient || !chatClient) {
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
        {currentPath !== "/" && (
          <div className="nav-right">
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
  }

  return (
    <ChatClientProvider client={chatClient}>
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <TbMessage
                size={DEFAULT_ICON_SIZE}
                onClick={handleMessageClick}
                style={{ fontSize: "30px", color: "black", cursor: "pointer" }}
              />
              {hasUnreadMessages && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ff4444',
                    borderRadius: '50%',
                    border: '2px solid white',
                    zIndex: 10
                  }}
                />
              )}
            </div>
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
                />
              ) : (
                <FaRegUserCircle size={DEFAULT_ICON_SIZE} />
              )}
            </div>
          </div>
        )}

        {profileModal && <UserModal modal={setProfileModal}></UserModal>}
      </div>
    </ChatClientProvider>
  );
};

export default Nav;
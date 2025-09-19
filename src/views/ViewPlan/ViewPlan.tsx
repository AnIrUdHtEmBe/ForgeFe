/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { categories, DEFAULT_ICON_SIZE, SNACK_AUTO_HIDE } from "../../default";
import "./styles.css";
import { Checkbox } from "@mui/material";
import type { t_plan } from "../../types/plan";
import {
  formatDate,
  formatDateForB,
  getArrayOfDatesFromSundayToSaturday,
  getWeekRange,
} from "../../utils/date";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import WeekPlanView from "./components/WeekPlanView";
import { FaPlay } from "react-icons/fa";
import { getPlans } from "../../api/plan";
import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import { E_PageState } from "../../types/state";
import { FullScreenLoader } from "../../components/Loader/CustomLoader";
import { enqueueSnackbar } from "notistack";
import { data, useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";
import Button from "../../components/Button/Button.tsx";
import { getUserById, updateNutritionStatus } from "../../api/user";
import type { t_session } from "../../types/session.ts";
import { markActivityComplete } from "../../api/activity.ts";
import { TbMessage } from "react-icons/tb";
import * as Ably from "ably";
import {
  ChatClientProvider,
  ChatRoomProvider,
  useMessages,
} from "@ably/chat/react";
import { ChatClient, ChatMessageEventType, LogLevel } from "@ably/chat";
import { IoPlayCircle } from "react-icons/io5";

interface ChatModalData {
  roomName: string;
  isLoading: boolean;
  sessionData: t_session | null;
  roomDetails: any;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  sessionData: t_session | null;
  roomDetails: any;
}

// Add these interfaces after existing ones
interface SessionInstanceResponse {
  sessionInstanceId: string;
  sessionTemplateId: string;
  userId: string;
  scheduledDate: string;
  activities: Array<{
    activityId: string;
    activityInstanceId: string;
    status: string;
    customReps: any;
  }>;
  status: string;
  rating: number;
  postSessionComment: string | null;
  trainerId: string | null;
  gameId: string | null;
  oneOnoneId: string | null;
  editedActivities: Array<{
    activityId: string;
    description?: string;
    target?: number;
    target2?: number;
    vegNonVeg?: string;
  }>;
  actualValuesActivities: any[];
  vegNonVeg: string;
  type: string;
}

interface SessionTemplate {
  sessionId: string;
  title: string;
  description: string;
  category: string;
  activityIds: string[];
  status: string;
  themes: string[];
  goals: string[];
  editedActivities: Array<{
    activityId: string;
    description?: string;
    target?: number;
    target2?: number;
    vegNonVeg?: string;
  }>;
  vegNonVeg: string;
  type: string;
}

interface ActivityDisplayData {
  description: string;
  target: number | null;
  target2?: number | null;
  vegNonVeg?: string;
}

const ViewPlan = () => {
  //current week plan
  const [showModal, setShowModal] = useState(false);
  const [modalMap, setModalMap] = useState<{ [id: string]: boolean }>({});

  const [weekPlan, setWeekPlan] = useState<t_plan | null>(null);
  const [newWeekPlan, setnewWeekPlan] = useState<t_plan[] | null>(null);
  const [pageState, setPageState] = useState(E_PageState.Unknown);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [weekStartToEndDates, setWeekStartToEndDates] = useState<string[]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const { startOfWeek, endOfWeek, dayOfWeek } = getWeekRange(new Date());
  const [getDate, setgetDate] = useState<Date>(startOfWeek);
  const [type, setType] = useState<string>("");
  const [createGame, setCreateGame] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [availableGroupCount, setAvailableGroupCount] = useState(0);
  const [isLoadingGroupCount, setIsLoadingGroupCount] = useState(false);
  const [chatModalData, setChatModalData] = useState<ChatModalData>({
    roomName: "",
    isLoading: true,
    sessionData: null,
    roomDetails: null,
  });
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  // Add these cache states after existing state declarations
  const [sessionInstanceCache, setSessionInstanceCache] = useState<{
    [key: string]: SessionInstanceResponse;
  }>({});
  const [sessionTemplateCache, setSessionTemplateCache] = useState<{
    [key: string]: SessionTemplate;
  }>({});
  const [enhancedSessionData, setEnhancedSessionData] = useState<{
    [key: string]: any;
  }>({});
  const extractVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchSessionTemplate = async (
    sessionTemplateId: string
  ): Promise<SessionTemplate | null> => {
    if (sessionTemplateCache[sessionTemplateId]) {
      return sessionTemplateCache[sessionTemplateId];
    }

    try {
      const response = await axios.get(
        `https://testforgebackend.forgehub.in/session-templates/${sessionTemplateId}`
      );
      const template = response.data;

      setSessionTemplateCache((prev) => ({
        ...prev,
        [sessionTemplateId]: template,
      }));

      return template;
    } catch (error) {
      console.log("Failed to fetch session template:", error);
      return null;
    }
  };

  const getActivityDisplayData = async (
    activity: any,
    sessionInstanceId: string
  ): Promise<ActivityDisplayData> => {
    // Fetch session instance data
    const sessionInstance = await fetchSessionInstance(sessionInstanceId);

    // 1st Priority: Check sessionInstance.editedActivities
    if (sessionInstance?.editedActivities) {
      const sessionEditedActivity = sessionInstance.editedActivities.find(
        (edited: any) => edited.activityId === activity.activityId
      );

      if (
        sessionEditedActivity &&
        Object.keys(sessionEditedActivity).length > 1
      ) {
        return {
          description:
            sessionEditedActivity.description ?? activity.description,
          target: sessionEditedActivity.target ?? activity.target,
          target2: sessionEditedActivity.target2 ?? activity.target2,
          vegNonVeg: sessionEditedActivity.vegNonVeg ?? activity.vegNonVeg,
        };
      }
    }

    // 2nd Priority: Check sessionTemplate.editedActivities
    if (sessionInstance?.sessionTemplateId) {
      const sessionTemplate = await fetchSessionTemplate(
        sessionInstance.sessionTemplateId
      );

      if (sessionTemplate?.editedActivities) {
        const templateEditedActivity = sessionTemplate.editedActivities.find(
          (edited: any) => edited.activityId === activity.activityId
        );

        if (
          templateEditedActivity &&
          Object.keys(templateEditedActivity).length > 1
        ) {
          return {
            description:
              templateEditedActivity.description ?? activity.description,
            target: templateEditedActivity.target ?? activity.target,
            target2: templateEditedActivity.target2 ?? activity.target2,
            vegNonVeg: templateEditedActivity.vegNonVeg ?? activity.vegNonVeg,
          };
        }
      }
    }

    // 3rd Priority: Fallback to original activity values
    return {
      description: activity.description,
      target: activity.target,
      target2: activity.target2,
      vegNonVeg: activity.vegNonVeg,
    };
  };

  // Add this function after getActivityDisplayData
  const loadEnhancedSessionData = async () => {
    if (!newsessionForCurrentDate || newsessionForCurrentDate.length === 0)
      return;

    const enhancedData: { [key: string]: any } = {};

    for (const session of newsessionForCurrentDate) {
      const sessionInstance = await fetchSessionInstance(
        session.sessionInstanceId
      );

      if (sessionInstance) {
        enhancedData[session.sessionInstanceId] = {
          ...session,
          vegNonVeg: sessionInstance.vegNonVeg,
          editedActivities: sessionInstance.editedActivities,
        };
      } else {
        enhancedData[session.sessionInstanceId] = session;
      }
    }

    setEnhancedSessionData(enhancedData);
  };

  const fetchSessionInstance = async (
    sessionInstanceId: string
  ): Promise<SessionInstanceResponse | null> => {
    if (sessionInstanceCache[sessionInstanceId]) {
      return sessionInstanceCache[sessionInstanceId];
    }

    try {
      const response = await axios.get(
        `https://testforgebackend.forgehub.in/session-instance/${sessionInstanceId}`
      );
      const sessionInstance = response.data;

      setSessionInstanceCache((prev) => ({
        ...prev,
        [sessionInstanceId]: sessionInstance,
      }));

      return sessionInstance;
    } catch (error) {
      console.log("Failed to fetch session instance:", error);
      return null;
    }
  };

  // Add this component after getActivityDisplayData
  // Add this component after loadEnhancedSessionData
  const VegNonVegDot: React.FC<{ vegNonVeg: string }> = ({ vegNonVeg }) => {
    const getColor = () => {
      switch (vegNonVeg) {
        case "VEG":
          return "#10B981";
        case "EGG":
          return "#F59E0B";
        case "NONVEG":
          return "#DC2626";
        default:
          return "#6B7280";
      }
    };

    const getText = () => {
      switch (vegNonVeg) {
        case "VEG":
          return "VEG";
        case "EGG":
          return "EGG";
        case "NONVEG":
          return "NON";
        default:
          return "";
      }
    };

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          marginLeft: "4px",
          padding: "2px 4px",
          border: `2px solid ${getColor()}`,
          borderRadius: "8px",
          fontSize: "9px",
          fontWeight: "600",
          flexShrink: 0,
          height: "18px",
          verticalAlign: "middle",
          // Add this
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: getColor(),
          }}
        />
        <span style={{ color: getColor() }}>{getText()}</span>
      </div>
    );
  };

  const EnhancedActivityItem: React.FC<{
    activity: any;
    sessionInstanceId: string;
    index: number;
    showCheckbox: boolean;
    onCheckboxChange: (
      activityInstanceId: string,
      sessionInstanceId: string
    ) => void;
    showVideoIcon: boolean;
    onVideoClick: (videoLink: string) => void;
  }> = ({
    activity,
    sessionInstanceId,
    index,
    showCheckbox,
    onCheckboxChange,
    showVideoIcon,
    onVideoClick,
  }) => {
    const [displayData, setDisplayData] = useState<ActivityDisplayData>({
      description: activity.description,
      target: activity.target,
      target2: activity.target2,
      vegNonVeg: activity.vegNonVeg,
    });

    useEffect(() => {
      const loadDisplayData = async () => {
        const data = await getActivityDisplayData(activity, sessionInstanceId);
        setDisplayData(data);
      };
      loadDisplayData();
    }, [activity, sessionInstanceId]);

    return (
      <div className="session-information-container">
        <div className="--session-info">
          <div className="--start">
            {showVideoIcon ? (
              activity.videoLink ? (
                <IoPlayCircle
                  size={22}
                  style={{
                    zIndex: 2,
                    position: "relative",
                    verticalAlign: "middle",
                    cursor: "pointer",
                    color: "var(--rust-500)",
                  }}
                  onClick={() => onVideoClick(activity.videoLink)}
                />
              ) : (
                <IoPlayCircle
                  size={22}
                  style={{
                    zIndex: 2,
                    position: "relative",
                    verticalAlign: "middle",
                    color: "var(--grey-400)",
                  }}
                />
              )
            ) : (
              <div className="dot" />
            )}

            <div className="--session">
              <div>
                <div
                  className="--name"
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    lineHeight: "1.4",
                    display: "flex",
                    alignItems: "flex-start", // Change from center to flex-start
                    flexWrap: "nowrap",
                    gap: "0",
                    minHeight: "1.4em", // Add minimum height to ensure consistent baseline
                  }}
                >
                  <span
                    style={{
                      flexShrink: 1,
                      minWidth: 0,
                      lineHeight: "1.4", // Ensure consistent line height
                    }}
                  >
                    {activity.name || "No name"}
                  </span>
                  
                </div>
                
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    lineHeight: "1.4",
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "var(--grey-400)",
                  }}
                >
                  {displayData.description || "No description"}
                </div>
                {displayData.vegNonVeg && (
                    <VegNonVegDot vegNonVeg={displayData.vegNonVeg} />
                  )}
              </div>

              <div style={{ flex: "0 0 80px", minWidth: "82px" }}>
                <div className="--desc">
                  {displayData.target || "-"}
                  {displayData.target
                    ? activity?.unit == "weight"
                      ? "Kg"
                      : activity?.unit == "distance"
                      ? "Km"
                      : activity?.unit == "time"
                      ? "Min"
                      : activity?.unit == "repetitions"
                      ? "Reps"
                      : activity?.unit == "grams"
                      ? "g"
                      : activity?.unit == "meter"
                      ? "m"
                      : activity?.unit == "litre"
                      ? "L"
                      : activity?.unit == "millilitre"
                      ? "ml"
                      : ""
                    : ""}
                </div>
              </div>

              <div
                style={{
                  flex: "0 0 80px",
                  minWidth: "80px",
                  textAlign: "center",
                }}
              >
                <span className="--desc">
                  {displayData.target2
                    ? `${displayData.target2}${
                        activity.unit2
                          ? activity?.unit2 == "weight"
                            ? "Kg"
                            : activity?.unit2 == "distance"
                            ? "Km"
                            : activity?.unit2 == "time"
                            ? "Min"
                            : activity?.unit2 == "repetitions"
                            ? "Reps"
                            : activity?.unit2 == "grams"
                            ? "g"
                            : activity?.unit2 == "meter"
                            ? "m"
                            : activity?.unit2 == "litre"
                            ? "L"
                            : activity?.unit2 == "millilitre"
                            ? "ml"
                            : ""
                          : ""
                      }`
                    : activity.customReps || "-"}
                </span>
              </div>

              {showCheckbox && (
                <div>
                  <Checkbox
                    checked={activity.status === "COMPLETE"}
                    disabled={activity.status == "COMPLETE"}
                    onChange={() =>
                      onCheckboxChange(
                        activity.activityInstanceId,
                        sessionInstanceId
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const clientId = localStorage.getItem("userId")?.slice(1, -1) || "";
  const CHAT_API_KEY =
    "0DwkUw.pjfyJw:CwXcw14bOIyzWPRLjX1W7MAoYQYEVgzk8ko3tn0dYUI";

  const realtimeClient = new Ably.Realtime({ key: CHAT_API_KEY, clientId });

  const chatClient = new ChatClient(realtimeClient, {
    logLevel: LogLevel.Info,
  });

  const navigate = useNavigate();

  const clickHandler = (
    value: string,
    category: string,
    selectedDateISO: string,
    sessionCurrent: t_session
  ) => {
    if (category === "FITNESS") {
      if (value === "personal")
        navigate(E_Routes.bookWellness, {
          state: {
            descriptor: value,
            category: "FITNESS",
            selectedDate: selectedDateISO,
            sessionForCurrentDate: sessionCurrent,
          },
        });
      else navigate(E_Routes.viewCards, { state: { descriptor: value } });
    } else
      navigate(E_Routes.bookWellness, {
        state: {
          descriptor: value,
          category: "WELLNESS",
          selectedDate: selectedDateISO,
          sessionForCurrentDate: sessionCurrent,
        },
      });
  };

  const getUser = (id: string) => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data.userId, "ihiugufytduy");
        const res = updateNutritionStatus(response.data.userId);
        console.log(res);
        if (response.data.type === "admin") {
          setCreateGame(true);
        }
      } else {
        enqueueSnackbar({
          message: "Failed to fetch the user data!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      }
    };
    const onReject = (e: unknown) => {
      console.log(e);
      enqueueSnackbar({
        message: "Failed to fetch the user data!",
        autoHideDuration: SNACK_AUTO_HIDE,
        variant: "error",
      });
    };
    getUserById(onAccept, onReject, id);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId")?.slice(1, -1);
    getUser(userId || "");
  }, []);

  //fetch the plan for user with regard to current week and assign that plan with plan state
  const getUserPlan = () => {
    setPageState(E_PageState.Loading);

    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data[response.data.length - 1], "wwwwsetweekplan");
        setWeekPlan(response.data[response.data.length - 1]);
        setnewWeekPlan([response.data]);
        if (weekNumber != 0) {
          setActiveIndex(0);
        } else {
          setActiveIndex(dayOfWeek);
        }
        setPageState(E_PageState.Accepted);
      } else {
        setPageState(E_PageState.Rejected);
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      }
    };

    const onReject = (e: unknown) => {
      console.log(e);
      enqueueSnackbar({
        message: "Failed to fetch the data!",
        autoHideDuration: SNACK_AUTO_HIDE,
        variant: "error",
      });
      setPageState(E_PageState.Rejected);
    };

    getPlans(
      onAccept,
      onReject,
      // localStorage.getItem("userId") || "",
      localStorage.getItem("userId")?.slice(1, -1) || "",
      formatDateForB(getDate),
      formatDateForB(new Date(getDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    );
  };

  useEffect(() => {
    getUserPlan();
  }, [weekNumber]);

  const arrowRightHandler = () => {
    console.log(activeIndex, weekNumber, "this is right");

    if (activeIndex >= 6) return;

    setActiveIndex(activeIndex + 1);
  };
  const arrowLeftHandler = () => {
    console.log(activeIndex, weekNumber, "this is left");
    if (activeIndex <= 0) return;

    // {
    //   if (weekNumbe // {
    //   setActiveIndex(0);
    //   setWeekNumber(weekNumber + 1);
    //   setgetDate(new Date(getDate.setDate(getDate.getDate() + 7)));
    //   return;
    // }r > 0) {
    //     setActiveIndex(6);
    //     setWeekNumber(weekNumber - 1);
    //     setgetDate(new Date(getDate.setDate(getDate.getDate() - 7)));
    //   } else {
    //     return;
    //   }
    //   return;
    // }
    setActiveIndex(activeIndex - 1);
  };

  console.log(new Date(getDate.setDate(getDate.getDate())));
  useEffect(() => {
    const weekDates = getArrayOfDatesFromSundayToSaturday(
      new Date(getDate.setDate(getDate.getDate()))
    );
    console.log(weekDates, "these are ween");
    setWeekStartToEndDates(weekDates);
  }, [weekNumber]);

  const currentDate = weekStartToEndDates[activeIndex];

  console.log(newWeekPlan, "weekplan");
  // t_session
  const [newsessionForCurrentDate, setnewsessionForCurrentDate] = useState<
    t_session[]
  >([]);
  const [filterSession, setFilterSession] = useState("ALL");

  // useEffect(()=>{
  //   if(!newWeekPlan) return;
  //    const temp_session:t_session[]=[];
  //   const newsessionCurrDate=newWeekPlan?.map((data:t_plan,index:number)=>{
  //     for (const [key,value] of Object.entries(data)){
  //       console.log(value.sessionInstances,"valueeeeeeeeeeeeee")
  //       const response=value?.sessionInstances.filter(
  //       (session:t_session) => formatDate(session.scheduledDate) === formatDate(currentDate)
  //       )
  //       // const response2=value?.sessionInstances.find(
  //       // (session:t_session) => {
  //       //   console.log("sssion",session.scheduledDate)
  //       //   formatDate(session.scheduledDate) === formatDate(currentDate) }
  //       // )
  //       console.log(response,"response",currentDate,"responseeee")

  //       if(response)
  //       {
  //         console.log("temp_seession",temp_session)
  //         temp_session.push(response)
  //       }

  //     }

  //   })
  //   setnewsessionForCurrentDate(temp_session)

  // },[newWeekPlan,currentDate])

  useEffect(() => {
    if (!newWeekPlan) return;

    const temp_session: t_session[] = [];
    // console.log("newWeekPlan", newWeekPlan);

    newWeekPlan.forEach((data: t_plan) => {
      for (const [key, value] of Object.entries(data)) {
        const matchingSessions = value?.sessionInstances?.filter(
          (session: t_session) =>
            formatDate(session.scheduledDate) === formatDate(currentDate) &&
            session.status !== "REMOVED"
        );

        if (matchingSessions?.length) {
          temp_session.push(...matchingSessions); // push all
        }
      }
    });

    setnewsessionForCurrentDate(temp_session);
  }, [newWeekPlan, currentDate]);

  useEffect(() => {
    if (newsessionForCurrentDate) {
      console.log("session found", newsessionForCurrentDate, currentDate);
    } else {
      console.log("no session", currentDate, newsessionForCurrentDate);
    }
    // console.log(newsessionForCurrentDate,"lk[qpkdqow")
  }, [newsessionForCurrentDate]);

  useEffect(() => {
    loadEnhancedSessionData();
  }, [newsessionForCurrentDate]);

  // const sessionForCurrentDate = weekPlan?.sessionInstances.find(
  //   (session) => formatDate(session.scheduledDate) === formatDate(currentDate)
  // );

  const slotBookingHandler = (sessionCategory: string, data1: t_session) => {
    const selectedDateISO = new Date(
      weekStartToEndDates[activeIndex]
    ).toISOString();
    console.log(data1, "qkpwj;eoihg");

    // console.log(sessionCategory,sessionForCurrentDate,"sessionForCurrentDateddddddddddd",selectedDateISO);

    if (sessionCategory === "FITNESS") {
      if (data1?.status === "SCHEDULED") {
        if (type === "group") {
          // clickHandler("group", sessionCategory);
          if (data1?.status === "SCHEDULED") {
            navigate(E_Routes.viewCards, {
              state: {
                selectedDate: selectedDateISO,
                category: "FITNESS",
                session: data1,
              },
            });
          }
          return;
        } else if (type === "personal") {
          clickHandler("personal", sessionCategory, selectedDateISO, data1);
          return;
        } else window.location.href = "/bookFitness";
      } else {
        if (data1?.oneOnoneId == null) {
          navigate(E_Routes.gameDetails, {
            state: {
              gameId: data1?.gameId,
            },
          });
        } else {
          navigate(E_Routes.bookingDetails, {
            state: {
              bookingId: data1?.oneOnoneId,
            },
          });
        }
      }
    } else if (sessionCategory === "WELLNESS") {
      if (data1?.status === "SCHEDULED") {
        if (type === "group") {
          if (data1?.status === "SCHEDULED") {
            navigate(E_Routes.viewCards, {
              state: {
                selectedDate: selectedDateISO,
                category: "WELLNESS",
                session: data1,
              },
            });
          }
          return;
        } else if (type === "personal") {
          clickHandler("personal", sessionCategory, selectedDateISO, data1);
          return;
        } else window.location.href = "/bookWellness";
      } else {
        if (data1?.oneOnoneId == null) {
          navigate(E_Routes.gameDetails, {
            state: {
              gameId: data1?.gameId,
            },
          });
        } else {
          navigate(E_Routes.bookingDetails, {
            state: {
              bookingId: data1?.oneOnoneId,
            },
          });
        }
      }
    } else if (sessionCategory === "SPORTS") {
      if (data1?.status === "SCHEDULED") {
        navigate(E_Routes.viewCards, {
          state: {
            selectedDate: selectedDateISO,
            category: "SPORTS",
            session: data1,
          },
        });
      } else {
        navigate(E_Routes.gameDetails, {
          state: {
            gameId: data1?.gameId,
          },
        });
      }
    }
    // else{
    //   if (data1?.status === "SCHEDULED") {
    //     navigate(E_Routes.viewCards, {
    //       state: {
    //         selectedDate: selectedDateISO,
    //         category: "SPORTS",
    //         session: data1,
    //       },
    //     });
    //   } else {
    //     navigate(E_Routes.gameDetails, {
    //       state: {
    //         gameId: data1?.gameId,
    //       },
    //     });
    //   }
    // }
  };
  const handleCheckboxChange = async (
    activityInstanceId: string,
    sessionInstanceId: string
  ) => {
    let matchingPlan = null;

    newWeekPlan?.forEach((planGroup, index) => {
      planGroup?.forEach(
        (
          plan: { sessionInstances: any[]; planInstanceId: any },
          planIndex: any
        ) => {
          const match = plan.sessionInstances?.some(
            (s: { sessionInstanceId: string }) =>
              s.sessionInstanceId === sessionInstanceId
          );

          if (match) {
            matchingPlan = plan;
            console.log(
              ` Match found at newWeekPlan[${index}].plans[${planIndex}] → planInstanceId:`,
              plan.planInstanceId
            );
          }
        }
      );
    });

    console.log("Final matching plan:", matchingPlan.planInstanceId);
    // newWeekPlan?.forEach((plan, index) => {

    try {
      const onAccept = (response: AxiosResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          getUserPlan();
          enqueueSnackbar({
            message: "Meal marked complete",
            autoHideDuration: SNACK_AUTO_HIDE,
            variant: "success",
          });
        } else {
          enqueueSnackbar({
            message: "Failed to fetch the user data!",
            autoHideDuration: SNACK_AUTO_HIDE,
            variant: "error",
          });
        }
      };
      const onReject = (e: unknown) => {
        console.log(e);
        enqueueSnackbar({
          message: "Failed to fetch the user data!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      };

      const res = await markActivityComplete(
        onAccept,
        onReject,
        activityInstanceId,
        sessionInstanceId,
        matchingPlan.planInstanceId
      );
    } catch (err) {
      console.error("Failed to update");
    }
  };

  const fetchAvailableGroups = async (category: string, dateISO: string) => {
    setIsLoadingGroupCount(true);
    setAvailableGroupCount(0);
    try {
      const categoryUrl = `https://play-os-backend.forgehub.in/sports/category/${category}`;
      const categoryRes = await axios.get(categoryUrl);
      const sports = categoryRes.data;

      let totalValidGames = 0;
      for (const sport of sports) {
        const sportId = sport.sportId;
        // Ensure date is start of day and add +1 to correct off-by-one
        let date = new Date(dateISO);
        date.setDate(date.getDate());
        date.setHours(0, 0, 0, 0);
        const gamesUrl = `https://play-os-backend.forgehub.in/game/games/by-sport?sportId=${sportId}&date=${date.toISOString()}&courtId=ALL`;
        const gamesRes = await axios.get(gamesUrl);
        const games = gamesRes.data;

        const validGames = games.filter((game: any) => game.type === "game");
        totalValidGames += validGames.length;
      }
      setAvailableGroupCount(totalValidGames);
    } catch (error) {
      console.error("Error fetching available groups:", error);
      setAvailableGroupCount(0);
    } finally {
      setIsLoadingGroupCount(false);
    }
  };

  const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    onClose,
    roomName,
    sessionData,
    roomDetails,
  }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Add useMessages hook
    const { sendMessage } = useMessages({
      listener: (event) => {
        if (event.type === ChatMessageEventType.Created) {
          console.log("Message received:", event.message);
        }
      },
      onDiscontinuity: (error) => {
        console.warn("Discontinuity detected:", error);
      },
    });

    const handleSend = async () => {
      if (!message.trim() || isSending) return;

      setIsSending(true);
      try {
        const currentUserId =
          localStorage.getItem("userId")?.slice(1, -1) || "";

        // Build context object directly (no stringify)
        const context = {
          sessionTemplateTitle: sessionData?.sessionTemplateTitle || "",
          openDate: currentDate || "",
        };

        // Create message payload with context as an object
        const messagePayload: any = {
          text: message.trim(),
          metadata: {
            context: context,
          },
        };

        console.log("Sending payload", messagePayload);

        await sendMessage(messagePayload);

        console.log("✅ Message sent successfully");

        // Close modal and navigate to chat
        onClose();

        // Create context for URL only
        const contextEncoded = encodeURIComponent(
          JSON.stringify({
            sessionTemplateTitle: sessionData?.sessionTemplateTitle || "",
            openDate: currentDate || "",
          })
        );

        const seenByUser = await axios.patch(
          `https://play-os-backend.forgehub.in/human/human/mark-seen`,
          {
            userId: clientId,
            roomType: roomDetails.roomType,
            userType: "user",
            handled: `${message.trim()}`,
          }
        );

        console.log("seen by user at", seenByUser.data);

        const url = `https://chatapp.forgehub.in/?clientId=${currentUserId}&roomChatId=${
          roomDetails.chatId
        }&roomnames=${encodeURIComponent(roomDetails.roomName)}&roomType=${
          roomDetails.roomType
        }`;
        //&context=${contextEncoded}
        window.location.href = url;
      } catch (error) {
        console.error("Error sending message:", error);
        enqueueSnackbar({
          message: "Failed to send message",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      } finally {
        setIsSending(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="chat-modal-overlay" onClick={onClose}>
        <div
          className="chat-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="chat-modal-header">
            <div className="chat-modal-header-flex">
              <div className="chat-modal-header-left">
                <div className="chat-modal-pulse-dot"></div>
                <div>
                  <h3 className="chat-modal-title">Quick Message</h3>
                  <p className="chat-modal-subtitle">{roomName}</p>
                </div>
              </div>
              <button onClick={onClose} className="chat-modal-close-btn">
                <svg
                  className="chat-modal-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="chat-modal-session-info">
            <div className="chat-modal-session-flex">
              <div className="chat-modal-status-dot"></div>
              <div>
                <p className="chat-modal-session-title">
                  {sessionData?.sessionTemplateTitle || "Session"}
                </p>
                <p className="chat-modal-session-date">
                  {formatDate(currentDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="chat-modal-content">
            <div className="chat-modal-input-wrapper">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="chat-modal-textarea"
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isSending}
                autoFocus
              />
              <div className="chat-modal-char-count">{message.length}/500</div>
            </div>

            <div className="chat-modal-buttons">
              <button
                onClick={onClose}
                className="chat-modal-btn chat-modal-btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                className="chat-modal-btn chat-modal-btn-send"
              >
                {isSending ? (
                  <>
                    <div className="chat-modal-spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg
                      className="chat-modal-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="chat-modal-footer">
            {/* <p className="chat-modal-hint">
              Press Enter to send • Shift+Enter for new line
            </p> */}
          </div>
        </div>
      </div>
    );
  };

  const handleChatModalOpen = async (
    userId: string,
    sessionCategory: string,
    sessionData: t_session
  ) => {
    console.log("💬 TB Message icon clicked for category:", sessionCategory);

    setShowChatModal(true);
    setChatModalData({
      roomName: "Loading...",
      isLoading: true,
      sessionData,
      roomDetails: null,
    });

    try {
      const response = await axios.get(
        `https://play-os-backend.forgehub.in/human/human/${userId}`
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const roomData = response.data.find(
        (room: { roomType: string }) => room.roomType === sessionCategory
      );

      if (roomData) {
        const ablyRoomName = `${roomData.chatId}`;
        console.log("🏠 Room found for Ably:", ablyRoomName);

        setChatModalData({
          roomName: roomData.roomName || `${sessionCategory} Room`,
          isLoading: false,
          sessionData,
          roomDetails: roomData,
        });
      } else {
        setChatModalData({
          roomName: "Room not found",
          isLoading: false,
          sessionData,
          roomDetails: null,
        });

        enqueueSnackbar({
          message: `No ${sessionCategory} room found for this user`,
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      setChatModalData({
        roomName: "Error loading room",
        isLoading: false,
        sessionData,
        roomDetails: null,
      });

      enqueueSnackbar({
        message: "Failed to load chat room",
        autoHideDuration: SNACK_AUTO_HIDE,
        variant: "error",
      });
    }
  };

  // console.log("sessionForCurrentDate kkkk", sessionForCurrentDate);
  if (pageState === E_PageState.Loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="view-plan-container">
      <div className="view-plan-top-container">
        {categories.map((category, i) => {
          const isActive = filterSession === category.name.toUpperCase();
          return (
            <div
              key={i}
              className={`view-plan-category-container ${
                isActive ? "--active" : ""
              }`}
              onClick={() => {
                setFilterSession(category.name.toUpperCase());
              }}
            >
              <div className="--icon"> {category.icon()}</div>
              <div className="--name"> {category.name}</div>
            </div>
          );
        })}
      </div>
      {/* {weekPlan && ( */}
      <div className="view-plan-today-information-container">
        <div className="view-plan-top-information-top-container">
          <div className="--arrows">
            <div className="--arrow-left">
              <FaChevronLeft
                onClick={arrowLeftHandler}
                size={DEFAULT_ICON_SIZE - 10}
              />
            </div>
          </div>
          <div className="--date">
            {weekStartToEndDates[activeIndex]
              ? formatDate(weekStartToEndDates[activeIndex])
              : ""}
          </div>
          <div className="--arrows">
            <div className="--arrow-right">
              <FaChevronRight
                onClick={arrowRightHandler}
                size={DEFAULT_ICON_SIZE - 10}
              />
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
      {/* {weekPlan && ( */}
      <div className="view-plan-sessions-view-container">
        <WeekPlanView
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          // sessions={weekPlan.sessionInstances}
          weekStartToEndDates={weekStartToEndDates}
        />
      </div>
      {/* )} */}
      <div className="view-plan-schedule-container">
        <div className="--top">
          <div className="--your-schedule">
            <span>Your Schedule</span>
          </div>
        </div>
        <div className="schedule-scrollable-content">
          {newsessionForCurrentDate.length > 0 ? (
            <div>
              {newsessionForCurrentDate
                ?.filter(
                  (data1) =>
                    filterSession === "ALL" || data1.category === filterSession
                )
                ?.map((data1: t_session, index: number) => {
                  // for (const [key,value] of Object.entries(data1) as [string,any]){
                  //   if(key==='category')
                  //     console.log(key,value,"value")

                  // }
                  console.log(data1.category, data1.name, "cjbqkhvc");
                  const validActivities = data1.activities.filter(
                    (activity) => activity.status !== "REMOVED"
                  );

                  return (
                    <>
                      <div className="--schedule-container">
                        <div className="--schedule-templat-container">
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center", // Keep center alignment here
                                gap: "0",
                                flexWrap: "nowrap",
                              }}
                            >
                              <span className="--schedule-template-title">
                                {data1?.sessionTemplateTitle === "DUMMY"
                                  ? "ACTIVITIES"
                                  : data1?.sessionTemplateTitle}

                                {data1.category === "NUTRITION" &&
                                  enhancedSessionData[data1.sessionInstanceId]
                                    ?.vegNonVeg && (
                                    <VegNonVegDot
                                      vegNonVeg={
                                        enhancedSessionData[
                                          data1.sessionInstanceId
                                        ].vegNonVeg
                                      }
                                    />
                                  )}
                              </span>
                            </div>
                          </div>
                          <TbMessage
                            size={30}
                            style={{
                              color: "var(--grey-900)",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChatModalOpen(
                                data1.userId,
                                data1.category,
                                data1
                              )
                            }
                          />
                          {data1?.category !== "NUTRITION" &&
                            data1?.sessionTemplateId !== "SEST_YFVI33" && (
                              <div
                                className={`--book-slot ${
                                  data1 ? "" : "--inActive"
                                }`}
                                onClick={() => {
                                  if (!data1) return;

                                  let selectedDate = new Date(
                                    data1.scheduledDate
                                  );
                                  selectedDate.setDate(
                                    selectedDate.getDate() + 1
                                  );
                                  const selectedDateISO =
                                    selectedDate.toISOString();

                                  if (
                                    data1?.category === "FITNESS" ||
                                    data1?.category === "WELLNESS"
                                  ) {
                                    if (data1?.status == "SCHEDULED") {
                                      fetchAvailableGroups(
                                        data1.category,
                                        selectedDateISO
                                      );
                                      setModalMap((prev) => ({
                                        ...prev,
                                        [data1.sessionInstanceId]: true,
                                      }));
                                      return;
                                    }
                                  }
                                  if (data1?.category === "NUTRITION") {
                                    return;
                                  }

                                  slotBookingHandler(data1?.category, data1);
                                }}
                              >
                                <span>
                                  {data1?.status === "BOOKED"
                                    ? "View Booking"
                                    : "Book Slot"}
                                </span>
                              </div>
                            )}
                        </div>
                        {data1 ? (
                          <>
                            {data1.category != "NUTRITION" && (
                              <div className="--bottom">
                                <div
                                  style={{
                                    color: "var(--rust-700)",
                                    marginLeft: "40px",
                                    marginBottom: "-20px",
                                    display: "flex",
                                    gap: "2px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <span style={{ width: "140px" }}>TASK</span>
                                  <span
                                    style={{
                                      width: "80px",
                                      textAlign: "center",
                                    }}
                                  >
                                    TARGET 1
                                  </span>
                                  <span
                                    style={{
                                      width: "80px",
                                      textAlign: "center",
                                    }}
                                  >
                                    TARGET 2
                                  </span>
                                </div>
                                {data1.activities
                                  .filter(
                                    (activity) => activity.status !== "REMOVED"
                                  )
                                  .map((activity, i) => (
                                    <div
                                      key={i}
                                      className="session-information-container"
                                    >
                                      <div className="--session-info">
                                        <div className="--start">
                                          {activity.videoLink ? (
                                            <IoPlayCircle
                                              size={22}
                                              style={{
                                                zIndex: 2,
                                                position: "relative",
                                                verticalAlign: "middle",
                                                cursor: "pointer",
                                                color: "var(--rust-500)",
                                                ...(i === 0
                                                  ? {
                                                      outline:
                                                        "1px solid black",
                                                      outlineOffset: "8px",
                                                      borderRadius: "50%",
                                                      background: "white",
                                                    }
                                                  : {}),
                                              }}
                                              onClick={() => {
                                                setCurrentVideoUrl(
                                                  activity.videoLink
                                                );
                                                setShowVideoModal(true);
                                              }}
                                            />
                                          ) : (
                                            <IoPlayCircle
                                              size={22}
                                              style={{
                                                zIndex: 2,
                                                position: "relative",
                                                verticalAlign: "middle",
                                                color: "var(--grey-400)",
                                                ...(i === 0
                                                  ? {
                                                      outline:
                                                        "1px solid black",
                                                      outlineOffset: "8px",
                                                      borderRadius: "50%",
                                                      background: "white",
                                                    }
                                                  : {}),
                                              }}
                                            />
                                          )}

                                          <div className="--session">
                                            <div>
                                              <div
                                                className="--name"
                                                style={{
                                                  wordWrap: "break-word",
                                                  wordBreak: "break-word",
                                                  whiteSpace: "normal",
                                                  lineHeight: "1.4",
                                                }}
                                              >
                                                {activity.name || "No name"}
                                              </div>
                                              <div
                                                style={{
                                                  wordWrap: "break-word",
                                                  wordBreak: "break-word",
                                                  whiteSpace: "normal",
                                                  lineHeight: "1.4",
                                                  marginTop: "4px",
                                                  fontSize: "12px",
                                                  color: "var(--grey-400)",
                                                }}
                                              >
                                                {activity.description ||
                                                  "No description"}
                                              </div>
                                            </div>
                                            <div
                                              style={{
                                                flex: "0 0 80px",
                                                minWidth: "82px",
                                              }}
                                            >
                                              <div className="--desc">
                                                {activity.target || "-"}
                                                {activity.target
                                                  ? activity?.unit == "weight"
                                                    ? "Kg"
                                                    : activity?.unit ==
                                                      "distance"
                                                    ? "Km"
                                                    : activity?.unit == "time"
                                                    ? "Min"
                                                    : activity?.unit ==
                                                      "repetitions"
                                                    ? "Reps"
                                                    : activity?.unit == "grams"
                                                    ? "g"
                                                    : activity?.unit == "meter"
                                                    ? "m"
                                                    : activity?.unit == "litre"
                                                    ? "L"
                                                    : activity?.unit ==
                                                      "millilitre"
                                                    ? "ml"
                                                    : ""
                                                  : ""}
                                              </div>
                                            </div>
                                            <div
                                              style={{
                                                flex: "0 0 80px",
                                                minWidth: "80px",
                                                textAlign: "center",
                                              }}
                                            >
                                              <span className="--desc">
                                                {activity.customReps || "-"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* {i < validActivities.length - 1 && (
                                        <div className="--line"></div>
                                      )} */}
                                      {modalMap[data1.sessionInstanceId] && (
                                        <div className="modal-overlay">
                                          <div className="modal-box">
                                            <button
                                              className="modal-close"
                                              onClick={() =>
                                                setModalMap((prev) => ({
                                                  ...prev,
                                                  [data1.sessionInstanceId]:
                                                    false,
                                                }))
                                              }
                                            >
                                              &times;
                                            </button>

                                            <div className="modal-title">
                                              Choose Type
                                            </div>
                                            <button
                                              className={`modal-button group ${
                                                type === "group" ? "active" : ""
                                              }`}
                                              onClick={() => setType("group")}
                                              disabled={
                                                isLoadingGroupCount ||
                                                availableGroupCount === 0
                                              }
                                            >
                                              {isLoadingGroupCount
                                                ? "Group Sessions"
                                                : availableGroupCount > 0
                                                ? `${availableGroupCount} Group Sessions available`
                                                : "No Group Sessions available"}
                                            </button>
                                            <button
                                              className={`modal-button group ${
                                                type === "personal"
                                                  ? "active"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                setType("personal")
                                              }
                                            >
                                              1-on-1 Session
                                            </button>

                                            <button
                                              className="modal-confirm"
                                              disabled={type === ""}
                                              onClick={() =>
                                                slotBookingHandler(
                                                  data1.category,
                                                  data1
                                                )
                                              }
                                            >
                                              Confirm
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                            {data1.category == "NUTRITION" && (
                              <div className="--bottom">
                                <div
                                  style={{
                                    color: "var(--rust-700)",
                                    marginLeft: "40px",
                                    marginBottom: "-20px",
                                    display: "flex",
                                    gap: "2px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <span style={{ width: "140px" }}>TASK</span>
                                  <span
                                    style={{
                                      width: "80px",
                                      textAlign: "center",
                                    }}
                                  >
                                    TARGET 1
                                  </span>
                                  <span
                                    style={{
                                      width: "80px",
                                      textAlign: "center",
                                    }}
                                  >
                                    TARGET 2
                                  </span>
                                </div>
                                {data1.activities
                                  .filter(
                                    (activity) => activity.status !== "REMOVED"
                                  )
                                  .map((activity, i) => (
                                    <EnhancedActivityItem
                                      key={i}
                                      activity={activity}
                                      sessionInstanceId={
                                        data1.sessionInstanceId
                                      }
                                      index={i}
                                      showCheckbox={true}
                                      onCheckboxChange={handleCheckboxChange}
                                      showVideoIcon={false}
                                      onVideoClick={() => {}}
                                    />
                                  ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="--noSession">
                            <span>No session for this date.</span>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
            </div>
          ) : (
            <div className="--noSession">
              <span>No session for this date.</span>
            </div>
          )}
        </div>
      </div>
      {
        // sessionForCurrentDate ? (
        // <div className="--bottom">
        //   {sessionForCurrentDate.activities.map((activity, i) => (
        //     <div key={i} className="session-information-container">
        //       <div className="--session-info">
        //         <div className="--start">
        //           <div
        //             className="dot"
        //             style={
        //               i === 0
        //                 ? {
        //                     outline: "1px solid black",
        //                     outlineOffset: "10px",
        //                   }
        //                 : {}
        //             }
        //           />
        //           <div className="--session">
        //             <span className="--name">
        //               {activity.name || "No name"}
        //             </span>
        //             <span className="--desc">{activity.customReps}</span>
        //           </div>
        //         </div>
        //         {/* {i === 0 && (
        //           <div className="--end">
        //             <span>Start</span>
        //             <FaPlay />
        //           </div>
        //         )} */}
        //       </div>
        //       {i < sessionForCurrentDate.activities.length - 1 && (
        //         <div className="--line" />
        //       )}
        //     </div>
        //   ))}
        // </div>
        // ) : (
        //   <div className="--noSession">
        //     <span>No session for this date.</span>
        //   </div>
        // )
      }
      {/* </div> */}
      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="modal-close"
              aria-label="Close modal"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="modal-title">Choose Type</div>
            <button
              className={`modal-button group ${
                type === "group" ? "active" : ""
              }`}
              onClick={() => setType("group")}
            >
              Group Session
            </button>
            <button
              className={`modal-button group ${
                type === "personal" ? "active" : ""
              }`}
              onClick={() => setType("personal")}
            >
              1-on-1 Session
            </button>
            <button
              className="modal-confirm"
              disabled={type === ""}
              onClick={() =>
                slotBookingHandler(sessionForCurrentDate?.category)
              }
            >
              Confirm
            </button>
          </div>
        </div>
      )} */}
      {createGame && (
        <div className="buttonContainer">
          <Button
            onClick={() => {
              navigate(E_Routes.bookFitness);
            }}
            text="➕Create Game"
          ></Button>
        </div>
      )}
      {showVideoModal && currentVideoUrl && (
        <div
          className="video-modal-overlay"
          onClick={() => {
            setShowVideoModal(false);
            setCurrentVideoUrl("");
          }}
        >
          <div
            className="video-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => {
                setShowVideoModal(false);
                setCurrentVideoUrl("");
              }}
            >
              &times;
            </button>
            <div className="video-player">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractVideoId(
                  currentVideoUrl
                )}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {showChatModal && (
        <>
          {chatModalData.isLoading ? (
            <div className="chat-modal-overlay">
              <div className="chat-modal-container">
                <div className="chat-modal-loading">
                  <div className="chat-modal-loading-spinner"></div>
                  <h3 className="chat-modal-loading-title">
                    Loading Chat Room
                  </h3>
                  <p className="chat-modal-loading-text">
                    Please wait while we connect you...
                  </p>
                </div>
              </div>
            </div>
          ) : chatModalData.roomDetails ? (
            <ChatClientProvider client={chatClient}>
              <ChatRoomProvider name={`${chatModalData.roomDetails.chatId}`}>
                <ChatModal
                  isOpen={showChatModal}
                  onClose={() => setShowChatModal(false)}
                  roomName={chatModalData.roomName}
                  sessionData={chatModalData.sessionData}
                  roomDetails={chatModalData.roomDetails}
                />
              </ChatRoomProvider>
            </ChatClientProvider>
          ) : (
            <div className="chat-modal-overlay">
              <div className="chat-modal-container">
                <div className="chat-modal-error">
                  <div className="chat-modal-error-icon-wrapper">
                    <svg
                      className="chat-modal-error-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="chat-modal-error-title">Room Not Found</h3>
                  <p className="chat-modal-error-text">
                    {chatModalData.roomName}
                  </p>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="chat-modal-error-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewPlan;

// git stash

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
import { HttpStatusCode, type AxiosResponse } from "axios";
import { E_PageState } from "../../types/state";
import { FullScreenLoader } from "../../components/Loader/CustomLoader";
import { enqueueSnackbar } from "notistack";
import { data, useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";
import Button from "../../components/Button/Button.tsx";
import { getUserById, updateNutritionStatus } from "../../api/user";
import type { t_session } from "../../types/session.ts";
import { markActivityComplete } from "../../api/activity.ts";
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
      planGroup?.forEach((plan, planIndex) => {
        const match = plan.sessionInstances?.some(
          (s) => s.sessionInstanceId === sessionInstanceId
        );

        if (match) {
          matchingPlan = plan;
          console.log(
            `✅ Match found at newWeekPlan[${index}].plans[${planIndex}] → planInstanceId:`,
            plan.planInstanceId
          );
        }
      });
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
            {formatDate(weekStartToEndDates[activeIndex])}
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
        <div>
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
                            <span className="--schedule-template-title">
                              {" "}
                              {data1?.sessionTemplateTitle === "DUMMY"
                                ? "ACTIVITIES"
                                : data1?.sessionTemplateTitle}
                            </span>
                          </div>
                          {data1?.category !== "NUTRITION" &&
                            data1?.sessionTemplateId !== "SEST_YFVI33" && (
                              <div
                                className={`--book-slot ${
                                  data1 ? "" : "--inActive"
                                }`}
                                onClick={() => {
                                  if (!data1) return;

                                  if (
                                    data1?.category === "FITNESS" ||
                                    data1?.category === "WELLNESS"
                                  ) {
                                    if (data1?.status == "SCHEDULED") {
                                      // setShowModal(true);
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
                                    color: "red",
                                    marginLeft: "28px",
                                    marginBottom: "-20px",
                                    display: "flex",
                                    gap: "2px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <span style={{ width: "140px" }}>TASK</span>
                                  <span style={{ width: "80px", textAlign: "center" }}>TARGET 1</span>
                                  <span style={{ width: "80px", textAlign: "center" }}>TARGET 2</span>
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
                                          <div
                                            className="dot"
                                            style={
                                              i === 0
                                                ? {
                                                    outline: "1px solid black",
                                                    outlineOffset: "10px",
                                                  }
                                                : {}
                                            }
                                          />
                                          <div className="--session">
                                            <div>
                                              <div className="--name" style={{ 
                                                wordWrap: "break-word", 
                                                wordBreak: "break-word",
                                                whiteSpace: "normal",
                                                lineHeight: "1.4"
                                              }}>
                                                {activity.name || "No name"}
                                              </div>
                                              <div style={{ 
                                                wordWrap: "break-word", 
                                                wordBreak: "break-word",
                                                whiteSpace: "normal",
                                                lineHeight: "1.4",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: '#0a0a0a78'
                                              }}>
                                                {activity.description || "No description"}
                                              </div>
                                            </div>
                                            <div style={{ flex: "0 0 80px", minWidth: "82px"}}>
                                              <div className="--desc">
                                                {activity.target || "-"}
                                                {activity.target ? (activity?.unit == "weight"
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
                                                  : "") : ""}
                                              </div>
                                            </div>
                                            <div style={{ flex: "0 0 80px", minWidth: "80px", textAlign: "center" }}>
                                              <span className="--desc">
                                                {activity.customReps || "-"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {i < validActivities.length - 1 && (
                                        <div className="--line"></div>
                                      )}
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
                                            >
                                              Group Session
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
                                   color: "red",
                                    marginLeft: "28px",
                                    marginBottom: "-20px",
                                    display: "flex",
                                    gap: "2px",
                                    fontSize: "12px",
                                  }}
                                >
                                   <span style={{ width: "140px" }}>TASK</span>
                                  <span style={{ width: "80px", textAlign: "center" }}>TARGET 1</span>
                                  <span style={{ width: "80px", textAlign: "center" }}>TARGET 2</span>
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
                                          <div
                                            className="dot"
                                            style={
                                              i === 0
                                                ? {
                                                    outline: "1px solid black",
                                                    outlineOffset: "10px",
                                                  }
                                                : {}
                                            }
                                          />
                                          <div className="--session" >
                                            <div>
                                              <div className="--name" style={{ 
                                                wordWrap: "break-word", 
                                                wordBreak: "break-word",
                                                whiteSpace: "normal",
                                                lineHeight: "1.4"
                                              }}>
                                                {activity.name || "No name"}
                                              </div>
                                              <div style={{ 
                                                wordWrap: "break-word", 
                                                wordBreak: "break-word",
                                                whiteSpace: "normal",
                                                lineHeight: "1.4",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: '#0a0a0a78'
                                              }}>
                                                {activity.description || "No description"}
                                              </div>
                                            </div>
                                            <div style={{ flex: "0 0 80px", minWidth: "80px", textAlign: "center" }}>
                                              <div className="--desc">
                                                {activity.target || "-"}
                                                {activity.target ? (activity?.unit == "weight"
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
                                                  : "") : ""}
                                              </div>
                                            </div>
                                            <div style={{ flex: "0 0 80px", minWidth: "80px", textAlign: "center" }}>
                                              <span className="--desc">
                                                {activity.customReps || "-"}
                                              </span>
                                            </div>
                                            <div>
                                              <Checkbox
                                                checked={
                                                  activity.status === "COMPLETE"
                                                }
                                                disabled={
                                                  activity.status == "COMPLETE"
                                                }
                                                onChange={() =>
                                                  handleCheckboxChange(
                                                    activity.activityInstanceId,
                                                    data1.sessionInstanceId
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {i < validActivities.length - 1 && (
                                        <div id="line-nutrition"></div>
                                      )}
                                    </div>
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
    </div>
  );
};

export default ViewPlan;

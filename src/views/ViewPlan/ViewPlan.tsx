/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { categories, DEFAULT_ICON_SIZE, SNACK_AUTO_HIDE } from "../../default";
import "./styles.css";
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
import { useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";
import Button from "../../components/Button/Button.tsx";
import { getUserById } from "../../api/user";
const ViewPlan = () => {
  //current week plan
  const [showModal, setShowModal] = useState(false);
  const [weekPlan, setWeekPlan] = useState<t_plan | null>(null);
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
    selectedDateISO: string
  ) => {
    if (category === "FITNESS") {
      if (value === "personal")
        navigate(E_Routes.bookWellness, {
          state: {
            descriptor: value,
            category: "FITNESS",
            selectedDate: selectedDateISO,
            sessionForCurrentDate: sessionForCurrentDate,
          },
        });
      else navigate(E_Routes.viewCards, { state: { descriptor: value } });
    } else
      navigate(E_Routes.bookWellness, {
        state: {
          descriptor: value,
          category: "WELLNESS",
          selectedDate: selectedDateISO,
          sessionForCurrentDate: sessionForCurrentDate,
        },
      });
  };

  const getUser = (id: string) => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data);
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
        console.log(response.data);
        setWeekPlan(response.data[0]);
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
    if (activeIndex >= 6) {
      setActiveIndex(0);
      setWeekNumber(weekNumber + 1);
      setgetDate(new Date(getDate.setDate(getDate.getDate() + 7)));
      return;
    }
    setActiveIndex(activeIndex + 1);
  };
  const arrowLeftHandler = () => {
    if (activeIndex <= 0) {
      if (weekNumber > 0) {
        setActiveIndex(6);
        setWeekNumber(weekNumber - 1);
        setgetDate(new Date(getDate.setDate(getDate.getDate() - 7)));
      } else {
        return;
      }
      return;
    }
    setActiveIndex(activeIndex - 1);
  };

  console.log(new Date(getDate.setDate(getDate.getDate())));
  useEffect(() => {
    const weekDates = getArrayOfDatesFromSundayToSaturday(
      new Date(getDate.setDate(getDate.getDate()))
    );
    setWeekStartToEndDates(weekDates);
  }, [weekNumber]);

  const currentDate = weekStartToEndDates[activeIndex];
  const sessionForCurrentDate = weekPlan?.sessionInstances.find(
    (session) => formatDate(session.scheduledDate) === formatDate(currentDate)
  );

  const slotBookingHandler = (sessionCategory: string) => {
    const selectedDateISO = new Date(
      weekStartToEndDates[activeIndex]
    ).toISOString();

    console.log(sessionCategory);

    if (sessionCategory === "FITNESS") {
      if (sessionForCurrentDate?.status === "SCHEDULED") {
        if (type === "group") {
          // clickHandler("group", sessionCategory);
          if (sessionForCurrentDate?.status === "SCHEDULED") {
            navigate(E_Routes.viewCards, {
              state: {
                selectedDate: selectedDateISO,
                category: "FITNESS",
                session: sessionForCurrentDate,
              },
            });
          }
          return;
        } else if (type === "personal") {
          clickHandler("personal", sessionCategory, selectedDateISO);
          return;
        } else window.location.href = "/bookFitness";
      } else {
        if (sessionForCurrentDate?.oneOnoneId == null) {
          navigate(E_Routes.gameDetails, {
            state: {
              gameId: sessionForCurrentDate?.gameId,
            },
          });
        } else {
          navigate(E_Routes.bookingDetails, {
            state: {
              bookingId: sessionForCurrentDate?.oneOnoneId,
            },
          });
        }
      }
    } else if (sessionCategory === "WELLNESS") {
      if (sessionForCurrentDate?.status === "SCHEDULED") {
        if (type === "group") {
          if (sessionForCurrentDate?.status === "SCHEDULED") {
            navigate(E_Routes.viewCards, {
              state: {
                selectedDate: selectedDateISO,
                category: "WELLNESS",
                session: sessionForCurrentDate,
              },
            });
          }
          return;
        } else if (type === "personal") {
          clickHandler("personal", sessionCategory, selectedDateISO);
          return;
        } else window.location.href = "/bookWellness";
      } else {
        if (sessionForCurrentDate?.oneOnoneId == null) {
          navigate(E_Routes.gameDetails, {
            state: {
              gameId: sessionForCurrentDate?.gameId,
            },
          });
        } else {
          navigate(E_Routes.bookingDetails, {
            state: {
              bookingId: sessionForCurrentDate?.oneOnoneId,
            },
          });
        }
      }
    } else if (sessionCategory === "SPORTS") {
      if (sessionForCurrentDate?.status === "SCHEDULED") {
        navigate(E_Routes.viewCards, {
          state: {
            selectedDate: selectedDateISO,
            category: "SPORTS",
            session: sessionForCurrentDate,
          },
        });
      } else {
        navigate(E_Routes.gameDetails, {
          state: {
            gameId: sessionForCurrentDate?.gameId,
          },
        });
      }
    }
  };

  console.log("sessionForCurrentDate", sessionForCurrentDate);
  if (pageState === E_PageState.Loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="view-plan-container">
      <div className="view-plan-top-container">
        {categories.map((category, i) => {
          return (
            <div key={i} className="view-plan-category-container">
              <div className="--icon"> {category.icon()}</div>
              <div className="--name"> {category.name}</div>
            </div>
          );
        })}
      </div>
      {/* {weekPlan && ( */}
      <div className="view-plan-today-information-container">
        <div className="view-plan-top-information-top-container">
          <div className="--date">
            {formatDate(weekStartToEndDates[activeIndex])}
          </div>
          <div className="--arrows">
            <div className="--arrow-left">
              <FaChevronLeft
                onClick={arrowLeftHandler}
                size={DEFAULT_ICON_SIZE - 10}
              />
            </div>
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
          <div
            className={`--book-slot ${
              sessionForCurrentDate ? "" : "--inActive"
            }`}
            onClick={() => {
              if (!sessionForCurrentDate) return;

              if (
                sessionForCurrentDate?.category === "FITNESS" ||
                sessionForCurrentDate?.category === "WELLNESS"
              ) {
                if (sessionForCurrentDate?.status == "SCHEDULED") {
                  setShowModal(true);
                  return;
                }
              }

              slotBookingHandler(sessionForCurrentDate?.category);
            }}
          >
            <span>
              {sessionForCurrentDate?.status === "SCHEDULED"
                ? "Book Slot"
                : "View Booking"}
            </span>
          </div>
        </div>
        {sessionForCurrentDate ? (
          <div className="--bottom">
            {sessionForCurrentDate.activities.map((activity, i) => (
              <div key={i} className="session-information-container">
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
                      <span className="--name">
                        {activity.name || "No name"}
                      </span>
                      <span className="--desc">{activity.customReps}</span>
                    </div>
                  </div>
                  {i === 0 && (
                    <div className="--end">
                      <span>Start</span>
                      <FaPlay />
                    </div>
                  )}
                </div>
                {i < sessionForCurrentDate.activities.length - 1 && (
                  <div className="--line" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="--noSession">
            <span>No session for this date.</span>
          </div>
        )}
      </div>
      {showModal && (
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
      )}{" "}
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

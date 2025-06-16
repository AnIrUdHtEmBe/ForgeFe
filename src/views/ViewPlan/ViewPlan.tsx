/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { categories, DEFAULT_ICON_SIZE, SNACK_AUTO_HIDE } from "../../default";
import "./styles.css";
import type { t_plan } from "../../types/plan";
import { formatDate, formatDateForB, getWeekRange } from "../../utils/date";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import WeekPlanView from "./components/WeekPlanView";
import { FaPlay } from "react-icons/fa";
import { getPlans } from "../../api/plan";
import { HttpStatusCode, type AxiosResponse } from "axios";
import { E_PageState } from "../../types/state";
import { FullScreenLoader } from "../../components/Loader/CustomLoader";
import { enqueueSnackbar } from "notistack";

const ViewPlan = () => {
  //current week plan
  const [weekPlan, setWeekPlan] = useState<t_plan | null>(null);
  const [pageState, setPageState] = useState(E_PageState.Unknown);
  const [activeIndex, setActiveIndex] = useState(-1);

  //fetch the plan for user with regard to current week and assign that plan with plan state
  const getUserPlan = () => {
    setPageState(E_PageState.Loading);
    const { startOfWeek, endOfWeek, dayOfWeek } = getWeekRange(new Date());

    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data);
        setWeekPlan(response.data[5]);
        setActiveIndex(dayOfWeek);
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

    const onReject = (e) => {
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
      "USER_CIZW87",
      formatDateForB(startOfWeek),
      formatDateForB(endOfWeek)
    );
  };

  useEffect(() => {
    getUserPlan();
  }, []);

  const arrowRightHandler = () => {
    if (!weekPlan || activeIndex >= weekPlan.sessionInstances.length - 1) return;
    setActiveIndex(activeIndex + 1);
  };
  const arrowLeftHandler = () => {
    if (activeIndex <= 0) return;
    setActiveIndex(activeIndex - 1);
  };

  // routing to the booking page based on the session category
  const slotBookingHandler = (sessionCategory: any) => {
    if (sessionCategory === "FITNESS") {
      window.location.href = "/bookFitness";
    } else if (sessionCategory === "SPORTS") {
      window.location.href = "/bookSport";
    } else {
      window.location.href = "/bookWellness";
    }
  };

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
      {weekPlan && (
        <div className="view-plan-today-information-container">
          <div className="view-plan-top-information-top-container">
            <div className="--date">
						{/* changes to be done */}
              {formatDate(
                weekPlan?.sessionInstances[activeIndex].scheduledDate
              )}
            </div>
            <div className="--arrows">
              <div className="--arrow-left">
                <FaChevronLeft
                  onClick={arrowLeftHandler}
                  style={
                    activeIndex <= 0
                      ? { color: "rgba(0, 0, 0, 0.4)" }
                      : { color: "black" }
                  }
                  size={DEFAULT_ICON_SIZE - 10}
                />
              </div>
              <div className="--arrow-right">
                <FaChevronRight
                  onClick={arrowRightHandler}
                  style={
                    activeIndex >= 6
                      ? { color: "rgba(0, 0, 0, 0.4)" }
                      : { color: "black" }
                  }
                  size={DEFAULT_ICON_SIZE - 10}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {weekPlan && (
        <div className="view-plan-sessions-view-container">
          <WeekPlanView
            activeIndex={activeIndex}
            sessions={weekPlan.sessionInstances}
          />
        </div>
      )}

      <div className="view-plan-schedule-container">
        <div className="--top">
          <div className="--your-schedule">
            <span>Your Schedule</span>
          </div>
          <div
            className="--book-slot"
            onClick={() =>
              slotBookingHandler(
                weekPlan!.sessionInstances[activeIndex]?.category
              )
            }
          >
            <span>Book Slot</span>
          </div>
        </div>
        {weekPlan && (
          <div className="--bottom">
            {weekPlan.sessionInstances[activeIndex].activities.map(
              (session, i) => {
                return (
                  <div className="session-information-container">
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
                            {(session as any).name || "No name"}
                          </span>
                          <span className="--desc">
                            {(session as any).customReps}
                          </span>
                        </div>
                      </div>
                      {i === 0 && (
                        <div className="--end">
                          <span>Start</span>
                          <FaPlay />
                        </div>
                      )}
                    </div>
                    {i <
                      weekPlan.sessionInstances[activeIndex].activities.length -
                        1 && <div className="--line" />}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlan;

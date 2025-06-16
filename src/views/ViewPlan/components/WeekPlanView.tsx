import type { t_session } from "../../../types/session";
import { getDate, TodaysDate } from "../../../utils/date";
import "./styles/week-plan-view.css";

interface WeekPlanViewProps {
  // sessions: t_session[];
  activeIndex: number;
  weekStartToEndDates: string[];
}

const WeekPlanView = (props: WeekPlanViewProps) => {
  return (
    <div className="week-plan-view-container">
      {/* {props.sessions.map((session, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: props.activeIndex === i ? "lightblue" : "white",
            }}
            className="--plan"
          >
            <span className="--date">{getDate(session.scheduledDate)}</span>
          </div>
        );
      })} */}

      {props.weekStartToEndDates.map((session, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: props.activeIndex === i ? "lightblue" : "white",
            }}
            className="--plan"
          >
            <span className="--date">{TodaysDate(session)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WeekPlanView;

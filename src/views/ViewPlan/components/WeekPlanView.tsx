import type { t_session } from "../../../types/session";
import { getDate } from "../../../utils/date";
import "./styles/week-plan-view.css";

interface WeekPlanViewProps {
  sessions: t_session[];
  activeIndex: number;
}

const WeekPlanView = (props: WeekPlanViewProps) => {
  return (
    <div className="week-plan-view-container">
      {props.sessions.map((session, i) => {
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
      })}

      {["sunday" , "monday"].map((session, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: props.activeIndex === i ? "lightblue" : "white",
            }}
            className="--plan"
          >
            <span className="--date">{}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WeekPlanView;

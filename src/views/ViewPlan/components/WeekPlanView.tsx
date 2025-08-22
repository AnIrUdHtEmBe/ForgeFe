import type { t_session } from "../../../types/session";
import { getDate, TodaysDate } from "../../../utils/date";
import "./styles/week-plan-view.css";

interface WeekPlanViewProps {
  // sessions: t_session[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  weekStartToEndDates: string[];
}

const WeekPlanView = (props: WeekPlanViewProps) => {
  return (
    <div className="week-plan-view-container">
      {props.weekStartToEndDates.map((session, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: props.activeIndex === i ? "var(--rust-300)" : "var(--primary-white)	",
            }}
            className="--plan"
            onClick={() => props.setActiveIndex(i)}
          >
            <span className="--date">{TodaysDate(session)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WeekPlanView;

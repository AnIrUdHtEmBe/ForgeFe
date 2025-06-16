import { useEffect, useState } from "react";
import type { t_court } from "../../types/court";
import { getCourts } from "../../api/courts";
import { HttpStatusCode, type AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import "./styles.css";
import type { t_sport } from "../../types/sports";

interface CourtStripProps {
  activeCourt: { name: string };
  changeActiveCourt: (newCourt: string) => void;
  selectedSport?: t_sport;
}

const CourtStrip = (props: CourtStripProps) => {
  const [courts, setCourts] = useState<t_court[]>([]);
  const [allCourts, setAllCourts] = useState<t_court[]>([])


  const getAllCourts = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data);
        setCourts(response.data);
        setAllCourts(response.data); // ✅ Save full unfiltered data
       
      } else {
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };

    const onReject = (e: unknown) => {
      console.log(e);
      enqueueSnackbar({
        message: "Failed to fetch the data!",
        autoHideDuration: 3000,
        variant: "error",
      });
    };

    getCourts(onAccept, onReject, "AREN_JZSW15");
  };

  useEffect(() => {
    getAllCourts();
  }, []);

  useEffect(() => {
    if (!props.selectedSport) {
      setCourts(allCourts); // 👈 Reset to full list when no sport selected
    } else {
      const filtered = allCourts.filter((court) =>
        court.allowedSports.includes(props.selectedSport!.sportId)
      );
      setCourts(filtered); // 👈 Filter based on original data
    }
  }, [props.selectedSport, allCourts]);

  
  return (
    <div className="court-strip-container">
      <div className="court-strip-current-filter">
        <span>{props.activeCourt.name}</span>
      </div>
      <div className="court-strip-courts-filter">
        {courts.map((court, i) => {
          return (
            <div
              className={`--court ${
                props.activeCourt.name === court.name ? "--bookSportActive" : ""
              }`}
              key={i}
              onClick={() => props.changeActiveCourt(court.name)}
            >
              {court.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourtStrip;

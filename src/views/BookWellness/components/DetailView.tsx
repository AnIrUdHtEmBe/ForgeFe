/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoIosArrowBack } from "react-icons/io";
import "./styles/detail-view.css";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_ICON_SIZE,
  detailsInfoWellness,
  SNACK_AUTO_HIDE,
} from "../../../default";
import Button from "../../../components/Button/Button";
import { useState, useEffect } from "react";
import { getAllUsers, getCoachDetails } from "../../../api/user";
import {
  bookCourt,
  getCourtById,
  getTimeSlotForCourt,
} from "../../../api/courts";
import type { t_court } from "../../../types/court";
import { getFormattedDateTime } from "../../../utils/date";
import { HttpStatusCode, type AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import Content from "./Content";
import {getGamesByDateAndSports , joinGame} from "../../../api/games";
import type { t_game } from "../../../types/games";

const DetailView = () => {
  const location = useLocation();
  const { descriptor } = location.state;

  const index = Object.keys(detailsInfoWellness).findIndex(
    (el) => el.toLowerCase() === descriptor.name.toLowerCase()
  );
  if (index < 0) {
    return <span>Invalid Page</span>;
  }
  const keys = Object.keys(detailsInfoWellness);
  const name = keys[index];
  const obj = detailsInfoWellness[name as keyof typeof detailsInfoWellness];

  const backBtnHandler = () => {
    window.history.back();
  };
  const [doctors, setDoctors] = useState<[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [courtId, setCourtId] = useState<string>("");
  const [court, setCourt] = useState<t_court>();
  const [operatingHours, setOperatingHours] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [slots, setSlots] = useState<t_slot[]>([]);
  const [games, setGames] = useState<t_game[]>([]);
  const [dateOfGame, setDateOfGame] = useState<Date | null>(null);
  const [ selectedGame , setSelectedGame] = useState<t_game>();
  useEffect(() => {
    if (courtId && date) {
      getTimeSlotForCourt(
        (res: AxiosResponse) => {
          if (res.status === HttpStatusCode.Ok) {
            const sorted = res.data
              .map(({ st_unix, et_unix, status, slotId }: t_slot) => ({
                startTime: st_unix,
                endTime: et_unix,
                status,
                slotId,
              }))
              .sort((a, b) => a.startTime - b.startTime);
            setSlots(sorted);
          }
        },
        () =>
          enqueueSnackbar({
            message: "Failed to fetch slots.",
            variant: "error",
            autoHideDuration: SNACK_AUTO_HIDE,
          }),
        courtId,
        date?.toISOString() || new Date().toISOString()
      );
      setSelectedSlotIds([]);
    }
  }, [courtId, date ]);

  const selectedSlots = slots
    .filter((slot) => selectedSlotIds.includes(slot.slotId))
    .sort((a, b) => (a.startTime as any) - (b.startTime as any));

  const finalStartTime = selectedSlots[0]?.startTime ?? 0;
  const finalEndTime = selectedSlots[selectedSlots.length - 1]?.endTime ?? 0;

  const combineDateWithUnixTime = (dateStr: string, timeUnix: number) => {
    const base = new Date(dateStr);
    const time = new Date(timeUnix * 1000);
    base.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return base;
  };

  const startDateTime = combineDateWithUnixTime(
    date?.toISOString(),
    finalStartTime
  );
  const endDateTime = combineDateWithUnixTime(
    date?.toISOString(),
    finalEndTime
  );

  useEffect(() => {
    getAllUsers(
      (res) => {
        if (res.status === 200) {
          console.log("Doctors fetched successfully", res.data);

          const doctorsList = res.data;
          setDoctors(doctorsList);
        }
      },
      (error) => {
        console.error("Failed to fetch doctors", error);
      },
      "coach_wellness"
    );
  }, []);

  useEffect(() => {
    getCoachDetails(
      (res) => {
        if (res.status === 200) {
          console.log("Get coach details", res.data);
          const court = res.data.courtId;
          setCourtId(court);
        }
      },
      (error) => {
        console.error("Failed to fetch doctors", error);
      },
      selectedDoctor.userId
    );
  }, [selectedDoctor]);

  useEffect(() => {
    if (courtId) {
      getCourtById(
        (res) => {
          if (res.status === 200) {
            console.log("Get court details", res.data);
            setCourt(res.data);
          }
        },
        (error) => {
          console.error("Failed to fetch court details", error);
        },
        courtId
      );
    }
  }, [courtId]);

  useEffect(() => {
    const { timeStr } = getFormattedDateTime(
      new Date(court?.openingTime),
      new Date(court?.closingTime)
    );
    console.log(timeStr);
    setOperatingHours(timeStr);
  }, [court]);

  const fetchGames = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log(response.data);
        setGames(response.data);
      } else {
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };
    const onReject = (error: unknown) => {
      console.error("Error fetching games:", error);
    };

    getGamesByDateAndSports(
      onAccept,
      onReject,
      dateOfGame?.toISOString(),
      descriptor.sportId,
    );
  };
  useEffect(() => {
    if(dateOfGame && descriptor.sportId) {
      fetchGames();
    }
  }, [dateOfGame ]
  )
  const handleBookingForYoga = async () => {
    if(!selectedGame ){
      console.error("Please select a game before booking.");
      return;
    }
    const bookingData = {
      gameId: selectedGame.gameId,
      playerIds: ["USER_JWXJ19"]
    }
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log("Booking successful:", response.data);
        enqueueSnackbar({
          message: "Booking successful!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "success",
        });
      } else {
        console.error("Booking failed:", response.data);
        enqueueSnackbar({
          message: "Booking failed!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      }
    };
    const onReject = (error: any) => {
      console.error("Error booking game:", error);
      enqueueSnackbar({
        message: "Error while booking game!",
        autoHideDuration: SNACK_AUTO_HIDE,
        variant: "error",
      });
    };
    await joinGame(
      onAccept,
      onReject,
      bookingData.gameId,
      bookingData.playerIds
    );
  }

  const handleBookingForPhysio = async () => {
    if (!startDateTime || !endDateTime || !courtId) {
      console.error("Missing required booking information");
      return;
    }

    const bookingData = {
      courtId: courtId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      sportId: descriptor.sportId, // Use sportId if available, otherwise an empty string
    };

    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log("Booking successful:", response.data);
        enqueueSnackbar({
          message: "Booking successful!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "success",
        });
      } else {
        console.error("Booking failed:", response.data);
        enqueueSnackbar({
          message: "Booking failed!",
          autoHideDuration: SNACK_AUTO_HIDE,
          variant: "error",
        });
      }
    };

    const onReject = (error: any) => {
      console.error("Error booking court:", error);
      enqueueSnackbar({
        message: "Error while booking court!",
        autoHideDuration: SNACK_AUTO_HIDE,
        variant: "error",
      });
    };
    await bookCourt(
      onAccept,
      onReject,
      bookingData.courtId,
      bookingData.sportId,
      bookingData.startTime,
      bookingData.endTime
    );

    setDate(new Date(date));
    
  };

  return (
    <div className="detail-view-container">
      <div className="image-container">
        <div className="--back" onClick={backBtnHandler}>
          <IoIosArrowBack size={DEFAULT_ICON_SIZE - 5} />
        </div>
        <img src={obj.path} />
      </div>
      <div className="detail-view-content-container">
        <div className="detail-view-top-heading">
          <span>{obj.fullName}</span>
        </div>
        <div className="--line" />
        <div className="--page-title">
          <span>{obj.title}</span>
        </div>
        <div className="detail-view-table-content-container">
          <div className="detail-view-table-top-container">
            <span>Book your session</span>
          </div>
          <Content
            descriptor={descriptor}
            court={court}
            slots={slots}
            doctors={doctors}
            operatingHours={operatingHours}
            selectedSlotIds={selectedSlotIds}
            setSelectedSlotIds={setSelectedSlotIds}
            setSelectedDoctor={setSelectedDoctor}
            selectedDoctor={selectedDoctor}
            setDate={setDate}
            selectedSlots={selectedSlots}
            finalStartTime={finalStartTime}
            finalEndTime={finalEndTime}
            dateOfGame={dateOfGame}
            setDateOfGame={setDateOfGame}
            games={games}
            setSelectedGame={setSelectedGame}
            selectedGame={selectedGame}
          ></Content>
          <div className="--btn">
            <Button onClick={ descriptor.name === "Physio" ?handleBookingForPhysio : handleBookingForYoga } text="Book Now" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

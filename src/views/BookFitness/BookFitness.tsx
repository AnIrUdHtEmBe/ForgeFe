/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CalendarStrip from "../../components/Calendar/Calendar";
import SportStrip from "../../components/SportStrip/SportStrip";
import "./styles.css";
import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from "@atlaskit/dropdown-menu";
import Button from "../../components/Button/Button";
import BookSlot from "./components/BookSlot/BookSlot";
import { getCourtBySportId, getTimeSlotForCourt } from "../../api/courts";
import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { SNACK_AUTO_HIDE } from "../../default";
import type { t_court } from "../../types/court";
import type { t_slot } from "../../types/slot";
import type { t_sport } from "../../types/sports";
import { useLocation } from "react-router-dom";
import { getUserById, getUserByIdAsync } from "../../api/user";
const BookFitness = () => {
  const [courts, setCourts] = useState<t_court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [courtName, setCourtName] = useState("");
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [slots, setSlots] = useState<t_slot[]>([]);
  const [activeDate, setActiveDate] = useState(new Date().toISOString());
  const [activeSport, setActiveSport] = useState<t_sport>();
  const [showBook, setShowBook] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const location = useLocation();
  const { descriptor } = location.state;
  console.log(descriptor);

  useEffect(() => {
    if (!activeSport) return;

    getCourtBySportId(
      async (res: AxiosResponse) => {
        if (res.status === HttpStatusCode.Ok) {
          const courtsWithNames = await Promise.all(
            res.data.map(async ({ name, courtId }: t_court) => {
              const match = name.match(/(USER_[A-Z0-9]+)/i);
              const userId = match ? match[1] : null;

              if (userId) {
                try {
                  const userRes = await getUserByIdAsync(userId);
                  const humanName = userRes?.name || "Unknown";
                  return {
                    courtId,
                    name: `${humanName}'s court`,
                  };
                } catch (error) {
                  console.error("Failed to fetch user name:", error);
                  return { courtId, name: "Unknown's court" };
                }
              }

              return { courtId, name };
            })
          );

          setCourts(courtsWithNames);
        }
      },
      () =>
        enqueueSnackbar({
          message: "Failed to fetch courts.",
          variant: "error",
          autoHideDuration: SNACK_AUTO_HIDE,
        }),
      activeSport?.sportId || ""
    );
  }, [activeSport]);

  useEffect(() => {
    if (selectedCourtId) {
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
        selectedCourtId,
        activeDate
      );
      setSelectedSlotIds([]);
    }
  }, [selectedCourtId]);

  useEffect(() => {
    if (showTimeSlots) {
      setSelectedSlotIds([]);
      setSelectedCourtId("");
      setShowTimeSlots(false);
    }
  }, [showTimeSlots]);

  const handleSlotToggle = (slotId: string) => {
    const index = slots.findIndex((s) => s.slotId === slotId);
    const prev = slots[index - 1]?.slotId;
    const next = slots[index + 1]?.slotId;
    const isAdjacent =
      selectedSlotIds.length === 0 ||
      selectedSlotIds.includes(prev) ||
      selectedSlotIds.includes(next);

    setSelectedSlotIds((prevIds) => {
      if (prevIds.includes(slotId))
        return prevIds.filter((id) => id !== slotId);
      if (isAdjacent) return [...prevIds, slotId];
      console.warn("Only select continuous time slots.");
      return prevIds;
    });
  };

  const handleConfirm = () => {
    if (!selectedCourtId || selectedSlotIds.length === 0) {
      return enqueueSnackbar({
        message: "Please select a court and at least one slot.",
        variant: "warning",
        autoHideDuration: SNACK_AUTO_HIDE,
      });
    }
    if (!activeSport) {
      return enqueueSnackbar({
        message: "Please select a sport.",
        variant: "warning",
        autoHideDuration: SNACK_AUTO_HIDE,
      });
    }
    setShowBook(true);
  };

  const handleDateChange = (date: string) => {
    setActiveDate(date);
    setSelectedCourtId("");
    setSlots([]);
  };

  const selectedSlots = slots
    .filter((slot) => selectedSlotIds.includes(slot.slotId))
    .sort((a, b) => (a.startTime as any) - (b.startTime as any));
  const finalStartTime = Number(selectedSlots[0]?.startTime);
  const finalEndTime = Number(selectedSlots[selectedSlots.length - 1]?.endTime);

  const combineDateWithUnixTime = (dateStr: string, timeUnix: number) => {
    const base = new Date(dateStr);
    const time = new Date(timeUnix * 1000);
    base.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return base;
  };

  const startDateTime = combineDateWithUnixTime(activeDate, finalStartTime);
  const endDateTime = combineDateWithUnixTime(activeDate, finalEndTime);
  useEffect(() => {
    console.log(courts);
  }, [courts]);
  return (
    <div className="book-fitness-container">
      {showBook && (
        <BookSlot
          onClose={() => setShowBook(false)}
          courtId={selectedCourtId}
          startTime={startDateTime}
          endTime={endDateTime}
          sport={activeSport}
          viewTimeSlots={() => setShowTimeSlots(true)}
          setShowTimeSlots={setShowTimeSlots}
        />
      )}

      <div className="book-fitness-top-container">
        <CalendarStrip
          activeDate={activeDate}
          onDateChangeHandler={handleDateChange}
        />
        <SportStrip
          activeSport={{ name: activeSport?.name ?? "" }}
          changeActiveSport={setActiveSport}
          category="FITNESS"
        />
      </div>

      <div className="book-fitness-content-container">
        <div className="top-color-section">
          {["available", "selected", "booked", "blocked"].map((state, idx) => (
            <div key={idx} className="--color-box">
              <div
                className="--color-box-container"
                style={{
                  background: {
                    available: "white",
                    selected: "blue",
                    booked: "grey",
                    blocked: "red",
                  }[state],
                }}
              />
              <span>{state}</span>
            </div>
          ))}
        </div>

        <div className="--court-drop-down">
          <DropdownMenu
            trigger={selectedCourtId ? courtName : "Select Court"}
            shouldRenderToParent
          >
            <DropdownItemRadioGroup id="courts">
              {courts.map(({ courtId, name }) => (
                <DropdownItemRadio
                  key={courtId}
                  id={courtId}
                  isSelected={selectedCourtId === courtId}
                  onClick={() => {
                    setSelectedCourtId(courtId);
                    setCourtName(name);
                  }}
                >
                  {name}
                </DropdownItemRadio>
              ))}
            </DropdownItemRadioGroup>
          </DropdownMenu>
        </div>

        <div className="--time-slot-drop-down">
          <DropdownMenu
            trigger={
              selectedSlots.length > 0
                ? `${new Date(finalStartTime * 1000).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })} - ${new Date(finalEndTime * 1000).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}`
                : "Select Time Slot"
            }
            shouldFitContainer
            shouldRenderToParent
          >
            <DropdownItemCheckboxGroup title="Slots" id="slots">
              {slots.map(({ slotId, startTime, endTime, status }) =>
                status === "available" ? (
                  <DropdownItemCheckbox
                    key={slotId}
                    id={slotId}
                    isSelected={selectedSlotIds.includes(slotId)}
                    onClick={() => handleSlotToggle(slotId)}
                  >
                    {new Date(Number(startTime) * 1000).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    -{" "}
                    {new Date(Number(endTime) * 1000).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </DropdownItemCheckbox>
                ) : (
                  <DropdownItem key={slotId}>
                    <div className="--drop-down">
                      <div
                        className="--color-box-container"
                        style={{
                          background: { booked: "grey", blocked: "red" }[
                            status
                          ],
                        }}
                      />
                      <span>
                        {new Date(Number(startTime) * 1000).toLocaleTimeString(
                          [],
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}{" "}
                        -{" "}
                        {new Date(Number(endTime) * 1000).toLocaleTimeString(
                          [],
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                  </DropdownItem>
                )
              )}
            </DropdownItemCheckboxGroup>
          </DropdownMenu>
        </div>

        <div className="--btn">
          <Button text="Confirm" onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
};

export default BookFitness;

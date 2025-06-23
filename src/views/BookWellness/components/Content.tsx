import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
  DropdownItemGroup,
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from "@atlaskit/dropdown-menu";
import {  useEffect, useState } from "react";
import {getCourtById} from "../../../api/courts";
import type { t_court } from "../../../types/court";
import type { t_slot } from "../../../types/slot";
import { useLocation } from "react-router-dom";
import type { doctor } from "../../../types/doctor";
import type { t_game } from "../../../types/games";
import type { AxiosResponse } from "axios";
export default function Content({
  court,
  slots,
  doctors,
  operatingHours,
  selectedSlotIds,
  setSelectedSlotIds,
  setSelectedDoctor,
  selectedDoctor,
  setDate,
  selectedSlots,
  finalStartTime,
  finalEndTime,
  games,
  dateOfGame,
  setDateOfGame,
  setSelectedGame,
  selectedGame,
  selectedType
}: {
  court: t_court | undefined;
  slots: t_slot[];
  doctors: doctor[];
  operatingHours: string;
  selectedSlotIds: string[];
  setSelectedSlotIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDoctor: (doctor: doctor) => void;
  selectedDoctor: doctor;
  setDate: (date: Date) => void;
  selectedSlots: t_slot[];
  finalStartTime: number;
  finalEndTime: number;
  games: t_game[];
  dateOfGame: Date | null;
  setDateOfGame: (date: Date) => void;
  setSelectedGame: (game: t_game | null) => void;
  selectedGame: t_game | null | undefined;
  selectedType: string;
}) {
  const [courtName , setCourtName] = useState<string>("");
  const location = useLocation();
  const { descriptor } = location.state;
  const handleSlotToggle = (slotId: string) => {
    const index = slots.findIndex((s) => s.slotId === slotId);
    const prev = slots[index - 1]?.slotId;
    const next = slots[index + 1]?.slotId;
    const isAdjacent =
      selectedSlotIds.length === 0 ||
      selectedSlotIds.includes(prev) ||
      selectedSlotIds.includes(next);

    setSelectedSlotIds((prevIds: string[]) => {
      if (prevIds.includes(slotId))
        return prevIds.filter((id) => id !== slotId);
      if (isAdjacent) return [...prevIds, slotId];
      console.warn("Only select continuous time slots.");
      return prevIds;
    });
    
  };
  const getCourtDetails = async (courtId: string) => {
    try {
       await getCourtById(
        (res: AxiosResponse) => {
          console.log("Court details fetched successfully:", res.data);
          setCourtName(res.data.name);
        },
        (error: unknown) => {
          console.error("Error fetching court details:", error);
        },
        courtId
      );
    } catch (error) {
      console.error("Error in getCourtDetails:", error);
      throw error;
    }
  };
  useEffect(() => {
  if (selectedGame?.courtId) {
    getCourtDetails(selectedGame.courtId);
  }
}, [selectedGame?.courtId ]);

  useEffect(() => {
    setSelectedGame(null);
  },[dateOfGame])
  useEffect(() => {
    console.log(selectedType);
    
  },[]);
  return (
    <div className="--content">
      {selectedType === "group" && (
        <>
          <div className="--row">
            <span className="--title">Court</span>
            <span className="--val">{!courtName ? "Select a game to view the court" : courtName}</span>
          </div>
          <div className="--row">
            <span className="--title"> Games</span>
            <span className="--val">
               <DropdownMenu
                trigger={selectedGame ? `
                ${new Date(selectedGame.startTime).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )} - ${new Date(selectedGame.endTime).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                `  : "Select Time Slot"}
              shouldRenderToParent
            >
              <DropdownItemRadioGroup id="games">
                {games.map((game: t_game) => (
                  <DropdownItemRadio
                    key={game.bookingId}
                    id={game.bookingId}
                     isSelected={selectedGame?.gameId === game.gameId}
                     onClick={() => setSelectedGame(game)}
                  >
                     

                    {new Date(game.startTime).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )} - {new Date(game.endTime).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}

                  </DropdownItemRadio>
                ))}
              </DropdownItemRadioGroup>
            </DropdownMenu>
            </span>
          </div>
          <div className="--row">
            <span className="--title">Coach</span>
            <span className="--val">
              {selectedGame ? selectedGame.hostName : "Select a game to view coach"}
            </span>
          </div>
          <div className="--row">
            <span className="--title">Select A Date</span>
            <input
              type="date"
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setDateOfGame(selectedDate);
              }}
            />
          </div>

          <div className="--row">
            <span className="--title">More Info</span>
            <span className="--val">
              <ul>
                {descriptor.instructions.map((el: string) => (
                  <li>{el}</li>
                ))}
              </ul>
            </span>
          </div>
        </>
      )}

      {selectedType === "personal" && (
        <>
        <div className="--row">
            <span className="--title">Select A Date</span>
            <input
              type="date"
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setDate(selectedDate);
              }}
            />
          </div>

          <div className="--row">
            <span className="--title">Doctor</span>
            <DropdownMenu
              trigger={selectedDoctor?.name || "Select Doctor"}
              shouldRenderToParent
            >
              <DropdownItemGroup id="doctors">
                {doctors.map((doctor: doctor) => (
                  <DropdownItem
                    key={doctor.userId}
                    isSelected={selectedDoctor?.userId === doctor.userId}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    {doctor.name}
                  </DropdownItem>
                ))}
              </DropdownItemGroup>
            </DropdownMenu>
          </div>
          <div className="--row">
            <span className="--title">Select A Slot</span>
            <div className="--time-slot-drop-down">
              
              <DropdownMenu
                trigger={
                  selectedSlots.length > 0
                    ? `${new Date(finalStartTime * 1000).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )} - ${new Date(finalEndTime * 1000).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}`
                    : "Select Time Slot"
                }
                shouldFitContainer
                shouldRenderToParent
                shouldFlip  
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
                              background: {
                                booked: "grey",
                                blocked: "red",
                              }[status],
                            }}
                          />
                          <span>
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
                          </span>
                        </div>
                      </DropdownItem>
                    )
                  )}
                </DropdownItemCheckboxGroup>
              </DropdownMenu>
            </div>
          </div>
          <div className="--row">
            <span className="--title">Operating Hours</span>
            <span className="--val">
              {court
                ? operatingHours
                : "Select a doctor to view operating hours"}
            </span>
          </div>
          
          <div className="--row">
            <span className="--title">More Info</span>
            <span className="--val">
              <ul>
                {descriptor.instructions.map((el: string) => (
                  <li>{el}</li>
                ))}
              </ul>
            </span>
          </div>
          
           

          
        </>
      )}
    </div>
  );
}

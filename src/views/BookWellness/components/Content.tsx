import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from "@atlaskit/dropdown-menu";
import type { t_game } from "../../../types/games";
import { useEffect } from "react";
import {getCourtById} from "../../../api/courts";
export default function Content({
  descriptor,
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
  setDateOfGame,
  setSelectedGame,
  selectedGame,
}: any) {
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
  const getCourtDetails = async (courtId: string) => {
    try {
      const response = await getCourtById(
        (res: any) => {
          console.log("Court details fetched successfully:", res.data);
          setSelectedGame((prev: t_game) => ({
            ...prev,
            courtName: res.data.name,
          }));
        },
        (error: any) => {
          console.error("Error fetching court details:", error);
        },
        courtId
      );
      return response.data;
    } catch (error) {
      console.error("Error in getCourtDetails:", error);
      throw error;
    }
  };
  useEffect(() => {
  if (selectedGame?.courtId) {
    getCourtDetails(selectedGame.courtId);
  }
}, [selectedGame?.courtId]);

  
  return (
    <div className="--content">
      {descriptor.name === "yoga" && (
        <>
          <div className="--row">
            <span className="--title">Court</span>
            <span className="--val">{!selectedGame ? "Select a game to view the court" : selectedGame?.courtName}</span>
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
                {games.map((game: any) => (
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

      {descriptor.name === "Physio" && (
        <>
          <div className="--row">
            <span className="--title">Operating Hours</span>
            <span className="--val">
              {court
                ? operatingHours
                : "Select a doctor to view operating hours"}
            </span>
          </div>
          <div className="--row">
            <span className="--title">Doctor</span>
            <DropdownMenu
              trigger={selectedDoctor?.name || "Select Doctor"}
              shouldRenderToParent
            >
              <DropdownItemRadioGroup id="doctors">
                {doctors.map((doctor: any) => (
                  <DropdownItemRadio
                    key={doctor.userId}
                    id={doctor.userId}
                    isSelected={selectedDoctor?.userId === doctor.userId}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    {doctor.name}
                  </DropdownItemRadio>
                ))}
              </DropdownItemRadioGroup>
            </DropdownMenu>
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
                        {new Date(startTime * 1000).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        -{" "}
                        {new Date(endTime * 1000).toLocaleTimeString([], {
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
                            {new Date(startTime * 1000).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            -{" "}
                            {new Date(endTime * 1000).toLocaleTimeString([], {
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
        </>
      )}
    </div>
  );
}

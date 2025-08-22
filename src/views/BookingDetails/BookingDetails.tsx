import React, {  use, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getBookingById, rescheduleBooking } from '../../api/booking';
import { IoIosArrowBack } from 'react-icons/io';
import { DEFAULT_ICON_SIZE, detailsInfoWellness, SNACK_AUTO_HIDE } from '../../default';
import Button from '../../components/Button/Button';
import { getSportsById } from '../../api/sports';
 import './styles.css';
import { getUserById } from '../../api/user';
import { getTimeSlotForCourt } from '../../api/courts';
import { HttpStatusCode, type AxiosResponse } from 'axios';
import DropdownMenu, { DropdownItemCheckboxGroup, DropdownItemCheckbox, DropdownItem } from '@atlaskit/dropdown-menu';
import { enqueueSnackbar } from 'notistack';
import type { t_slot } from '../../types/slot';
import { convertUnixToLocalDateString, convertUnixToLocalTime} from '../../utils/date';
function BookingDetails() {
    
    
    const location = useLocation();
    const { bookingId } = location.state;
    console.log(bookingId,"of global booking?");
    
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [sport , setSport] = useState<any>(null);
    const [obj, setObj] = useState<any>(null);
    const [doctor , setDoctor] = useState<any>(null);
    const [slots, setSlots] = useState<t_slot[]>([]);
     const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const getBooking = async() => {
        const onAccept = (response: any) => {
            if (response.status === 200) {
                setBookingDetails(response.data);
                console.log(response.data);
            } else {
                console.error("Failed to fetch booking data");
            }
        };
        const onReject = (error: unknown) => {
            console.error("Error fetching booking data:", error);
        };
        getBookingById(onAccept, onReject, bookingId);
    }
    useEffect(() => {
        
        getBooking();
    } , [])
    useEffect(() => {
        if(!bookingDetails) return;
        getSportsById(
            (response) => {
                if (response.status === 200) {
                    console.log("Get sports details", response.data);
                    setSport(response.data);
                } else {
                    console.error("Failed to fetch sports details");
                }
            },
            (error) => {
                console.error("Error fetching sports details:", error);
            },
            bookingDetails?.sportId || ""
        );

        getUserById(
            (response) => {
                if (response.status === 200) {
                    console.log("Get user details", response.data);
                    setDoctor(response.data);
                } else {
                    console.error("Failed to fetch user details");
                }
            },
            (error) => {
                console.error("Error fetching user details:", error);
            },            
            bookingDetails?.courtDetails?.name.slice(6) || ""
        ) 

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
                      .sort((a: { startTime: number; }, b: { startTime: number; }) => a.startTime - b.startTime);
                    setSlots(sorted);
                  }
                },
                () =>
                  enqueueSnackbar({
                    message: "Failed to fetch slots.",
                    variant: "error",
                    autoHideDuration: SNACK_AUTO_HIDE,
                  }),
                bookingDetails.courtId,
                // convertUTCToLocalDateString(bookingDetails.startTime),
                convertUnixToLocalDateString(bookingDetails.st_unix)
              );
    }, [bookingDetails]);
    useEffect(() => {
        if(sport === null) return;
        const index = Object.keys(detailsInfoWellness).findIndex(
        (el) => el.toLowerCase() === sport.name.toLowerCase()
      );
      const keys = Object.keys(detailsInfoWellness);
      const name = keys[index];
       setObj(detailsInfoWellness[name as keyof typeof detailsInfoWellness]);
    }, [sport]);

    const backBtnHandler = () => {
        window.history.back();
    };
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
    if(selectedSlotIds.length >= bookingDetails.timeslots.length ) {
            enqueueSnackbar({
              message: `You can only select up to ${bookingDetails.timeslots.length}  continuous time slots.`,
              variant: "error",
              autoHideDuration: SNACK_AUTO_HIDE,
            });
            return prevIds;
        }
      if (isAdjacent) return [...prevIds, slotId];
      console.warn("Only select continuous time slots.");
      return prevIds;
    });
    
  };

    const selectedSlots = slots
    .filter((slot) => selectedSlotIds.includes(slot.slotId))
    .sort((a, b) => (a.startTime as any) - (b.startTime as any));

    const finalStartTime = Number(selectedSlots[0]?.startTime ?? 0);
  const finalEndTime = Number(selectedSlots[selectedSlots.length - 1]?.endTime ?? 0);
   
   
  console.log("Final Start Time:", finalStartTime,selectedSlots);
  


    const rescheduletheBooking = async () => {
        if(selectedSlotIds.length === 0) {
            enqueueSnackbar({
              message: "Please select at least one time slot to reschedule.",
              variant: "error",
              autoHideDuration: SNACK_AUTO_HIDE,
            });
            return;
        }
        const bookingData = {
            bookingId: bookingDetails.bookingId,
            startTime: new Date(finalStartTime *  1000).toISOString(),
            endTime:new Date(finalEndTime*  1000).toISOString(),
            courtId:bookingDetails.courtId
            
        }
        const onAccept = (response: AxiosResponse) => {
            if (response.status === HttpStatusCode.Ok) {
                console.log("Booking rescheduled successfully:", response.data); 
                enqueueSnackbar({
                    message: "Booking rescheduled successfully!",
                    autoHideDuration: SNACK_AUTO_HIDE,
                    variant: "success",
                });
                
            } else {
                console.error("Failed to reschedule booking:", response.data);
                enqueueSnackbar({
                    message: "Failed to reschedule booking!",
                    autoHideDuration: SNACK_AUTO_HIDE,
                    variant: "error",
                });
            }
        };
        const onReject = (error: any) => {
            console.error("Error rescheduling booking:", error);
            enqueueSnackbar({
                message: "Error while rescheduling booking!",
                autoHideDuration: SNACK_AUTO_HIDE,
                variant: "error",
            });
        };
        await rescheduleBooking(
            onAccept,   
            onReject,
            bookingData.bookingId,
            bookingData.startTime,
            bookingData.endTime,
            bookingData.courtId
        )
        await getBooking();
        setSelectedSlotIds([]);
        
    }   
    
    console.log(new Date(Number(bookingDetails?.endTime) * 1000).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }),bookingDetails?.endTime,new Date(bookingDetails?.endTime),selectedSlotIds
,new Date(Number(bookingDetails?.startTime) * 1000).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }),new Date(Number(bookingDetails?.et_unix) * 1000).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }),convertUnixToLocalTime(bookingDetails?.startTime),"this is wont")
    
  
  return (
    <div className="detail-view-container">
      <div className="image-container">
        <div className="--back" onClick={backBtnHandler}>
          <IoIosArrowBack size={DEFAULT_ICON_SIZE - 5} />
        </div>
        <img src={obj?.path} />
      </div>
      <div className="detail-view-content-container">
        <div className="detail-view-top-heading">
          <span>{obj?.fullName}</span>
        </div>
        <div className="--line" />
        <div className="--page-title">
          <span> 1-on-1 Session</span>
        </div>
        <div className="detail-view-table-content-container">
          <div className="detail-view-table-top-container">
            <span>Book your session</span>
          </div>
           <div className="--content">
          <div className="--row">
            <span className="--title">Date</span>
            <span>
              {convertUnixToLocalDateString(bookingDetails?.st_unix)?.split("-").reverse().join("-")}
            </span>
          </div>
          <div className="--row">
            <span className="--title">Doctor</span>
                {doctor?.name}
             </div>
             <div className="--row">
            <span className="--title">Slots </span>
            <div className="--time-slot-drop-down">
              
              <DropdownMenu
                trigger={
                  selectedSlots.length > 0 ?
                 `${new Date(finalStartTime * 1000).toLocaleTimeString(
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
                      )}`:
                      // `${new Date(Number(bookingDetails?.startTime) * 1000).toLocaleTimeString(
                      //   [],
                      //   {
                      //     hour: "numeric",
                      //     minute: "2-digit",
                      //     hour12: true,

                      //   }
                      // )}234432 - ${new Date(Number(bookingDetails?.endTime) * 1000).toLocaleTimeString(
                      //   [],
                      //   {
                      //     hour: "numeric",
                      //     minute: "2-digit",
                      //     hour12: true,
                      //   }
                      // )}`
                      `${convertUnixToLocalTime(bookingDetails?.startTime)}-${convertUnixToLocalTime(bookingDetails?.endTime)}`
                     
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
                                booked: "var(--grey-400)",
                                blocked: "var(--rust-700)",
                              }[status],
                            }}
                          />
                          <span>
                            {new Date(Number(startTime) * 1000).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            -{"  "}
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
            <span className="--title">More Info</span>
            <span className="--val">
              <ul>
                {sport?.instructions.map((el: string) => (
                  <li>{el}</li>
                ))}
              </ul>
            </span>
          </div>
            </div>
          <div className="--btn">
            
            <Button
              onClick={rescheduletheBooking}
              text="Reschedule"
            />

          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails


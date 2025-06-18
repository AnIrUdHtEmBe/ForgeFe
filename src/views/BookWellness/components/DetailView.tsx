/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoIosArrowBack } from "react-icons/io";
import "./styles/detail-view.css";
import { useLocation } from "react-router-dom";
import { DEFAULT_ICON_SIZE, detailsInfoWellness } from "../../../default";
import Button from "../../../components/Button/Button";
import { camelToPascalWithWordSpaces } from "../../../utils/case";
import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from "@atlaskit/dropdown-menu";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../../api/user";

const DetailView = () => {
  const location = useLocation();
  const { descriptor } = location.state;

  const index = Object.keys(detailsInfoWellness).findIndex(
    (el) => el.name.toLowerCase() === descriptor.toLowerCase()
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
          <div className="--desc">{obj.description}</div>
          <div className="--content">
            {Object.keys(obj.fields).map((key, i) => {
              return (
                <div key={i} className="--row">
                  <span className="--title">
                    {camelToPascalWithWordSpaces(key)}
                  </span>
                  {key == "doctor" ? (
                    <DropdownMenu
                      trigger={selectedDoctor ? selectedDoctor.name : "Select Doctor"}
                      shouldRenderToParent
                    >
                      <DropdownItemRadioGroup id="courts">
                        {doctors.map(( doctor ) => (
                          <DropdownItemRadio
                            key={doctor.userId}
                            id={doctor.userId}
                            isSelected={selectedDoctor.userId === doctor.userId}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                            }}
                          >
                            {doctor.name}
                          </DropdownItemRadio>
                        ))}
                      </DropdownItemRadioGroup>
                    </DropdownMenu>
                  ) : (
                    <span className="--val">: {(obj.fields as any)[key]}</span>
                  )}
                </div>
              );
            })}
            {/* <div className="--content">
              {sessionDetails.title === "Group Session" && (
                <>
                  <div className="--row">
                    <span className="--title">Age Group</span>
                    <span className="--val">
                      : {sessionDetails.fields.ageGroup}
                    </span>
                  </div>
                  <div className="--row">
                    <span className="--title">Session Timings</span>
                    <span className="--val">
                      : {sessionDetails.fields.sessionTimings}
                    </span>
                  </div>
                  <div className="--row">
                    <span className="--title">Coach</span>
                    <span className="--val">
                      : {sessionDetails.fields.coach}
                    </span>
                  </div>
                  <div className="--row">
                    <span className="--title">More Info</span>
                    <span className="--val">
                      : {sessionDetails.fields.moreInfo}
                    </span>
                  </div>
                </>
              )}

              {sessionDetails.title === "1-on-1 Session" && (
                <>
                  <div className="--row">
                    <span className="--title">Operating Hours</span>
                    <span className="--val">
                      : {sessionDetails.fields.operatingHours}
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
                            isSelected={
                              selectedDoctor?.userId === doctor.userId
                            }
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
                      : {sessionDetails.fields.moreInfo}
                    </span>
                  </div>
                  <div className="--row">
                    <span className="--title">Select A Time</span>
                    <span className="--val">
                      : {sessionDetails.fields.selectATime}
                    </span>
                  </div>
                </>
              )}
            </div> */}
          </div>
          <div className="--btn">
            <Button text="Book Now" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

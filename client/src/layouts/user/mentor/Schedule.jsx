/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { vi } from "date-fns/locale"; // Import Vietnamese locale
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Schedule.css";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import MKBox from "components/MKBox";
import { Container, Grid, Modal, Slide, Card, Icon } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setActivePopup_Schedule } from "app/slices/activeSlice";
import MKTypography from "components/MKTypography";
const locales = {
  vi,
};
const customMessages = {
  month: "Lịch",
  agenda: "Xem chi tiết",
  today: "Hôm nay",
  next: "Tiếp theo",
  previous: "Lùi lại",
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Schedule = ({ id }) => {
  const [newEvent, setNewEvent] = useState({ title: "", allDay: false, start: "", end: "" });
  const [allEvents, setAllEvents] = useState([]);
  const { active_popup_schedule } = useSelector((state) => state.active);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/matched/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const fetchedEvents = response.data[0].time.map((event) => ({
            title: event.title,
            allDay: event.allDay,
            start: new Date(event.start),
            end: new Date(event.end),
            _id: event._id, // Include event ID
          }));
          setAllEvents(fetchedEvents);
        }
      })
      .catch((err) => console.log("Error fetching calendar events:", err));
  }, [id]);

  const handleAddEvent = () => {
    const formattedStartDate = format(
      new Date(newEvent.date.setHours(newEvent.start.getHours(), newEvent.start.getMinutes())),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );
    const formattedEndDate = format(
      new Date(newEvent.date.setHours(newEvent.end.getHours(), newEvent.end.getMinutes())),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );

    const eventData = {
      title: newEvent.title,
      allDay: false,
      start: formattedStartDate,
      end: formattedEndDate,
    };

    axios
      .post(`${BASE_URL}/matched/${id}`, eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response);
        if (response.status === 200) {
          console.log("Event added successfully");
          // Fetch updated events after adding
          axios
            .get(`${BASE_URL}/matched/${id}`)
            .then((response) => {
              if (response.data && response.data.length > 0) {
                const fetchedEvents = response.data[0].time.map((event) => ({
                  title: event.title,
                  allDay: event.allDay,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  _id: event._id, // Include event ID
                }));
                setAllEvents(fetchedEvents);
              }
            })
            .catch((err) => console.log("Error fetching calendar events:", err));
        } else {
          console.log("Failed to add event:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  const handleDelete = (eventId) => {
    axios
      .delete(`${BASE_URL}/matched/${id}/${eventId}`)
      .then((response) => {
        if (response.status === 200) {
          setAllEvents(allEvents.filter((event) => event._id !== eventId));
          console.log("Event deleted successfully");
        } else {
          console.log("Failed to delete event");
        }
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  // Custom Event Component with Delete Button
  const EventComponent = ({ event }) => (
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
      <span>{event.title}</span>
      <button
        onClick={() => handleDelete(event._id)}
        style={{
          backgroundColor: "#FFF",
          color: "red",
          padding: "5px 8px",
          border: "2px solid red",
          fontWeight: "bold",
          borderRadius: "5px",
          marginLeft: "5px",
          cursor: "pointer",
        }}
      >
        Hủy lịch
      </button>
    </div>
  );

  // PropTypes for EventComponent
  EventComponent.propTypes = {
    event: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired,
      allDay: PropTypes.bool.isRequired,
    }).isRequired,
  };

  const isActivePopup_Schedule = () => dispatch(setActivePopup_Schedule(!active_popup_schedule));
  return (
    <Modal
      open={active_popup_schedule}
      onClose={() => isActivePopup_Schedule()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup_schedule} timeout={500}>
        <Container>
          <Grid position="relative" item xs={12} md={6}>
            <Card id={"edit-profile"}>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-1}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKBox position="relative">
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Lịch họp
                  </MKTypography>
                  <MKBox
                    onClick={isActivePopup_Schedule}
                    position="absolute"
                    right={0}
                    fontSize={24}
                    top="50%"
                    sx={{
                      transform: "translateY(-50%)",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        color: "#FFF",
                      },
                      lineHeight: 1,
                      padding: "5px 5px 2px",
                      cursor: "pointer",
                    }}
                  >
                    <Icon>clear</Icon>
                  </MKBox>
                </MKBox>
              </MKBox>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Thêm tiêu đề"
                  className="input-field"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <DatePicker
                  placeholderText="Chọn ngày"
                  selected={newEvent.date}
                  onChange={(date) => setNewEvent({ ...newEvent, date })}
                  dateFormat="dd-MM-yyyy"
                  locale="vi"
                  className="input-field"
                />
                <DatePicker
                  placeholderText="Thời gian bắt đầu"
                  selected={newEvent.start}
                  onChange={(start) => setNewEvent({ ...newEvent, start })}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="Thời gian bắt đầu"
                  locale="vi"
                  className="input-field"
                />
                <DatePicker
                  placeholderText="Thời gian kết thúc"
                  selected={newEvent.end}
                  onChange={(end) => setNewEvent({ ...newEvent, end })}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="Thời gian kết thúc"
                  locale="vi"
                  className="input-field"
                />
                <button className="add-button" onClick={handleAddEvent}>
                  Thêm sự kiện
                </button>
              </div>
              <Calendar
                culture="vi"
                messages={customMessages}
                views={{
                  month: true,
                  week: false,
                  day: false,
                  agenda: true,
                }}
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                components={{
                  event: EventComponent, // Use custom EventComponent for rendering events
                }}
              />
            </Card>
          </Grid>
        </Container>
      </Slide>
    </Modal>
  );
};
Schedule.propTypes = {
  id: PropTypes.string.isRequired, // hoặc kiểu dữ liệu phù hợp với id của bạn
};

export default Schedule;

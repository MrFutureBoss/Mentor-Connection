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
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Schedule.css";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import MKBox from "components/MKBox";
import { Container, Grid, Modal, Slide, Card, Icon } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setActivePopup_Schedule } from "app/slices/activeSlice";
import MKTypography from "components/MKTypography";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [sameEvents, setSameEvent] = useState([]);
  const [saveMatched, setSaveMatched] = useState(false);
  const dispatch = useDispatch();

useEffect(() => {
  axios
    .get(`${BASE_URL}/matched/${id}`)
    .then((response) => {
      if (response.data && response.data.length > 0) {
        const duplicateId = response.data.flatMap((entry) => entry.time);
        const mentorId = response.data[0].mentorId;
        const mentorIdStr = typeof mentorId === "object" ? mentorId.toString() : mentorId; // Convert to string

        // Store mentorIdStr in localStorage
        localStorage.setItem('mentorIdStr', mentorIdStr);

        console.log("Mentor ID String:", mentorIdStr); // Log the mentorIdStr

        setSameEvent(
          duplicateId.map((event) => ({
            title: event.title,
            allDay: event.allDay,
            start: new Date(event.start),
            end: new Date(event.end),
            _id: event._id,
          }))
        );

        axios
          .get(`${BASE_URL}/matched/mentor/${mentorIdStr}`)
          .then((res) => {
            if (res.data && res.data.length > 0) {
              const allTimes = res.data.flatMap((entry) => entry.time);
              setAllEvents(
                allTimes.map((event) => ({
                  title: event.title,
                  allDay: event.allDay,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  _id: event._id,
                }))
              );
            }
          })
          .catch((err) => console.log("Error fetching mentor's times:", err));
      }
    })
    .catch((err) => console.log("Error fetching matched events:", err));
}, [id]);


  const handleAddEvent = () => {
    // Kiểm tra các trường input
    if (!newEvent.title || !newEvent.date || !newEvent.start || !newEvent.end) {
      toast.info("Vui lòng điền đầy đủ thông tin cuộc họp.");
      return;
    }

    // Kiểm tra điều kiện start không được trước end
    if (newEvent.start > newEvent.end) {
      console.log("Thời gian bắt đầu không được trước thời gian kết thúc.");
      toast.error("Thời gian bắt đầu không được trước thời gian kết thúc.");
      return;
    }

    const newEventStart = new Date(
      newEvent.date.setHours(newEvent.start.getHours(), newEvent.start.getMinutes())
    );
    const newEventEnd = new Date(
      newEvent.date.setHours(newEvent.end.getHours(), newEvent.end.getMinutes())
    );

    // Kiểm tra sự kiện mới có bị chồng chéo với bất kỳ sự kiện nào trong `allEvents` không
    const isOverlapping = allEvents.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      // Kiểm tra sự kiện mới có bị chồng chéo với sự kiện hiện tại không
      return (
        newEventStart < eventEnd && newEventEnd > eventStart // Sự kiện mới nằm chồng lấp trong sự kiện hiện tại
      );
    });

    if (isOverlapping) {
      toast.error("Sự kiện mới không được thêm vì nó bị chồng chéo với một sự kiện khác.");
      return;
    }

    const formattedStartDate = format(
      new Date(newEvent.date.setHours(newEvent.start.getHours(), newEvent.start.getMinutes())),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );
    const formattedEndDate = format(
      new Date(newEvent.date.setHours(newEvent.end.getHours(), newEvent.end.getMinutes())),
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );

    // // Định dạng giờ cho đầu vào
    // const formattedStartTime = format(newEventStart, "HH:mm");
    // const formattedEndTime = format(newEventEnd, "HH:mm");

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
          toast.success("Cuộc họp đã được thêm thành công - hãy vào phần lịch họp để xem chi tiết");
          // Fetch updated events after adding
          const mentorIdStr = localStorage.getItem("mentorIdStr");
          axios
            .get(`${BASE_URL}/matched/mentor/${mentorIdStr}`)
            .then((res) => {
              if (res.data && res.data.length > 0) {
                const allTimes = res.data.flatMap((entry) => entry.time);
                setAllEvents(
                  allTimes.map((event) => ({
                    title: event.title,
                    allDay: event.allDay,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    _id: event._id,
                  }))
                );
              }
            })
            .catch((err) => console.log("Error fetching mentor's times:", err));
        } else {
          console.log("Failed to add event:", response.data);
          toast.error("Thêm cuộc họp thất bại");
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        toast.error("Đã xảy ra lỗi khi thêm cuộc họp");
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

const EventComponent = ({ event }) => {
  // Kiểm tra xem event có trùng với matchedEvents không
  const isMatched = sameEvents.some(
    (matchedEvent) =>
      matchedEvent.start.getTime() === event.start.getTime() &&
      matchedEvent.end.getTime() === event.end.getTime()
  );
  setSaveMatched(isMatched)
  

  return (
    <div
      style={{
        width: "100%",
        justifyContent: "space-between",
        maxHeight: "100px",
        overflowY: "auto",
      }}
    >
      <strong style={{ display: "block", fontSize: "14px" }} title={event.title}>
        {event.title}
      </strong>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <small
          style={{ display: "block", fontSize: "12px", fontStyle: "italic", color: "#FFFFF0" }}
          title={event.title}
        >
          ({format(event.start, "HH:mm")} - {format(event.end, "HH:mm")})
        </small>
        <button
          onClick={() => handleDelete(event._id)}
          style={{
            height: "20px",
            fontSize: "12px",
            backgroundColor: "#FFF",
            color: "red",
            padding: "3px 6px",
            border: "2px solid red",
            fontWeight: "bold",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
            display: saveMatched ? "" : "none",
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

// PropTypes for EventComponent
EventComponent.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    allDay: PropTypes.bool.isRequired,
  }).isRequired
};

  const DateCell = ({ events }) => {
    return (
      <div
        style={{
          width: "100%",
          padding: "5px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          minWidth: "100px",
          minHeight: "50px",
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {events ? (
          events?.map((e) => (
            <div key={e._id}>
              <p title={e.title} style={{ margin: 0, fontSize: "0.75rem", display: "none" }}>
                {e.title}
              </p>
            </div>
          ))
        ) : (
          <p style={{ margin: 0, fontSize: "0.75rem", }}></p>
        )}
      </div>
    );
  };

  DateCell.propTypes = {
    events: allEvents,
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
                <input
                  type="date"
                  placeholder="Chọn ngày"
                  onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                  className="input-field"
                  min={format(new Date(), "yyyy-MM-dd")} // Chỉ cho phép chọn ngày hiện tại hoặc tương lai
                />
                <input
                  type="time"
                  placeholder="Thời gian bắt đầu"
                  className="input-field"
                  value={newEvent.start ? format(newEvent.start, "HH:mm") : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const date = newEvent.date ? newEvent.date : new Date();
                    const startDate = new Date(date);
                    startDate.setHours(hours);
                    startDate.setMinutes(minutes);
                    setNewEvent({ ...newEvent, start: startDate });
                  }}
                  min={
                    newEvent.date && newEvent.date.toDateString() === new Date().toDateString()
                      ? format(new Date(), "HH:mm")
                      : "00:00"
                  } // Chỉ cho phép chọn giờ hiện tại hoặc tương lai nếu cùng ngày
                />

                <input
                  type="time"
                  placeholder="Thời gian kết thúc"
                  className="input-field"
                  value={newEvent.end ? format(newEvent.end, "HH:mm") : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const date = newEvent.date ? newEvent.date : new Date();
                    const endDate = new Date(date);
                    endDate.setHours(hours);
                    endDate.setMinutes(minutes);
                    setNewEvent({ ...newEvent, end: endDate });
                  }}
                  min={
                    newEvent.start
                      ? format(newEvent.start, "HH:mm")
                      : newEvent.date && newEvent.date.toDateString() === new Date().toDateString()
                      ? format(new Date(), "HH:mm")
                      : "00:00"
                  } // Chỉ cho phép chọn giờ sau thời gian bắt đầu nếu cùng ngày
                />

                <button className="add-button" onClick={handleAddEvent}>
                  Thêm cuộc hẹn
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
                  dateCellWrapper: DateCell, // Thay thế ô ngày bằng DateCell
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

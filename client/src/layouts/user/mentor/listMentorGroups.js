import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { blueGrey } from "@mui/material/colors";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setMentorGroups } from "app/slices/mentorSlice";
import logoAvatar from "../../../assets/images/logos/gray-logos/logo.webp";
import { toast } from "react-toastify";

function MentorGroups() {
  const groups = useSelector((state) => state.mentor.mentorGroups);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  console.log(jwt);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/mentor/mentor_groups`, config)
      .then((response) => {
        dispatch(setMentorGroups(response.data));
        if (response.data && response.data.length > 0) {
          setSelectedGroup(response.data[0]);
        }
      })
      .catch((err) => console.log("Error fetching mentor groups:", err));
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/mentor/mentor_groups`, config)
      .then((response) => {
        dispatch(setMentorGroups(response.data));
        if (response.data && response.data.length > 0) {
          setSelectedGroup(response.data[0]);
        }
      })
      .catch((err) => console.log("Error fetching mentor groups:", err));
  }, [dispatch]);

  const handleClick = (group) => {
    setSelectedGroup(group);
  };

  const handleApprove = (groupId, groupName) => {
    axios
      .patch(`${BASE_URL}/matched/${groupId}`, { status: "Approve" }, config)
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Bạn đã Đồng ý với dự án ${groupName}`);
          const updatedGroups = groups.map((group) =>
            group._id === groupId ? { ...group, status: "Approve" } : group
          );
          dispatch(setMentorGroups(updatedGroups));
          if (selectedGroup._id === groupId) {
            setSelectedGroup({ ...selectedGroup, status: "Approve" });
          }
        }
      })
      .catch((err) => console.log("Error approving group:", err));
  };

  const handleDelete = (groupId, groupName) => {
    console.log(groupId);
    axios
      .delete(`${BASE_URL}/matched/${groupId}`, config)
      .then((response) => {
        if (response.status === 200) {
          toast.error(`Bạn đã Từ chối dự án ${groupName}`);
          const updatedGroups = groups.filter((group) => group._id !== groupId);
          dispatch(setMentorGroups(updatedGroups));
          if (selectedGroup._id === groupId && updatedGroups.length > 0) {
            setSelectedGroup(updatedGroups[0]);
          } else if (updatedGroups.length === 0) {
            setSelectedGroup(null);
          }
        }
      })
      .catch((err) => console.log("Error deleting group:", err));
  };

  const appStyle = {
    display: "flex",
    fontFamily: "Open Sans, sans-serif",
    color: "#333",
    margin: "auto",
    height: "100vh",
    width: "100%",
  };

  const leftStyle = {
    padding: "25px",
    width: "60%",
    background: "linear-gradient(45deg, #375967 30%, #6d8e95 80%)",
    overflowY: "auto",
    backdropFilter: "blur(5px)",
    height: "100%",
    borderRadius: "10px 0 0 10px",
  };

  const rightStyle = {
    padding: "20px",
    borderLeft: "1px solid #FFF",
    width: "100%",
    background: "linear-gradient(-45deg, #375967 30%, #6d8e95 80%)",
    backgroundColor: "#FE6B8B",
    backdropFilter: "blur(5px)",
    height: "100%",
    overflowY: "auto",
    borderRadius: "0 10px 10px 0",
  };

  return (
    <div style={appStyle}>
      <div style={leftStyle}>
        <List>
          {groups.map((group) => (
            <Card
              key={group._id}
              onClick={() => handleClick(group)}
              sx={{
                marginBottom: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                transform: selectedGroup === group ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedGroup === group ? 3 : 1,
                bgcolor: blueGrey[50],
              }}
            >
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                  {group.groupName} &nbsp;
                  <small style={{ color: "red", fontStyle: "italic", fontWeight: "lighter" }}>
                    {group.status === "Pending"
                      ? "(Đang chờ duyệt)"
                      : group.status === "Approve"
                      ? ""
                      : "Giá trị không xác định"}
                  </small>
                </Typography>
                <Typography style={{ fontFamily: "math" }} variant="body2">
                  Thành viên: {group.memberCount} người
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Dự án: {group.projectName}
                </Typography>
                <div>
                  {group.projectCategories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      color="primary"
                      variant="outlined"
                      style={{ margin: "2px" }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display:
                      group.status === "Pending"
                        ? "flex"
                        : group.status === "Approve"
                        ? "none"
                        : "",
                    justifyContent: "end",
                    marginTop: "5px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#FFF",
                      color: "green",
                      fontWeight: "bold",
                      padding: "5px 8px",
                      border: "2px solid green",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleApprove(group._id, group.projectName)}
                  >
                    {" "}
                    Đồng ý
                  </button>
                  <button
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
                    onClick={() => handleDelete(group._id, group.projectName)}
                  >
                    Từ chối
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </List>
      </div>
      <div style={rightStyle}>
        {selectedGroup && (
          <Card
            sx={{ width: "90%", height: "auto", padding: "10px", boxShadow: 3, margin: "auto" }}
          >
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                {selectedGroup.groupName}
              </Typography>
              <Typography
                color="primary"
                style={{ fontSize: "18px" }}
                variant="h6"
                gutterBottom
                mb={2}
              >
                Dự án: {selectedGroup.projectName}
              </Typography>

              <List>
                {selectedGroup.members.map((member, index) => (
                  <ListItem
                    key={index}
                    style={{ padding: "6px", backgroundColor: "#00000008" }}
                    sx={{ bgcolor: "white", my: 1, borderRadius: "10px", boxShadow: 1 }}
                  >
                    <ListItemAvatar style={{ padding: "10px" }}>
                      <Avatar src={member.avatar}>
                        {member.avatar ? null : (
                          <img
                            src={logoAvatar}
                            alt="Logo Avatar"
                            style={{ width: "100%", height: "100%" }}
                          />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      style={{ fontFamily: "ui-sans-serif" }}
                      primary={
                        <span style={{ fontSize: "21px", fontFamily: "math" }}>{member.name}</span>
                      }
                      secondary={
                        <>
                          <span style={{ fontWeight: "bold", fontFamily: "math" }}>
                            {member.rollNumber}
                          </span>
                          <br />
                          <span style={{ fontStyle: "italic", fontFamily: "math" }}>
                            {member.email}
                          </span>
                        </>
                      }
                    />

                    {member.isLeader && (
                      <StarBorderIcon
                        style={{ marginRight: "40px" }}
                        color="primary"
                        sx={{ ml: "auto" }}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MentorGroups;

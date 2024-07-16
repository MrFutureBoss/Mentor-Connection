/* eslint-disable prettier/prettier */
import { List, ListItem, ListItemText, Avatar, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setActivePopup } from "app/slices/activeSlice";
import MKButton from "components/MKButton";
import "../../sections/featuers/components/FeaturesOne/studentList.css";
import { useLocation, useNavigate } from "react-router-dom";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import getParams from "utilities/getParams";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import SettingsIcon from "@mui/icons-material/Settings";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { updateGroupLeader } from "app/slices/groupSlice";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale'; // Import locale data for Vietnamese
import PushPinIcon from '@mui/icons-material/PushPin';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditNoteIcon from '@mui/icons-material/EditNote';

const GroupMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();
  const groupId = getParams(2, url.pathname);
  const { group: groupDetails } = useSelector((state) => state.group);
  const { userLogin } = useSelector((state) => state.user);

  const handleLeaderChange = (userId, userName) => {
    Swal.fire({
      title: "Bạn muốn đổi " + userName + " thành trưởng nhóm không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const jwt = localStorage.getItem("jwt");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        };
        axios
          .patch(
            `${BASE_URL}/user/update_leader`,
            {
              _id: userId,
              isLeader: true,
            },
            config
          )
          .then((response) => {
            console.log("Response:", response.data);
            dispatch(updateGroupLeader({ groupId, userId }));
            Swal.fire("Đã cập nhật thành công!", "", "success");
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật trưởng nhóm:", error);
            Swal.fire("Có lỗi xảy ra!", "Vui lòng thử lại sau.", "error");
          });
      }
    });
  };
  const handleUserDetailClick = (userId) => {
    navigate(`/user/${userId}/profile`);
  };
  const openMeet = (email) => {
    window.open(`https://meet.google.com/new?email=${encodeURIComponent(email)}`, '_blank'); // Mở liên kết Meet trong tab mới
  };
  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        justifyContent: "space-between",
        m: 3,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Box sx={{ width: "65%", marginRight: 2, marginTop: 1 }}>
        {groupDetails?.project && (
          <Box
            elevation={3}
            style={{
              padding: "20px",
              marginBottom: "40px",
              boxShadow: "0 0.5px 4px 1px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              position: "relative",
              backgroundColor: "#00000008",
              border: "1px solid rgb(216, 215, 215)",
            }}
          >
            <MKTypography
              variant="h6"
              sx={{
                marginBottom: 1,
                fontFamily: "inherit",
                fontSize: "1.25rem",
                fontWeight: "600",
              }}
            >
              Tên dự án: {groupDetails?.project?.name}
            </MKTypography>
            <hr style={{ marginBottom: "5px" }}></hr>
            {groupDetails?.projectcategories?.length > 0 && (
              <MKBox display="flex" gap="0.5rem">
                <MKTypography fontSize=".825rem" color="text" fontWeight="medium">
                  Lĩnh vực:
                </MKTypography>
                <MKTypography fontSize=".825rem" color="text">
                  {groupDetails?.projectcategories?.map((c) => c.name)?.join(", ")}
                </MKTypography>
              </MKBox>
            )}
            {groupDetails?.project?.description && (
              <MKBox display="flex" gap="0.5rem">
                <MKTypography fontSize=".825rem" color="text" fontWeight="medium">
                  Mô tả dự án:
                </MKTypography>
                <MKTypography fontSize=".825rem" color="text">
                  {groupDetails?.project?.description}
                </MKTypography>
              </MKBox>
            )}
            {groupDetails?.project?.status && (
              <MKBox display="flex" gap="0.5rem">
                <MKTypography fontSize=".825rem" color="text" fontWeight="medium">
                  Tình trạng dự án:
                </MKTypography>
                <MKTypography fontSize=".825rem" color="text">
                  <span
                    style={{
                      color:
                        groupDetails?.project?.status == "Decline"
                          ? "red"
                          : groupDetails?.project?.status == "InProgress"
                            ? "#00FF00"
                            : groupDetails?.project?.status == "Changing"
                              ? "#0066CC"
                              : groupDetails?.project?.status == "Planning"
                                ? "#009900"
                                : "",
                    }}
                  >
                    {groupDetails?.project?.status == "Changing"
                      ? "Đang thay đổi"
                      : groupDetails?.project?.status == "Decline"
                        ? "Bị từ chối"
                        : groupDetails?.project?.status == "Planning"
                          ? "Đang chờ duyệt"
                          : groupDetails?.project?.status == "InProgress"
                            ? "Đang hoạt động"
                            : ""}
                  </span>
                </MKTypography>
              </MKBox>
            )}
            {userLogin?.isLeader &&
              userLogin?.groupId[0]?._id === groupId &&
              !["Planning", "InProgress", "Changing"].includes(groupDetails?.project?.status) && (
                <MKButton
                  onClick={() => dispatch(setActivePopup(true))}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    margin: "8px",
                    backgroundColor: "#00000001",
                  }}
                >
                  Cập nhật dự án
                </MKButton>
              )}
            {userLogin?.isLeader &&
              userLogin?.groupId[0]?._id === groupId &&
              ["Planning", "InProgress", "Changing"].includes(groupDetails?.project?.status) && (
                <MKButton
                  onClick={() => dispatch(setActivePopup(true))}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    margin: "8px",
                    backgroundColor: "#d9d8d0",
                  }}
                >
                  Sửa lại dự án
                </MKButton>
              )}
          </Box>
        )}
        <Box
          elevation={3}
          style={{
            boxShadow: "0 0.5px 4px 1px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgb(216, 215, 215)",
          }}
        >
          <MKTypography
            variant="h6"
            sx={{
              pt: 2,
              pl: 2,
              pb: 2,
              backgroundColor: "#00000008",
              fontSize: "0.925rem",
              fontWeight: "600",
              borderBottom: " 1px  solid rgb(216, 215, 215)",
            }}
          >
            <MKTypography variant="h6" gutterBottom>
              {groupDetails?.name}
              <MKTypography variant="h6" component="span" color="primary" sx={{ ml: 1 }}>
                ({groupDetails?.userCount} Thành viên)
              </MKTypography>
            </MKTypography>
          </MKTypography>
          <List
            sx={{
              padding: "20px",
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {groupDetails?.members?.map((member) => (
              <ListItem
                key={member.username}
                sx={{
                  "&:not(:last-child)": {
                    mb: 2,
                    borderBottom: "1px solid #eee",
                  },
                  p: 2,
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.03)",
                    cursor: "pointer",
                  },
                }}
              >
                <Avatar
                  onClick={() => handleUserDetailClick(member?._id)}
                  alt={member.username}
                  src={member.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    marginRight: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                  }}
                >
                  {member.avatar ? null : member.username.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={
                    <MKTypography fontWeight="medium" fontSize="0.925rem">
                      {member.username}
                    </MKTypography>
                  }
                  secondary={
                    <MKTypography variant="body2" color="text" fontSize="0.825rem">
                      <i>{member.email}</i>
                    </MKTypography>
                  }
                  sx={{ marginLeft: "16px" }}
                />
                <MKTypography sx={{ fontFamily: "inherit", fontWeight: "medium" }}>
                  {member.isLeader && <StarBorderIcon color="warning" sx={{ ml: "auto" }} />}
                  {!member.isLeader && userLogin.role === 2 && (
                    <SettingsIcon
                      color="disabled"
                      className="custom-star-icon"
                      onClick={() => handleLeaderChange(member._id, member.username)}
                      sx={{
                        ml: "auto",
                      }}
                    />
                  )}
                </MKTypography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box marginTop={1} sx={{ width: "30%" }}>
        {groupDetails?.mentor?.length > 0 && (
          <Box
            onClick={() => handleUserDetailClick(groupDetails?.mentor[0]._id)}
            sx={{
              padding: 3,
              textAlign: "center",
              marginBottom: 2,
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              borderRadius: "12px",
              border: "1px solid rgba(225, 225, 225, 0.6)",
              backgroundColor: "white",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              src={groupDetails?.mentor?.[0].image}
              sx={{
                width: 80,
                height: 80,
                marginX: "auto",
                marginBottom: 2,
              }}
            />
            <MKTypography variant="h6" sx={{ fontFamily: "inherit", fontWeight: "bold" }}>
              {groupDetails?.mentor?.[0].username}
            </MKTypography>
            <MKTypography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic", marginBottom: 1 }}
            >
              {groupDetails?.mentor?.[0].email}
            </MKTypography>
            <MKTypography variant="body2" sx={{ color: "text.secondary" }}>
              {groupDetails?.mentor?.[0].phoneNumber}
            </MKTypography>
            <MKTypography variant="body2" sx={{ color: "text.secondary" }}>
              {groupDetails?.mentorcategories?.map((c) => c.name)?.join(", ")}
            </MKTypography>
            <MKTypography variant="caption" sx={{ color: "text.primary" }}>
              {groupDetails?.mentor?.[0].degree}
            </MKTypography>
          </Box>
        )}
        {groupDetails?.matched?.length > 0 && groupDetails?.mentor?.length > 0 && (
          <Box
            sx={{
              padding: 3,
              textAlign: "left",
              marginBottom: 2,
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              borderRadius: "12px",
              border: "1px solid rgba(225, 225, 225, 0.6)",
              backgroundColor: "white",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <MKTypography variant="h5" sx={{ fontFamily: "inherit", fontWeight: "bold" }}>
              Lịch Họp -             <button
                style={{
                  color: "#FFF", fontSize: "15px", fontWeight: "bold", padding: "5px 10px", backgroundColor: "orange",
                  border: "1px solid orange", borderRadius: "5px", cursor: "pointer"
                }}
                onClick={() => openMeet(groupDetails?.mentor?.[0].email)}
              >
                Meet-URL
              </button>
            </MKTypography>
            {groupDetails?.matched?.map((match) =>
              match.time.map((meet, meetIndex) => (
                <MKTypography
                  key={meet._id}
                  variant="body2"
                  sx={{ color: "text.secondary", margin: "10px auto", backgroundColor: "#f9f5d2", padding:'10px', borderRadius: "5px" }}
                >
                  <p>
                    <strong><PushPinIcon style={{color: "red"}}/> Buổi {meetIndex + 1}: </strong>{format(new Date(meet.start), "EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi })}
                  </p>
                  <p>
                    <strong><AccessTimeIcon /> Bắt đầu từ </strong>{format(new Date(meet.start), "HH:mm", { locale: vi })} giờ <strong>đến</strong> {format(new Date(meet.end), "HH:mm", { locale: vi })} giờ
                  </p>
                  <p><strong><EditNoteIcon style={{ color: "#00BFFF"}}/> Nội dung cuộc họp:</strong> {meet.title}</p>
                </MKTypography>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GroupMembers;

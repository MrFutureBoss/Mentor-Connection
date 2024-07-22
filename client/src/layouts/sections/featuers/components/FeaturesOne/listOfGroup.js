import { Typography, Box, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import PropTypes from "prop-types";
import { setActivePopup } from "app/slices/activeSlice";
import { setGroup } from "app/slices/groupSlice";
import "./studentList.css";
import MKTypography from "components/MKTypography";

const ListOfGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups } = useSelector((state) => state.group);
  const { userLogin } = useSelector((state) => state.user);
  const { active_popup } = useSelector((state) => state.active);
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));

  const handleGroupDetailClick = (groupId) => {
    navigate(`/group/${groupId}/members`);
  };

  const Mentor = ({ image, username, email, mentorcategories, label }) => {
    return (
      <Box
        sx={{
          p: 1.3,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            width: "100%",
          }}
        >
          <Avatar src={image} alt={username} sx={{ height: "30px", width: "30px", mr: 1 }} />
          <MKBox sx={{ width: "calc(100% - 54px)" }}>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              className="truncate"
              color="textSecondary"
              noWrap
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Tên:
              </Typography>
              {username}
              <Typography as={"span"} fontSize={"0.825rem"} sx={{ color: "#000" }}>
                <em>{label && `(${label})`}</em>
              </Typography>
            </Typography>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              className="truncate"
              color="textSecondary"
              noWrap
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Email:
              </Typography>
              {email}
            </Typography>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              color="textSecondary"
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Lĩnh vực:
              </Typography>
              {mentorcategories?.map((p) => p.name).join(", ")}
            </Typography>
          </MKBox>
        </Box>
      </Box>
    );
  };
  Mentor.propTypes = {
    image: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mentorcategories: PropTypes.array.isRequired,
    label: PropTypes.string,
  };
  return (
    <Box
      sx={{
        mt: 2,
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      {groups?.map((group) => (
        <Box
          key={group._id}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "calc(100%/3 - 30px)",
            minHeight: 186,
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            marginBottom: "8px",
            position: "relative",
          }}
        >
          <Box
            className="gradient-animated"
            sx={{
              color: "#fff",
              p: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <MKBox display={"flex"} justifyContent="space-between">
              <Typography
                flex={1}
                as="div"
                sx={{ color: "#fff" }}
                variant="subtitle1"
                width="80%"
                className="truncate"
              >
                <MKTypography
                  as="span"
                  color="white"
                  fontWeight="bold"
                  sx={{ fontSize: "0.925rem", mr: "4px" }}
                >
                  Tên: {group.name}
                </MKTypography>
                <MKTypography as="span" color="white" sx={{ fontSize: "0.925rem" }}>
                  <i>({group.class?.className})</i>
                </MKTypography>
              </Typography>
            </MKBox>
            {group?.project?.length > 0 && (
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Dự án: {group.project[0]?.name}
              </Typography>
            )}
            {group?.projectcategories?.length > 0 && (
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Lĩnh vực: {group?.projectcategories?.map((c) => c.name)?.join(", ")}
              </Typography>
            )}
          </Box>
          {group?.matched?.length > 0 && (
            <Mentor
              username={group?.matched?.[0]?.username}
              image={group?.matched?.[0]?.image || ""}
              email={group?.matched?.[0]?.email}
              mentorcategories={group?.matchedMentorcategories}
            />
          )}
          {group?.matching?.[0]?.length > 0 && (
            <Mentor
              username={group?.matching?.[0]?.username}
              image={group?.matching?.[0]?.image || ""}
              email={group?.matching?.[0]?.email}
              mentorcategories={group?.matchedMentorcategories}
            />
          )}
          {group?.matched?.length === 0 && group?.matching?.length === 0 && (
            <MKBox
              sx={{
                flex: 1,
                cursor: "pointer",
                textDecoration: "underline",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              fontSize={"0.825rem"}
              onClick={() => {
                if (userLogin?.role === 2) {
                  isActivePopup();
                  dispatch(setGroup(group));
                }
              }}
            >
              {(userLogin?.role === 2 || userLogin?.role === 1) && (
                <em>Danh sách người hướng dẫn</em>
              )}
            </MKBox>
          )}
          <Box
            px={2}
            py={1}
            sx={{
              bgcolor: "#F4F4F4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize={"0.825rem"} variant="body2">
              {group?.userCount} Thành viên
            </Typography>
            <Typography
              variant="body2"
              fontSize={"0.725rem"}
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleGroupDetailClick(group?._id)}
            >
              <em>Chi tiết nhóm</em>
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ListOfGroups;

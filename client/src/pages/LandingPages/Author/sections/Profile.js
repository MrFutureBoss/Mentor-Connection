// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKAvatar from "components/MKAvatar";
import MKTypography from "components/MKTypography";

// Images
import profilePicture from "assets/images/bruce-mars.jpg";
import { useDispatch, useSelector } from "react-redux";
import MKButton from "components/MKButton";
import { setActivePopup } from "app/slices/activeSlice";
import getDate from "utilities/getDate";
import { Icon, Container, Grid } from "@mui/material";
import { setActivePopupChangePassword } from "app/slices/activeSlice";
import { useLocation } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const { userLogin, userProfile } = useSelector((state) => state.user);
  const url = useLocation();
  const isPersonalProfile = url.pathname.startsWith("/pages/landing-pages/author");
  const userData = isPersonalProfile ? userLogin : userProfile;
  const { active_popup } = useSelector((state) => state.active);
  const { active_change_password } = useSelector((state) => state.active);
  const { data: categories } = useSelector((state) => state.category.categories);
  const { data: mentorCategories } = useSelector((state) => state.category.mentorCategories);
  const {
    username,
    phoneNumber,
    classId,
    gender,
    email,
    Dob,
    menteeCount,
    degree,
    role,
    classList,
  } = userData || {};

  let classNamesDisplay;
  if (role === 2) {
    classNamesDisplay = classList.map((cl) => cl.className).join(", ");
  } else {
    const className = classId && classId.length > 0 ? classId[0].className : "";
    classNamesDisplay = className;
  }
  return (
    <MKBox component="section" py={{ xs: 6, sm: 12 }}>
      <Container>
        <Grid container item xs={12} justifyContent="center" mx="auto" sx={{ userSelect: "none" }}>
          <MKBox mt={{ xs: -16, md: -20 }} textAlign="center">
            <MKBox position={"relative"}>
              <MKAvatar src={profilePicture} alt="Burce Mars" size="xxl" shadow="xl" />
              <Icon
                sx={{
                  padding: "4px",
                  position: "absolute",
                  bottom: "8%",
                  right: 0,
                  color: "#000",
                  transform: "translateY(-8%)",
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "100%",
                  backgroundColor: "#b8b8b8",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#9c9c9c",
                  },
                }}
              >
                photo_camera
              </Icon>
            </MKBox>
          </MKBox>
          <Grid container justifyContent="center" sx={{ position: "relative" }} py={6}>
            <Grid item xs={12} md={7} mx={{ xs: "auto", sm: 6, md: 1 }}>
              <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                {username && <MKTypography variant="h3">{username}</MKTypography>}
                {phoneNumber && (
                  <MKBox
                    size="small"
                    sx={{
                      background: "#ccc",
                      padding: "10px 28px",
                      borderRadius: "8px",
                      fontWeight: 500,
                      cursor: "default",
                    }}
                  >
                    {phoneNumber}
                  </MKBox>
                )}
              </MKBox>
              <Grid container display={"flex"} flexDirection={"column"} gap={"1rem"} py={2}>
                {role === 2 || role === 4 ? (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Lớp:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {classNamesDisplay}
                    </MKTypography>
                  </MKBox>
                ) : null}
                {email && (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Email:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {email}
                    </MKTypography>
                  </MKBox>
                )}
                <MKBox>
                  <MKTypography component="span" variant="body2" fontWeight="bold">
                    Giới tính:&nbsp;
                  </MKTypography>
                  <MKTypography
                    component="span"
                    variant="body2"
                    color="text"
                    sx={{ fontWeight: "400" }}
                  >
                    {gender ? "Nam" : "Nữ"}
                  </MKTypography>
                </MKBox>
                {Dob && (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Ngày sinh:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {getDate(Dob).split("-").reverse().join("-")}
                    </MKTypography>
                  </MKBox>
                )}
                {menteeCount && (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Số lượng nhóm hướng dẫn:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {menteeCount}
                    </MKTypography>
                  </MKBox>
                )}

                {degree && (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Mô tả sự nghiệp:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {degree}
                    </MKTypography>
                  </MKBox>
                )}
                {role === 3 && mentorCategories && mentorCategories.length > 0 && (
                  <MKBox>
                    <MKTypography component="span" variant="body2" fontWeight="bold">
                      Thể loại:&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="span"
                      variant="body2"
                      color="text"
                      sx={{ fontWeight: "400" }}
                    >
                      {categories
                        .filter((c) => mentorCategories.some((mc) => mc.categoryId === c._id))
                        .map((c) => c.name)
                        .join(", ")}
                    </MKTypography>
                  </MKBox>
                )}
              </Grid>
            </Grid>
            {isPersonalProfile && (
              <MKBox
                sx={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: "10px" }}
              >
                <MKButton onClick={() => dispatch(setActivePopup(!active_popup))}>
                  Chỉnh sửa thông tin cá nhân
                </MKButton>
                <MKButton
                  onClick={() => dispatch(setActivePopupChangePassword(!active_change_password))}
                >
                  Đổi mật khẩu
                </MKButton>
              </MKBox>
            )}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Profile;

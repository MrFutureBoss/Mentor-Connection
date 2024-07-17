import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import DefaultNavbar from "Navbars/DefaultNavbar";
import Profile from "pages/LandingPages/Author/sections/Profile";
// import Posts from "pages/LandingPages/Author/sections/Posts";
// import Footer from "pages/LandingPages/Author/sections/Footer";
import routes from "routes";
import bgImage from "assets/images/city-profile.jpg";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin } from "app/slices/userSlice";
import { setActivePopup } from "app/slices/activeSlice";
import { setCategories, setMentorCategories } from "app/slices/categorySlice";
import EditProfile from "./sections/EditProfile";
import { checkError } from "utilities/auth";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./sections/ChangePassword";
import { useLocation } from "react-router-dom";
import getParams from "utilities/getParams";
import { setUserProfile } from "app/slices/userSlice";

function Author() {
  const dispatch = useDispatch();
  const url = useLocation();
  const userId = getParams(2, url.pathname);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const { userLogin } = useSelector((state) => state.user);
  const { userProfile } = useSelector((state) => state.user);
  const { active_popup } = useSelector((state) => state.active);
  const active_change_password = useSelector((state) => state.active.active_change_password);
  const { _id: id } = userLogin || {};

  useEffect(() => {
    axios
      .get(BASE_URL + "/user/profile", config)
      .then((res) => dispatch(setUserLogin(res.data)))
      .catch((err) => checkError(err, navigate));
  }, [dispatch]);
  useEffect(() => {
    if (userId) {
      axios
        .get(BASE_URL + `/user/${userId}/profile`, config)
        .then((res) => {
          dispatch(setUserProfile(res.data));
          return axios.get(BASE_URL + `/mentor_category/${userId}`, config);
        })
        .then((res) => {
          dispatch(setMentorCategories(res.data));
        })
        .catch((err) => checkError(err, navigate));
    }
  }, [dispatch, userId, navigate, userProfile]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/category")
      .then((res) => dispatch(setCategories(res.data)))
      .catch((err) => console.log(err));
    dispatch(setActivePopup(false));
    if (id)
      axios
        .get(BASE_URL + "/mentor_category/" + id, config)
        .then((res) => dispatch(setMentorCategories(res.data)))
        .catch((err) => console.log(err.message));
  }, [dispatch, userLogin]);

  return (
    <>
      <DefaultNavbar routes={routes} brand="Education Gate" transparent light sticky />
      {active_popup ? <EditProfile /> : ""}
      {active_change_password ? <ChangePassword /> : ""}

      <MKBox bgColor="white">
        <MKBox
          minHeight="25rem"
          width="100%"
          sx={{
            backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.dark.main, 0.8),
                rgba(gradients.dark.state, 0.8)
              )}, url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
          }}
        />
        <Card
          sx={{
            p: 2,
            mx: { xs: 2, lg: 3 },
            mt: -8,
            mb: 4,
            backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
            backdropFilter: "saturate(200%) blur(30px)",
            boxShadow: ({ boxShadows: { xxl } }) => xxl,
          }}
        >
          <Profile />
        </Card>
        {/* <Contact /> */}
        {/* <Footer /> */}
      </MKBox>
    </>
  );
}

export default Author;

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";
// import MKSocialButton from "components/MKSocialButton";
// import DefaultFooter from "examples/Footers/DefaultFooter";
import DefaultNavbar from "Navbars/DefaultNavbar";
// import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";
import Counters from "pages/Presentation/sections/Counters";
// import Information from "pages/Presentation/sections/Information";
// import DesignBlocks from "pages/Presentation/sections/DesignBlocks";
// import Pages from "pages/Presentation/sections/Pages";
// import BuiltByDevelopers from "pages/Presentation/components/BuiltByDevelopers";
// import Testimonials from "pages/Presentation/sections/Testimonials";
import routes from "routes";
// import footerRoutes from "footer.routes";
import bgImage from "../../assets/images/home_page/background_home.webp";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogin } from "app/slices/userSlice";
import { checkError } from "utilities/auth";
import { useNavigate } from "react-router-dom";
import { setSemesters } from "app/slices/semesterSlice";
import { setPmtUser } from "app/slices/userSlice";
import { motion } from "framer-motion";
import { setGroupsMatched } from "app/slices/userSlice";

function Presentation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/profile`, config)
      .then((res) => dispatch(setUserLogin(res.data)))
      .catch((err) => checkError(err, navigate));
  }, [dispatch]);
  // api user in the system
  useEffect(() => {
    axios
      .get(`${BASE_URL}/semester`, config)
      .then((res) => dispatch(setSemesters(res.data)))
      .catch((err) => console.log(err));
    axios
      .get(`${BASE_URL}/user/parameter`, config)
      .then((res) => dispatch(setPmtUser(res.data)))
      .catch((err) => console.log(err));
  }, [dispatch]);
  // api groups matched
  useEffect(() => {
    axios
      .get(`${BASE_URL}/matched/groups_matched`, config)
      .then((res) => dispatch(setGroupsMatched(res.data)))
      .catch((error) => console.log(error));
  }, [dispatch]);

  const style = `
  @keyframes rainbowAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

  return (
    <>
      <style>{style}</style>
      <DefaultNavbar routes={routes} brand="Startup Gate" transparent light />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "contain",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      ></MKBox>
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
        <Counters />
        {/* <DesignBlocks /> */}
        {/* <Information />
        <Pages />
        <Container sx={{ mt: 6 }}>
          <BuiltByDevelopers />
        </Container> */}
        {/* <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                variant="gradient"
                color="info"
                icon="flag"
                title="Getting Started"
                description="Check the possible ways of working with our product and the necessary files for building your own project."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/overview/material-kit/",
                  label: "Let's start",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon="precision_manufacturing"
                title="Plugins"
                description="Get inspiration and have an overview about the plugins that we used to create the Material Kit."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/overview/datepicker/",
                  label: "Read more",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon="apps"
                title="Components"
                description="Material Kit is giving you a lot of pre-made components, that will help you to build UI's faster."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/alerts/material-kit/",
                  label: "Read more",
                }}
              />
            </Grid>
          </Grid>
        </Container> */}
        {/* <Testimonials /> */}
        <MKBox pt={18} pb={6}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.h1
                  initial={{ opacity: 0.5, y: -100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-left text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                  Hệ Thống Giáo Dục
                </motion.h1>
              </Grid>
              <Grid item xs={12} lg={5} sx={{ textAlign: { lg: "left" } }}>
                <motion.h1
                  initial={{ opacity: 0.5, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="py-4 bg-clip-text text-left font-medium tracking-tight text-transparent md:text-7xl"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(0, 12, 44, 1), rgba(0, 48, 73, 1), rgba(0, 98, 132, 1), rgba(0, 168, 204, 1))",
                    backgroundSize: "200% 200%",
                    animation: "rainbowAnimation 3s ease infinite",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "38px",
                    marginTop: "-28px",
                  }}
                >
                  Edu Gate
                </motion.h1>
              </Grid>
              <Grid item xs={12} lg={5} ml="auto" sx={{ textAlign: { lg: "right" } }}>
                <motion.h1
                  style={{ fontSize: "22px", marginTop: "-69px" }}
                  initial={{ opacity: 0.5, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-left text-3xl font-medium tracking-tight text-transparent md:text-6xl"
                >
                  Nơi truy cập mà người dùng có thể tiếp cận được những người có chuyên môn về các
                  chủ đề mà dự án bạn có hướng dẫn giúp đỡ bạn đến với thành công. <br />
                </motion.h1>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </Card>
      {/* <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox> */}
    </>
  );
}

export default Presentation;

import DefaultNavbar from "Navbars/DefaultNavbar";
import MKBox from "components/MKBox";
import bgImage from "assets/images/group.png";
import Card from "@mui/material/Card";
import Routes from "routes";
import ProjectRequest from "./listRequestProject";

const TeacherAccep = () => {
  return (
    <>
      <DefaultNavbar routes={Routes} />
      <MKBox bgColor="#00000008">
        <MKBox
          minHeight="25rem"
          width="100%"
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
          }}
        />
        <Card
          sx={{
            width: "85%",
            margin: "auto",
            p: "15px",
            mt: -20,
            mb: 4,
            backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
            backdropFilter: "saturate(200%) blur(30px)",
            boxShadow: ({ boxShadows: { xxxl } }) => xxxl,
          }}
        >
          <ProjectRequest />
        </Card>
      </MKBox>
    </>
  );
};

export default TeacherAccep;

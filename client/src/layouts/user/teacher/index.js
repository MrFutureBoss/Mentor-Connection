import React, { useState, useEffect } from "react";
import DefaultNavbar from "Navbars/DefaultNavbar";
import MKBox from "components/MKBox";
import bgImage from "assets/images/group.png";
import Card from "@mui/material/Card";
import Routes from "routes";
import axios from "axios";
import { Button, Chip, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useSelector } from "react-redux";
import ProjectRequest from "./listRequestProject";
import ChangingProjectsPopup from "./ChangingProjectsPopup";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

const TeacherAccep = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [numChangingProjects, setNumChangingProjects] = useState(0);
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  useEffect(() => {
    if (userLogin?._id) {
      axios
        .get(`${BASE_URL}/project/changing-projects/${userLogin._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          setNumChangingProjects(res.data.length);
        })
        .catch((err) => checkError(err, navigate));
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;
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
          <Chip
            label={
              <span>
                Các nhóm cập nhật lại:{" "}
                <span className="blinking-text">{numChangingProjects} nhóm</span>
              </span>
            }
            onClick={handleOpenDialog}
            variant="contained"
            color="secondary"
            sx={{
              color: "#ffffff",
              textTransform: "none",
              top: 7,
              left: "80.5%",
              width: "18%",
              background: "linear-gradient(45deg, #375967 30%, #6d8e95 80%)",
              "& .blinking-text": {
                animation: `${blink} 1s infinite`,
              },
            }}
          />
          <ProjectRequest />
          <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ maxWidth: "90%" }}>
            <DialogContent>
              <ChangingProjectsPopup open={openDialog} handleClose={handleCloseDialog} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </MKBox>
    </>
  );
};

export default TeacherAccep;

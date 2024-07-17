import { Card, Modal, Slide } from "@mui/material";
import { setActivePopup } from "app/slices/activeSlice";
import { setTemporaryMatching } from "app/slices/temporaryMatching";
import { setLimit } from "app/slices/utilitiesSlice";
import axios from "axios";
import MKBox from "components/MKBox";
import Tables from "layouts/tables/mentor-list-table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";

const TemporaryMatching = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { active_popup } = useSelector((state) => state.active);
  const { group } = useSelector((state) => state.group);
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const { limit, pageNo, search } = useSelector((state) => state.utilities);
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    if (group?._id && jwt)
      axios
        .get(
          `${BASE_URL}/group/${group?._id}/group?search=${search}&limit=${limit}&skip=${skip}`,
          config
        )
        .then((res) => {
          dispatch(setTemporaryMatching(res.data));
        })
        .catch((err) => checkError(err, navigate));
  }, [group, pageNo, search, active_popup, dispatch]);
  useEffect(() => {
    dispatch(setLimit(10));
  }, [dispatch]);
  return (
    <Modal
      open={active_popup}
      onClose={() => isActivePopup()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup} timeout={500}>
        <Card
          id="list-temparary-matching"
          position="absolute"
          p={0}
          sx={{ width: "76%", height: "calc(100% - 48px)", overflow: "auto", outline: "none" }}
        >
          <MKBox>
            <Tables />
          </MKBox>
        </Card>
      </Slide>
    </Modal>
  );
};

export default TemporaryMatching;

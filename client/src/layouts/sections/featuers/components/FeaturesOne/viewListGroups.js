import ViewGroups from "ViewGroups";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import DefaultNavbar from "Navbars/DefaultNavbar";
import routes from "routes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserLogin } from "app/slices/userSlice";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";

const ListGroups = () => {
  const dispatch = useDispatch();
  const { userLogin } = useSelector((state) => state.user);
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    if (jwt)
      axios
        .get(BASE_URL + "/user/profile", config)
        .then((res) => dispatch(setUserLogin(res.data)))
        .catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid item container>
        <Grid item xs={10} mx="auto">
          <ViewGroups teacherId={userLogin?._id} />
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default ListGroups;

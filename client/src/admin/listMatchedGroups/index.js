import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import DefaultNavbar from "Navbars/DefaultNavbar";
import routes from "routes";
import Tables from "layouts/tables/group-matched-table";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setGroupsMatched } from "app/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const GroupsMatched = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const { delMatched } = useSelector((state) => state.temporaryMatching);

  useEffect(() => {
    if (delMatched?.matchedId) {
      axios
        .delete(`${BASE_URL}/matched/${delMatched?.matchedId}`, config)
        .then(() => {
          axios
            .get(`${BASE_URL}/matched/groups_matched`, config)
            .then((res) => dispatch(setGroupsMatched(res.data)))
            .catch((error) => console.log("Error fetching groups: ", error));
        })
        .catch((err) => console.log("Error deleting matched: ", err));
    }
  }, [dispatch, delMatched]);

  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "10rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid container width="100%" display="flex" justifyContent="center">
        <Grid item sm={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            <Tables />
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default GroupsMatched;

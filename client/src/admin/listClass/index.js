import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import DefaultNavbar from "Navbars/DefaultNavbar";
import Tables from "layouts/tables/class-list-table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import AddClassList from "./addListClass";
import { setActivePopup } from "app/slices/activeSlice";
import { setSort, setclasses } from "app/slices/classSlice";
import { setPageNo, setSearch } from "app/slices/utilitiesSlice";
import routes from "routes";

function ListClass() {
  const dispatch = useDispatch();
  const { active_popup } = useSelector((state) => state.active);
  const { sort, deleteClass } = useSelector((state) => state.class);
  const { pageNo, limit, search } = useSelector((state) => state.utilities);
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const getClassInfo = () =>
    axios
      .get(`${BASE_URL}/class?item=createdAt&order=${sort}&skip=${skip}&search=${search}`, config)
      .then((res) => dispatch(setclasses(res.data)))
      .catch((error) => console.log(error));
  useEffect(() => {
    if (deleteClass?._id)
      axios
        .delete(`${BASE_URL}/class/${deleteClass?._id}`)
        .then(() => getClassInfo())
        .catch((error) => console.log(error.message));
  }, [dispatch, deleteClass]);
  useEffect(() => {
    getClassInfo();
  }, [dispatch, search, sort, pageNo]);
  useEffect(() => {
    dispatch(setActivePopup(false));
    dispatch(setSearch(""));
    dispatch(setSort(-1));
    dispatch(setPageNo(0));
  }, [dispatch]);
  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid item container>
        <Grid item xs={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            {active_popup ? <AddClassList /> : ""}
            <MKBox height="100%" width="100%">
              <MKBox px={0} width="100%" mx="auto" position="relative">
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  width={"100%"}
                  m={0}
                  height="100%"
                >
                  <Grid item xs={12} width="100%" p={0}>
                    <Tables />
                  </Grid>
                </Grid>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default ListClass;

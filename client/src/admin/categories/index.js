import { Grid } from "@mui/material";
import DefaultNavbar from "Navbars/DefaultNavbar";
import { setCategories } from "app/slices/categorySlice";
import axios from "axios";
import MKBox from "components/MKBox";
import Tables from "layouts/tables/categories-list-table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Routes from "routes";
import { BASE_URL } from "utilities/initialValue";
import Category from "./category";

const Categories = () => {
  const dispatch = useDispatch();
  const { search, pageNo, limit } = useSelector((state) => state.utilities);
  const skip = pageNo * limit;
  useEffect(() => {
    axios
      .get(`${BASE_URL}/category?skip=${skip}&limit=${limit}&search=${search}`)
      .then((res) => dispatch(setCategories(res.data)))
      .catch((e) => console.log(e));
  }, [dispatch, pageNo, search]);
  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={Routes} />
      <Category />
      <Grid item container>
        <Grid item xs={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            <MKBox height="100%" width="100%">
              <MKBox px={0} width="100%" mx="auto" position="relative">
                <Tables />
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default Categories;

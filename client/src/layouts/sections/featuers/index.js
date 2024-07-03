import React, { useEffect } from "react";
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import ListOfGroups from "./components/FeaturesOne/listOfGroup";
import axios from "axios";
import DefaultNavbar from "Navbars/DefaultNavbar";
import routes from "routes";
import TemporaryMatching from "./components/FeaturesOne/listTemporaryMaching";
import { BASE_URL } from "utilities/initialValue";
import { setUserLogin, setUsers } from "app/slices/userSlice";
import getParams from "utilities/getParams";
import { useLocation } from "react-router-dom";
import { setGroups } from "app/slices/groupSlice";
import ListOfStudent from "./components/FeaturesOne/listOfStudent";
import { setClass } from "app/slices/classSlice";

const TeacherFunction = () => {
  const dispatch = useDispatch();
  const url = useLocation();
  const params = getParams(3, url.pathname);
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}/class/${params}`, config)
      .then((res) => dispatch(setClass(res.data)))
      .catch((err) => console.log(err));
  }, [params, dispatch]);
  useEffect(() => {
    dispatch(setUsers({}));
    axios
      .get(BASE_URL + "/user/profile", config)
      .then((res) => dispatch(setUserLogin(res.data)))
      .catch((err) => console.log(err));
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/class/${params}/students`, config)
      .then((res) => dispatch(setUsers({ data: res.data })))
      .catch((err) => console.log(err));
  }, [params, dispatch]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/group/${params}/groups`, config)
      .then((res) => dispatch(setGroups(res.data)))
      .catch((err) => console.log(err));
  }, [params, dispatch]);

  return (
    <>
      <DefaultNavbar routes={routes} />
      <TemporaryMatching />
      <MKBox pt={{ xs: 12, sm: 12 }} height="100vh" display="flex" justifyContent="center">
        <Grid container width="100%" mx={"4rem"} display="flex" justifyContent="center">
          <Grid item xs={10} md={12}>
            <MKBox display="flex" flexDirection="column">
              <ListOfGroups />
              <ListOfStudent />
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
};
export default TeacherFunction;

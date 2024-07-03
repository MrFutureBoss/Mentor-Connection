import {
  AppBar,
  Card,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  Slide,
  Tab,
  Tabs,
} from "@mui/material";
import { setActivePopup } from "app/slices/activeSlice";
import MKBox from "components/MKBox";
import { useDispatch, useSelector } from "react-redux";
import MKButton from "components/MKButton";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import {
  setUserWithoutSemester,
  setSelectAll,
  setPageNo,
  setSelectUser,
  setRole,
} from "app/slices/userSlice";
import Tables from "layouts/tables/users-without-smt-list-table";
import { useEffect, useState } from "react";
import { setUsersInSmt } from "app/slices/semesterSlice";

const AddInSmtDet = () => {
  const dispatch = useDispatch();
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState([]);
  const { active_popup } = useSelector((state) => state.active);
  const { pageNo } = useSelector((state) => state.utilities);
  const { smtDet } = useSelector((state) => state.semester);
  const { selectUser, selectAll, role } = useSelector((state) => state.user);
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  const smtId = semester?._id || semesters?.[0]?._id;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}/semester/upcoming`, config)
      .then((res) => setSemesters(res.data))
      .catch((err) => console.log(err));
  }, []);
  const handleTabType = (event, newValue) => {
    dispatch(setPageNo(0));
    dispatch(setRole(newValue));
    dispatch(setSelectUser([]));
    dispatch(
      setSelectAll({
        type: 0,
        payload: false,
      })
    );
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/without_semester?skip=${pageNo * 10}&role=${role}`, config)
      .then((res) => dispatch(setUserWithoutSemester(res.data)))
      .catch((err) => console.log(err));
  }, [pageNo, dispatch, smtDet, role, semester, semesters, pageNo, active_popup]);
  const handleAddInSmtDet = () => {
    const formAddValue = selectUser.map((user) => user._id);
    axios
      .post(
        `${BASE_URL}/semester_detail/${smtId}/semester`,
        { formvalue: formAddValue, actions: selectAll },
        config
      )
      .then(() => {
        axios
          .get(`${BASE_URL}/semester_detail/${smtId}/semester/${role}/users?skip=0`, config)
          .then((res) => dispatch(setUsersInSmt(res.data)))
          .catch((err) => console.log(err));
        axios
          .get(`${BASE_URL}/user/without_semester?skip=0&role=${role}`, config)
          .then((res) => dispatch(setUserWithoutSemester(res.data)))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err.message));
    dispatch(
      setSelectAll({
        type: 0,
        payload: false,
      })
    );
  };
  useEffect(() => {
    dispatch(
      setSelectAll({
        type: 0,
        payload: false,
      })
    );
    dispatch(setSelectUser([]));
    dispatch(setPageNo(0));
  }, [dispatch, role, active_popup]);
  return (
    <Modal
      open={active_popup.payload === "smtDet"}
      onClose={() => isActivePopup({ type: "close", payload: "" })}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup.payload === "smtDet"} timeout={500}>
        <Card
          id={"add_list_in_semester"}
          className="pop-up"
          position="absolute"
          p={0}
          my="auto"
          sx={{ width: "60%", height: "90%", overflow: "auto" }}
        >
          <MKBox px={3} my={2}>
            <Grid item xs={12}>
              <AppBar position="static">
                <Tabs value={role} onChange={handleTabType}>
                  <Tab
                    icon={
                      <MKBox
                        component="i"
                        color="dark"
                        mr={1.25}
                        sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                        className="fas fa-desktop"
                      />
                    }
                    value={4}
                    label="Học sinh"
                  />
                  <Tab
                    icon={
                      <MKBox
                        component="i"
                        color="dark"
                        mr={1.25}
                        sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                        className="fas fa-code"
                      />
                    }
                    value={2}
                    label="Giáo viên"
                  />
                  <Tab
                    icon={
                      <MKBox
                        component="i"
                        color="dark"
                        mr={1.25}
                        sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                        className="fas fa-code"
                      />
                    }
                    value={3}
                    label="Người hướng dẫn"
                  />
                </Tabs>
              </AppBar>
            </Grid>
          </MKBox>
          <MKBox display="flex" gap="2rem" mx="1rem">
            <MKBox>
              <MKButton onClick={handleAddInSmtDet}>Lưu</MKButton>
            </MKBox>
            <MKBox mx={2} mb={1} minWidth="10rem">
              <FormControl fullWidth>
                <Select id="select-semster-add" name="semster-add" value={smtId}>
                  {semesters?.map((s) => (
                    <MenuItem key={s._id} onClick={() => setSemester(s)} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MKBox>
          </MKBox>
          <MKBox>
            <Tables />
          </MKBox>
        </Card>
      </Slide>
    </Modal>
  );
};

export default AddInSmtDet;

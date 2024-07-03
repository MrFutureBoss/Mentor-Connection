import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import axios from "axios";
import MKBox from "components/MKBox";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "utilities/initialValue";
import { setActivePopup } from "app/slices/activeSlice";
import { setSemesters, setSemester, setUsersInSmt } from "app/slices/semesterSlice";
import { setPmtUser } from "app/slices/userSlice";
import AddInSmtDet from "./addInSmtDet";
import MKButton from "components/MKButton";
import DefaultNavbar from "Navbars/DefaultNavbar";
import routes from "routes";
import Tables from "layouts/tables/user-in-semester-table";
import { setPageNo } from "app/slices/utilitiesSlice";
import Semester from "./semester";

const Semesters = () => {
  const dispatch = useDispatch();
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  const { data: semesters } = useSelector((state) => state.semester.semesters);
  const { semester, smtDet } = useSelector((state) => state.semester);
  const { active_popup } = useSelector((state) => state.active);
  const { pageNo } = useSelector((state) => state.utilities);
  const { role } = useSelector((state) => state.user);
  const smtId = semester?._id || semesters?.[0]?._id;
  const skip = pageNo * 10;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
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
  useEffect(() => {
    if (smtId)
      axios
        .get(`${BASE_URL}/semester_detail/${smtId}/semester/${role}/users?skip=${skip}`, config)
        .then((res) => dispatch(setUsersInSmt(res.data)))
        .catch((err) => console.log(err));
  }, [dispatch, semester, semesters, role, pageNo, active_popup]);
  useEffect(() => {}, [dispatch, smtDet]);
  useEffect(() => {
    dispatch(setPageNo(0));
  }, [dispatch, role]);
  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid item container>
        <Grid item xs={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            {active_popup.payload === "smtDet" && <AddInSmtDet />}
            {active_popup.payload === "semester" && <Semester />}
            <MKBox display={"flex"} flexDirection="column" gap="3rem" height="100%" width="100%">
              <MKBox display="flex" flexDirection="row" gap="1.5rem">
                <MKBox minWidth="9rem">
                  <FormControl fullWidth pb={1}>
                    <Select
                      className="select-item"
                      name="role"
                      value={semester?._id || semesters?.[0]?._id || " "}
                    >
                      <MenuItem value=" ">Chọn Kỳ học</MenuItem>
                      {semesters?.map((s) => (
                        <MenuItem
                          key={s._id}
                          onClick={() => {
                            dispatch(setSemester(s));
                          }}
                          value={s._id}
                        >
                          {s.name} ({s.status})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </MKBox>
                <MKBox onClick={() => isActivePopup({ type: "add", payload: "smtDet" })}>
                  <MKButton>Thêm vào kì học</MKButton>
                </MKBox>
                <MKBox onClick={() => isActivePopup({ type: "create", payload: "semester" })}>
                  <MKButton>Tạo mới kì học</MKButton>
                </MKBox>
                <MKBox onClick={() => isActivePopup({ type: "update", payload: "semester" })}>
                  <MKButton>Cập nhật kì học</MKButton>
                </MKBox>
              </MKBox>
              <Tables />
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default Semesters;

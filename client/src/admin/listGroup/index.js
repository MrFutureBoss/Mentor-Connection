import ViewGroups from "ViewGroups";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import DefaultNavbar from "Navbars/DefaultNavbar";
import routes from "routes";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setSemesters, setSemester } from "app/slices/semesterSlice";
import { useDispatch, useSelector } from "react-redux";

const Groups = () => {
  const dispatch = useDispatch();
  const { data: semesters } = useSelector((state) => state.semester.semesters);
  const { semester } = useSelector((state) => state.semester);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState({});
  const smtId = semester?._id || semesters?.[0]?._id;
  const teacherId = teacher._id || teachers?.[0]?._id;
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
  }, []);
  useEffect(() => {
    if (smtId)
      axios
        .get(`${BASE_URL}/user/${smtId}/semester?role=2`, config)
        .then((res) => setTeachers(res.data))
        .catch((error) => console.log(error));
  }, [semester, smtId]);
  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid item container-fluid>
        <Grid item sm={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            <MKBox height="100%" width="95%" mx="auto">
              <MKBox
                display="flex"
                maxWidth="50%"
                gap="1.5rem"
                mb="-3rem"
                zIndex="5"
                position="relative"
              >
                <FormControl fullWidth pb={1}>
                  <Select className="select-item" name="role" value={smtId || " "}>
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
                <FormControl fullWidth>
                  <Select
                    name="teacherId"
                    sx={{ padding: "0.75rem !important" }}
                    value={teacherId || " "}
                  >
                    <MenuItem value={" "}>Chọn giáo viên của lớp học</MenuItem>
                    {teachers?.map((s) => (
                      <MenuItem key={s._id} value={s._id} onClick={() => setTeacher(s)}>
                        {s.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MKBox>
              <MKBox px={0} width="100%" mx="auto" position="relative">
                <ViewGroups teacherId={teacherId} />
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default Groups;

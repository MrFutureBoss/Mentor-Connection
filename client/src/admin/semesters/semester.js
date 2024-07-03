import { Card, FormControl, InputLabel, MenuItem, Modal, Select, Slide } from "@mui/material";
import { setActivePopup } from "app/slices/activeSlice";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import * as Yup from "yup";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setSemesters } from "app/slices/semesterSlice";
import { BASE_URL } from "utilities/initialValue";
import axios from "axios";

const Semester = () => {
  const dispatch = useDispatch();
  const { active_popup } = useSelector((state) => state.active);
  const { semester } = useSelector((state) => state.semester);
  const { data: semesters } = useSelector((state) => state.semester.semesters);
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  const initialValue =
    active_popup.type === "update"
      ? semesters?.find((s) => s._id === semester?._id) || semesters?.[0]
      : { name: "" };
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const getSmt = () =>
    axios
      .get(`${BASE_URL}/semester`, config)
      .then((res) => dispatch(setSemesters(res.data)))
      .catch((err) => console.log(err));
  const handleSubmit = (values) => {
    if (active_popup.type === "update")
      axios
        .patch(`${BASE_URL}/semester/${values._id}`, values, config)
        .then(() => getSmt())
        .catch((err) => console.log(err));
    else
      axios
        .post(`${BASE_URL}/semester`, values, config)
        .then(() => getSmt())
        .catch((err) => console.log(err));
    isActivePopup({ type: "close", payload: "" });
  };
  const deleteSemester = (values) => {
    if (values.status !== "Upcoming") return;
    axios
      .delete(`${BASE_URL}/semester/${values._id}`, config)
      .then(() => getSmt())
      .catch((err) => console.log(err));
    isActivePopup({ type: "close", payload: "" });
  };
  const initialValues = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên của kỳ học"),
  });
  return (
    <Modal
      open={active_popup.payload === "semester"}
      onClose={() => isActivePopup({ type: "close", payload: "" })}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup.payload === "semester"} timeout={500}>
        <Card position="absolute" p={0}>
          <MKBox
            width={"400px"}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={1}
            mb={2}
            textAlign="center"
          >
            <MKTypography variant="h4" fontWeight="medium" color="white" my={1}>
              Kỳ học
            </MKTypography>
          </MKBox>
          <MKBox py={2} px={1}>
            <Formik
              initialValues={initialValue}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
              validationSchema={initialValues}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => {
                return (
                  <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <MKBox>
                      <Field
                        fullWidth
                        component={MKInput}
                        value={values.name}
                        label="Nhập tên học kỳ"
                        placeholder="Fall 2024"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        className={`${touched.name && errors.name ? "error" : ""}`}
                        id="name"
                      />
                      <ErrorMessage name="name" component="div" className="lg_error_message" />
                    </MKBox>
                    {active_popup.type === "update" && (
                      <FormControl fullWidth pb={1}>
                        <InputLabel id="select-semester-label">Trạng thái kỳ học</InputLabel>
                        <Select
                          labelId="select-semester-label"
                          id="select-semester-action"
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          label="Trạng thái kỳ học"
                        >
                          <MenuItem value={"Ongoing"}>Đang diễn ra</MenuItem>
                          <MenuItem value={"Upcoming"}>Sắp diễn ra</MenuItem>
                          <MenuItem value={"Finished"}>Đã kết thúc</MenuItem>
                          <MenuItem value={"Closed"}>Đã đóng</MenuItem>
                          <MenuItem value={"Cancelled"}>Đã hủy</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    <MKBox display="flex" gap="3.5rem">
                      <MKButton
                        type="submit"
                        sx={{
                          background: "#1A73E8",
                          marginTop: "6px",
                          color: "#FFFFFF",
                          width: "100%",
                          "&:hover": {
                            backgroundColor: "#1865ca !important",
                          },
                          "&:focus:not(:hover)": {
                            backgroundColor: "#1865ca",
                          },
                        }}
                      >
                        Thêm
                      </MKButton>
                      {active_popup.type === "update" && (
                        <MKButton
                          onClick={() => deleteSemester(values)}
                          disabled={values.status !== "Upcoming"}
                          sx={{
                            background: "#1A73E8",
                            marginTop: "6px",
                            color: "#FFFFFF",
                            width: "100%",
                            "&:hover": {
                              backgroundColor: "#1865ca !important",
                            },
                            "&:focus:not(:hover)": {
                              backgroundColor: "#1865ca",
                            },
                          }}
                        >
                          Xóa
                        </MKButton>
                      )}
                    </MKBox>
                  </Form>
                );
              }}
            </Formik>
          </MKBox>
        </Card>
      </Slide>
    </Modal>
  );
};

export default Semester;

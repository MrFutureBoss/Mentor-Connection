// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "utilities/initialValue";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppBar, FormControl, MenuItem, Modal, Select, Slide, Tab, Tabs } from "@mui/material";
import { setActive } from "app/slices/activeSlice";
import { setclasses } from "app/slices/classSlice";
import MKButton from "components/MKButton";
import { setActivePopup } from "app/slices/activeSlice";
import MKInput from "components/MKInput";
import readeFile from "utilities/readeFile";

function AddClassList() {
  const dispatch = useDispatch();
  const [fileValue, setFileValue] = useState();
  const [teachers, setTeachers] = useState([]);
  const { active } = useSelector((state) => state.active);
  const { search, limit } = useSelector((state) => state.utilities);
  const { sort, pageNo } = useSelector((state) => state.class);
  const { active_popup } = useSelector((state) => state.active);
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const handleTabType = (event, newValue) => dispatch(setActive(newValue));
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/teacher/inactive`, config)
      .then((res) => {
        setTeachers(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    dispatch(setActive(0));
  }, [dispatch]);
  const formValues = {
    className: "",
    limitStudent: 30,
    teacherId: "",
    file: "",
  };
  const initialValues = Yup.object().shape(
    active === 0
      ? {
          className: Yup.string().required("Vui lòng nhập tên của lớp học"),
          teacherId: Yup.string().required("Vui lòng chọn giáo viên cho lớp học"),
          limitStudent: Yup.number()
            .typeError("Vui lòng nhập số")
            .required("Vui lòng nhập giới hạn sinh viên của lớp của lớp học"),
        }
      : {
          file: Yup.mixed().required("Vui lòng chọn một file"),
        }
  );
  const getClassInfo = () =>
    axios
      .get(`${BASE_URL}/class?item=createdAt&order=${sort}&skip=${skip}&search=${search}`, config)
      .then((response) => dispatch(setclasses(response.data)))
      .catch((error) => console.log(error));
  const handleSubmit = (values) => {
    axios
      .post(BASE_URL + "/class/create_new_classes", active === 0 ? values : fileValue, config)
      .then(() => getClassInfo())
      .catch((error) => console.error(error.message));
    isActivePopup();
  };
  return (
    <Modal
      open={active_popup}
      onClose={() => isActivePopup()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup} timeout={500}>
        <Grid minWidth={"50%"} position="relative" item xs={12} md={6}>
          <Card position="absolute" p={0}>
            <MKBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              mx={2}
              mt={-2}
              p={2}
              mb={1}
              textAlign="center"
            >
              <MKTypography variant="h4" fontWeight="medium" color="white" my={1}>
                Tạo danh sách Lớp học
              </MKTypography>
            </MKBox>
            <MKBox px={3}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs value={active} onChange={handleTabType}>
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
                      label="Thêm"
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
                      label="Thêm từ File(.xlsx)"
                    />
                  </Tabs>
                </AppBar>
              </Grid>
            </MKBox>
            <MKBox pt={2} pb={3} px={3}>
              <MKBox mb={2}>
                <Formik
                  initialValues={formValues}
                  onSubmit={(values) => handleSubmit(values)}
                  validationSchema={initialValues}
                >
                  {({ values, errors, touched, handleChange }) => (
                    <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {active === 0 ? (
                        <>
                          <MKBox>
                            <Field
                              fullWidth
                              component={MKInput}
                              value={values.className}
                              label="Nhập tên của lớp"
                              type="text"
                              onChange={handleChange}
                              name="className"
                              className={`${touched.className && errors.className && "error"}`}
                              id="className"
                            />
                            <ErrorMessage
                              name="className"
                              component="div"
                              className="lg_error_message"
                            />
                          </MKBox>
                          <MKBox>
                            <Field
                              fullWidth
                              component={MKInput}
                              label="Giới hạn của sinh viên trong 1 lớp"
                              type="text"
                              value={values.limitStudent}
                              onChange={handleChange}
                              name="limitStudent"
                              className={`${
                                touched.limitStudent && errors.limitStudent && "error"
                              }`}
                              id="limitStudent"
                            />
                            <ErrorMessage
                              name="limitStudent"
                              component="div"
                              className="lg_error_message"
                            />
                          </MKBox>
                          <MKBox>
                            <FormControl fullWidth>
                              <Select
                                name="teacherId"
                                onChange={handleChange}
                                className={`${touched.className && errors.className && "error"}`}
                                sx={{ padding: "0.75rem !important" }}
                                value={values.teacherId || " "}
                              >
                                <MenuItem value={" "}>Chọn giáo viên cho lớp học</MenuItem>
                                {teachers?.map((s) => (
                                  <MenuItem key={s._id} value={s._id}>
                                    {s.username}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <ErrorMessage
                              name="teacherId"
                              component="div"
                              className="lg_error_message"
                            />
                          </MKBox>
                        </>
                      ) : (
                        <MKBox>
                          <Field
                            fullWidth
                            component={MKInput}
                            label="Tải tệp của bạn"
                            type="file"
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            name="file"
                            className={`${touched.file && errors.file && "error"}`}
                            accept=".xls, .xlsx"
                            id="file"
                            onChange={(event) => {
                              handleChange(event);
                              readeFile(event, setFileValue);
                            }}
                          />
                          <ErrorMessage name="file" component="div" className="lg_error_message" />
                        </MKBox>
                      )}
                      <MKButton
                        type="submit"
                        sx={{
                          background: "#1A73E8",
                          marginTop: "16px",
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
                        Tạo
                      </MKButton>
                    </Form>
                  )}
                </Formik>
              </MKBox>
            </MKBox>
          </Card>
        </Grid>
      </Slide>
    </Modal>
  );
}

export default AddClassList;

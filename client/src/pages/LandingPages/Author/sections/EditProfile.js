import {
  Card,
  Container,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slide,
} from "@mui/material";
import { setActivePopup } from "app/slices/activeSlice";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import * as Yup from "yup";
import MKTypography from "components/MKTypography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import MKInput from "components/MKInput";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setMentorCategories } from "app/slices/categorySlice";
import { setUserLogin } from "app/slices/userSlice";
import getDate from "utilities/getDate";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { userLogin } = useSelector((state) => state.user);
  const { active_popup } = useSelector((state) => state.active);
  const { data: categories } = useSelector((state) => state.category.categories);
  const { data: mentorCategories } = useSelector((state) => state.category.mentorCategories);
  const { _id: uId, username, gender, Dob, phoneNumber, menteeCount, degree, role } = userLogin;
  const [formvalues, setFormValues] = useState({
    username: username || "",
    gender: gender || "",
    Dob: Dob || "",
    phoneNumber: phoneNumber || "",
    menteeCount: menteeCount || 0,
    degree: degree || "",
    ...userLogin,
  });
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const jwt = localStorage.getItem("jwt");
  useEffect(() => {
    setFormValues({ ...userLogin });
  }, [userLogin]);
  const handleSubmit = (values) => {
    const { username, gender, Dob, phoneNumber, menteeCount, degree } = values;
    axios
      .patch(
        `${BASE_URL}/user/profile/update`,
        { username, gender, Dob: new Date(Dob), phoneNumber, menteeCount, degree },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("jwt", res.data);
        axios
          .get(BASE_URL + "/user/profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((res) => {
            isActivePopup();
            dispatch(setUserLogin(res.data));
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const validateSchema = Yup.object().shape({
    username: Yup.string().required("Vui lòng nhập họ và tên."),
    menteeCount: Yup.number("Vui lòng nhập số").min(1).max(5).required("Vui lòng nhập số lượng"),
    degree: Yup.string(),
    phoneNumber: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .length(10, "Số điện thoại phải có chiều dài bằng 10"),
    Dob: Yup.date(),
    gender: Yup.bool(),
  });
  const getAllMentorCategory = (id) => {
    axios
      .get(BASE_URL + "/mentor_category/" + id, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => dispatch(setMentorCategories(res.data)))
      .catch((err) => {
        console.log(err);
      });
  };
  const result = mentorCategories
    ? mentorCategories.reduce((accumulator, mc) => {
        const categoryName = categories.find((cat) => cat._id === mc.categoryId)?.name;
        if (categoryName) accumulator.push(categoryName);
        return accumulator;
      }, [])
    : [];

  return (
    <Modal
      open={active_popup}
      onClose={() => isActivePopup()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup} timeout={500}>
        <Container>
          <Grid position="relative" item xs={12} md={6}>
            <Card id={"edit-profile"}>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-1}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKBox position="relative">
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Chỉnh sửa thông tin cá nhân
                  </MKTypography>
                  <MKBox
                    onClick={isActivePopup}
                    position="absolute"
                    right={0}
                    fontSize={24}
                    top="50%"
                    sx={{
                      transform: "translateY(-50%)",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        color: "#FFF",
                      },
                      lineHeight: 1,
                      padding: "5px 5px 2px",
                      cursor: "pointer",
                    }}
                  >
                    <Icon>clear</Icon>
                  </MKBox>
                </MKBox>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox mb={2}>
                  <Formik
                    validationSchema={validateSchema}
                    initialValues={formvalues}
                    onSubmit={(values) => {
                      handleSubmit(values);
                    }}
                  >
                    {({ values, handleChange, handleBlur }) => (
                      <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <MKBox>
                          <Field
                            name="username"
                            id="username"
                            value={values.username}
                            component={MKInput}
                            label="Full Name"
                            placeholder="eg. Thomas Shelby"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="lg_error_message"
                          />
                        </MKBox>
                        <MKBox>
                          <Field
                            name="email"
                            id="email"
                            disabled
                            value={values ? values.email : ""}
                            component={MKInput}
                            label="Email"
                            fullWidth
                            placeholder="eg. Thomas Shelby"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                          />
                          <ErrorMessage name="email" component="div" className="lg_error_message" />
                        </MKBox>
                        <MKBox>
                          <Field
                            name="phoneNumber"
                            id="phoneNumber"
                            value={values ? values.phoneNumber : ""}
                            component={MKInput}
                            label="Số Điện Thoại"
                            fullWidth
                            placeholder="eg. Thomas Shelby"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="lg_error_message"
                          />
                        </MKBox>
                        <MKBox sx={{ display: "flex", flexDirection: "row", gap: "1.5rem" }}>
                          <MKBox sx={{ flex: 1 }} xs={4}>
                            <FormControl fullWidth>
                              <InputLabel id="select-gender-label">Giới tính</InputLabel>
                              <Select
                                labelId="select-gender-label"
                                id="select-gender"
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Giới tính"
                              >
                                <MenuItem value={""}>
                                  <em>none</em>
                                </MenuItem>
                                <MenuItem value={true}>Nam</MenuItem>
                                <MenuItem value={false}>Nữ</MenuItem>
                              </Select>
                            </FormControl>
                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="lg_error_message"
                            />
                          </MKBox>
                          <MKBox sx={{ flex: 1 }}>
                            <Field
                              name="Dob"
                              id="Dob"
                              value={values.Dob ? getDate(values.Dob) : ""}
                              component={MKInput}
                              label="Ngày sinh"
                              type="date"
                              placeholder="eg. Thomas Shelby"
                              fullWidth
                              onChange={handleChange}
                              onBlur={handleBlur}
                              InputLabelProps={{ shrink: true }}
                            />
                            <ErrorMessage name="Dob" component="div" className="lg_error_message" />
                          </MKBox>
                          {role && role === 3 && (
                            <MKBox sx={{ flex: 1 }}>
                              <Field
                                name="menteeCount"
                                id="menteeCount"
                                value={values.menteeCount}
                                component={MKInput}
                                label="Gới hạn nhóm hướng dẫn"
                                placeholder="0"
                                onChange={handleChange}
                                fullWidth
                                onBlur={handleBlur}
                                InputLabelProps={{ shrink: true }}
                              />
                              <ErrorMessage
                                name="menteeCount"
                                component="div"
                                className="lg_error_message"
                              />
                            </MKBox>
                          )}
                        </MKBox>
                        {role && role === 3 && (
                          <FormControl>
                            <InputLabel id="select-gender-label">
                              Chọn thể loại hướng dẫn{" "}
                              <MKTypography as={"span"} color={"error"}>
                                (Tối đa 3)
                              </MKTypography>
                            </InputLabel>
                            <Select
                              onChange={(event) => {
                                const catId = event.target.value;
                                if (mentorCategories.length <= 2 && catId.length > 0) {
                                  const selectedCategory = mentorCategories.some(
                                    (d) => d.categoryId === catId
                                  );
                                  if (!selectedCategory && uId) {
                                    axios
                                      .post(
                                        `${BASE_URL}/mentor_category/add_new`,
                                        {
                                          categoryId: catId,
                                          userId: uId,
                                        },
                                        {
                                          headers: {
                                            "Content-Type": "application/json",
                                            authorization: `Bearer ${jwt}`,
                                          },
                                        }
                                      )
                                      .then(() => {
                                        getAllMentorCategory(uId);
                                      })
                                      .catch((err) => {
                                        console.log(err.message);
                                      });
                                  }
                                }
                                handleChange(event);
                              }}
                              onBlur={handleBlur}
                              labelId="select-category-label"
                              id="select-category"
                              name="category"
                              disabled={mentorCategories.length >= 3}
                              value={" "}
                              fullWidth
                              label="Chọn thể loại hướng dẫn(Tối đa 3)"
                            >
                              <MenuItem value=" ">
                                <em>
                                  {result.length > 0 ? result.join(", ") : "Hãy chọn thể loại"}
                                </em>
                              </MenuItem>
                              {categories
                                ? categories.map(
                                    (d) =>
                                      !mentorCategories.some((mc) => mc.categoryId === d._id) && (
                                        <MenuItem key={d._id} value={d._id}>
                                          {d.name}
                                        </MenuItem>
                                      )
                                  )
                                : ""}
                            </Select>
                            <MKBox
                              display={"flex"}
                              flexDirection={"row"}
                              flexWrap={"wrap"}
                              gap={"0.5rem"}
                              py={1}
                            >
                              {mentorCategories
                                ? mentorCategories.map((mc) => (
                                    <MKBox
                                      display={"flex"}
                                      flexDirection={"row"}
                                      justifyContent={"space-around"}
                                      gap={"0.5rem"}
                                      sx={{
                                        fontSize: "0.825rem",
                                        padding: "8px 12px",
                                        border: "1px solid #ccc",
                                        borderRadius: "30px",
                                        lineHeight: 1,
                                      }}
                                      key={mc._id}
                                    >
                                      <MKTypography as={"span"}>
                                        {categories.map((cat) =>
                                          mc.categoryId === cat._id ? cat.name : ""
                                        )}
                                      </MKTypography>
                                      <Icon
                                        onClick={() => {
                                          axios
                                            .delete(
                                              `${BASE_URL}/mentor_category/delete/${mc._id}`,
                                              {
                                                headers: {
                                                  "Content-Type": "application/json",
                                                  authorization: `Bearer ${jwt}`,
                                                },
                                              }
                                            )
                                            .then(() => {
                                              getAllMentorCategory(uId);
                                            })
                                            .catch((err) => {
                                              console.log(err.message);
                                            });
                                        }}
                                        sx={{
                                          height: "100%",
                                          lineHeight: 1,
                                          marginTop: "1px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        clear
                                      </Icon>
                                    </MKBox>
                                  ))
                                : ""}
                            </MKBox>
                          </FormControl>
                        )}
                        <MKBox>
                          <Field
                            component={MKInput}
                            multiline
                            name="degree"
                            id="degree"
                            value={values.degree}
                            onChange={handleChange}
                            fullWidth
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                            label="Mô tả sự nghiệp"
                            rows={2}
                          />
                          <ErrorMessage
                            name="degree"
                            component="div"
                            className="lg_error_message"
                          />
                        </MKBox>
                        <MKButton
                          type="submit"
                          sx={{
                            fontSize: "16px",
                            color: "#FFFFFF",
                            marginTop: "5px",
                          }}
                          variant="gradient"
                          color="info"
                        >
                          Cập nhật
                        </MKButton>
                      </Form>
                    )}
                  </Formik>
                </MKBox>
              </MKBox>
            </Card>
            {/* </MKBox> */}
          </Grid>
        </Container>
      </Slide>
    </Modal>
  );
};

export default EditProfile;

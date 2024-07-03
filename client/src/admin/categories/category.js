import { Card, FormControl, InputLabel, MenuItem, Modal, Select, Slide } from "@mui/material";
import { setActivePopup } from "app/slices/activeSlice";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import * as Yup from "yup";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setCategories } from "app/slices/categorySlice";

const Category = () => {
  const dispatch = useDispatch();
  const { active_popup } = useSelector((state) => state.active);
  const { category } = useSelector((state) => state.category);
  const { search, pageNo, limit } = useSelector((state) => state.utilities);
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const getCategoriesInfo = () =>
    axios
      .get(`${BASE_URL}/category?skip=${skip}&search=${search}`)
      .then((res) => dispatch(setCategories(res.data)))
      .catch((e) => console.log(e));
  const handleSubmit = (values) => {
    if (active_popup.type === "update")
      axios
        .patch(`${BASE_URL}/category/${category._id}`, values, config)
        .then(() => getCategoriesInfo())
        .catch((err) => console.log(err));
    else
      axios
        .post(`${BASE_URL}/category`, values, config)
        .then(() => getCategoriesInfo())
        .catch((err) => console.log(err));
    isActivePopup({ type: "close", payload: "" });
  };
  const deleteSemester = () => {
    axios
      .delete(`${BASE_URL}/category/${category._id}`, config)
      .then(() => getCategoriesInfo())
      .catch((err) => console.log(err));
    isActivePopup({ type: "close", payload: "" });
  };
  const initialValues = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên của kỳ học"),
  });
  return (
    <Modal
      open={active_popup.payload === "category"}
      onClose={() => isActivePopup({ type: "close", payload: "" })}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup.payload === "category"} timeout={500}>
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
              Lĩnh Vực
            </MKTypography>
          </MKBox>
          <MKBox py={2} px={1}>
            <Formik
              initialValues={category || { name: "" }}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
              validationSchema={initialValues}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <MKBox>
                    <Field
                      fullWidth
                      component={MKInput}
                      value={values.name}
                      label="Nhập tên thể loại"
                      placeholder="Công nghệ thông tin"
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
                      <InputLabel id="select-category-label">Trạng thái thể loại</InputLabel>
                      <Select
                        labelId="select-category-label"
                        id="select-category-action"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        label="Trạng thái thể loại"
                      >
                        <MenuItem value={"Active"}>Hoạt động</MenuItem>
                        <MenuItem value={"InActive"}>Không hoạt động</MenuItem>
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
                        onClick={() => deleteSemester()}
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
              )}
            </Formik>
          </MKBox>
        </Card>
      </Slide>
    </Modal>
  );
};

export default Category;

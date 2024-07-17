import {
  Card,
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
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setProjectCategories } from "app/slices/projectSlice";
import { setGroup } from "app/slices/groupSlice";

const UpdateProject = () => {
  const dispatch = useDispatch();
  const { userLogin } = useSelector((state) => state.user);
  const { active_popup } = useSelector((state) => state.active);
  const { group } = useSelector((state) => state.group);
  const { data: categories } = useSelector((state) => state.category.categories);
  const { projectCategories } = useSelector((state) => state.project);
  const { _id: uId } = userLogin;
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    if (group?.project?.name) getAllProjectCategory();
  }, [userLogin, group, dispatch]);
  const handleSubmit = (values) => {
    if (group?.project?.name)
      axios
        .patch(
          `${BASE_URL}/project/${group?.project?._id}/update_project`,
          {
            name: values.name,
            description: values.description,
          },
          config
        )
        .then(() =>
          axios
            .get(`${BASE_URL}/group/${userLogin?.groupId?.[0]?._id}`, config)
            .then((res) => dispatch(setGroup(res.data[0])))
            .catch((err) => console.log(err))
        );
    isActivePopup();
  };

  const validateSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập họ và tên."),
    description: Yup.string(),
  });
  const getAllProjectCategory = () => {
    axios
      .get(BASE_URL + "/project_category/" + group?.project?._id, config)
      .then((res) => dispatch(setProjectCategories(res.data)))
      .catch((err) => console.log(err));
  };
  const result = projectCategories?.reduce((accumulator, mc) => {
    const categoryName = categories.find((cat) => cat._id === mc.categoryId)?.name;
    if (categoryName) accumulator.push(categoryName);
    return accumulator;
  }, []);

  return (
    <Modal
      open={active_popup}
      onClose={() => isActivePopup()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup} timeout={500}>
        <Grid minWidth={"50%"} position="relative" item xs={12} md={6}>
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
              <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                Cập nhật thông tin dự án
              </MKTypography>
            </MKBox>
            <MKBox pt={4} pb={3} px={3}>
              <MKBox mb={2}>
                <Formik
                  validationSchema={validateSchema}
                  initialValues={group?.project || {}}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  {({ values, handleChange, handleBlur }) => (
                    <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <MKBox>
                        <Field
                          name="name"
                          id="name"
                          value={values.name}
                          component={MKInput}
                          label="Tên dự án"
                          placeholder="eg. Thomas Shelby"
                          fullWidth
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                        />
                        <ErrorMessage name="name" component="div" className="lg_error_message" />
                      </MKBox>
                      <MKBox>
                        <Field
                          name="description"
                          id="description"
                          value={values.description}
                          component={MKInput}
                          label="Mô tả dự án"
                          multiline
                          rows={2}
                          fullWidth
                          placeholder="eg. Thomas Shelby"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="lg_error_message"
                        />
                      </MKBox>
                      <FormControl>
                        <InputLabel>
                          Chọn thể loại được hướng dẫn
                          <MKTypography as={"span"} color={"error"}>
                            (Tối đa 3)
                          </MKTypography>
                        </InputLabel>
                        <Select
                          onChange={(event) => {
                            const catId = event.target.value;
                            if (catId.length > 0) {
                              const selectedCategory = projectCategories?.some(
                                (d) => d.categoryId === catId
                              );

                              if (!selectedCategory && uId) {
                                axios
                                  .post(
                                    `${BASE_URL}/project_category/add_new`,
                                    {
                                      categoryId: catId,
                                      projectId: group?.project?._id,
                                    },
                                    config
                                  )
                                  .then(() => getAllProjectCategory())
                                  .catch((err) => console.log(err.message));
                              }
                            }
                            handleChange(event);
                          }}
                          onBlur={handleBlur}
                          labelId="select-category-label"
                          id="select-category"
                          name="category"
                          disabled={projectCategories.length >= 3}
                          value={" "}
                          fullWidth
                          label="Chọn thể loại hướng dẫn(Tối đa 3)"
                        >
                          <MenuItem value=" ">
                            <em>{result.length === 0 ? "Chưa chọn" : result.join(", ")}</em>
                          </MenuItem>
                          {categories?.map(
                            (d) =>
                              !projectCategories?.some((mc) => mc.categoryId === d._id) && (
                                <MenuItem key={d._id} value={d._id}>
                                  {d.name}
                                </MenuItem>
                              )
                          )}
                        </Select>
                        <MKBox
                          display={"flex"}
                          flexDirection={"row"}
                          flexWrap={"wrap"}
                          gap={"0.5rem"}
                          py={1}
                        >
                          {projectCategories?.map((pc) => (
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
                              key={pc._id}
                            >
                              <MKTypography as={"span"}>
                                {categories.map((cat) =>
                                  pc.categoryId === cat._id ? cat.name : ""
                                )}
                              </MKTypography>
                              <Icon
                                onClick={() => {
                                  axios
                                    .delete(`${BASE_URL}/project_category/${pc._id}`, config)
                                    .then(() => getAllProjectCategory())
                                    .catch((err) => console.log(err.message));
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
                          ))}
                        </MKBox>
                      </FormControl>
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
        </Grid>
      </Slide>
    </Modal>
  );
};

export default UpdateProject;

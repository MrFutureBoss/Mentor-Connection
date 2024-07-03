import { Card, Grid, Modal, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setActivePopupCreateGroupFromExcel } from "app/slices/activeSlice";
import * as Yup from "yup";
import MKInput from "components/MKInput";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { checkError } from "utilities/auth";
import readeFile from "utilities/readeFile";
import getParams from "utilities/getParams";
import { setUsers } from "app/slices/userSlice";
import { setGroups } from "app/slices/groupSlice";

const CreateGroupFromExcelPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();
  const classId = getParams(3, url.pathname);
  const [fileValue, setFileValue] = useState();
  const formValues = {
    file: "",
  };
  const { active_create_group_excel } = useSelector((state) => state.active);
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const isActivePopup = () => {
    dispatch(setActivePopupCreateGroupFromExcel(!active_create_group_excel));
  };
  const initialValues = Yup.object().shape({
    file: Yup.mixed().required("Vui lòng chọn một file"),
  });
  const getInfoInClass = () => {
    axios
      .get(`${BASE_URL}/class/${classId}/students`, config)
      .then((res) => dispatch(setUsers({ data: res.data })))
      .catch((err) => console.log(err));
    axios
      .get(`${BASE_URL}/group/${classId}/groups`, config)
      .then((res) => dispatch(setGroups(res.data)))
      .catch((err) => console.log(err));
  };
  const handleSubmit = () => {
    axios
      .post(
        `${BASE_URL}/group/${classId}/class/create_groups_from_file`,
        { listStudent: fileValue },
        config
      )
      .then(() => {
        isActivePopup();
        getInfoInClass();
      })
      .catch((err) => checkError(err, navigate));
  };

  return (
    <Modal
      open={active_create_group_excel}
      onClose={isActivePopup}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_create_group_excel} timeout={500}>
        <Grid width={500} position="relative" item xs={12} md={6}>
          <Card>
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
                Tạo Nhóm Bằng Excel
              </MKTypography>
            </MKBox>
            <MKBox px={"1rem"} py="1rem">
              <Formik
                initialValues={formValues}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={initialValues}
              >
                {({ errors, touched, handleChange }) => (
                  <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <MKBox>
                      <Field
                        component={MKInput}
                        InputLabelProps={{ shrink: true }}
                        type="file"
                        name="file"
                        label="Tải tệp của bạn"
                        className={`${touched.file && errors.file && "error"}`}
                        accept=".xls, .xlsx"
                        id="file"
                        fullWidth
                        onChange={(event) => {
                          handleChange(event);
                          readeFile(event, setFileValue);
                        }}
                      />
                      <ErrorMessage name="file" component="div" className="lg_error_message" />
                    </MKBox>
                    <MKButton type="submit" color="info" sx={{ width: "100%" }}>
                      Tạo
                    </MKButton>
                  </Form>
                )}
              </Formik>
            </MKBox>
          </Card>
        </Grid>
      </Slide>
    </Modal>
  );
};

export default CreateGroupFromExcelPopup;

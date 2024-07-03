// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import * as XLSX from "xlsx/xlsx.mjs";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "utilities/initialValue";
import axios from "axios";
import { useState } from "react";
import { Modal, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MKButton from "components/MKButton";
import { setUsers } from "app/slices/userSlice";
import { setActivePopup } from "app/slices/activeSlice";
import MKInput from "components/MKInput";

function AddListAccount() {
  const [fileName, setFileName] = useState();
  const dispatch = useDispatch();
  const formValues = {
    file: "",
  };
  const initialValues = Yup.object().shape({
    file: Yup.mixed().required("Vui lòng chọn một file"),
  });
  const { active_popup } = useSelector((state) => state.active);
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const { filterRole, searchValue, sort, pageNo } = useSelector((state) => state.user);
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const limitUser = 10;
  const handleSubmit = () => {
    axios
      .post(`${BASE_URL}/admins/insert-list-users`, { file: fileName }, config)
      .then(() => {
        axios
          .get(
            `${BASE_URL}/admins/users?item=createdAt&order=${sort}&skip=${
              pageNo * limitUser
            }&limit=${limitUser}&role=${filterRole}&search=${searchValue}`
          )
          .then((res) => dispatch(setUsers(res.data)))
          .catch((err) => console.log(err));
        isActivePopup();
      })
      .catch((error) => console.log(error));
  };
  return (
    <Modal
      open={active_popup}
      onClose={() => isActivePopup()}
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
    >
      <Slide direction="down" in={active_popup} timeout={500}>
        <Card id={"add_list_user"} className="pop-up" position="absolute" p={0}>
          <MKBox
            width={"400px"}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            {/* <MKBox position="relative"> */}
            <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Tạo danh sách người dùng
            </MKTypography>
          </MKBox>
          <MKBox pt={4} pb={3} px={3}>
            <MKBox mb={2}>
              <Formik
                initialValues={formValues}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={initialValues}
              >
                {({ errors, touched, handleChange }) => (
                  <Form>
                    <MKBox>
                      <Field
                        component={MKInput}
                        InputLabelProps={{ shrink: true }}
                        type="file"
                        name="file"
                        label="Tải tệp của bạn"
                        className={`${touched.file && errors.file ? "error" : ""}`}
                        style={{ background: "#F4F4F4" }}
                        accept=".xls, .xlsx"
                        id="file"
                        fullWidth
                        onChange={(event) => {
                          handleChange(event);
                          const file = event.currentTarget.files[0];
                          const reader = new FileReader();

                          reader.onload = (e) => {
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: "array" });
                            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                            const excelData = XLSX.utils.sheet_to_json(worksheet);
                            setFileName(excelData);
                          };
                          reader.readAsArrayBuffer(new Blob([file]));
                        }}
                      />
                      <ErrorMessage name="file" component="div" className="lg_error_message" />
                    </MKBox>
                    <MKButton
                      type="submit"
                      color="info"
                      sx={{
                        width: "100%",
                        fontSize: "16px",
                        color: "#FFFFFF",
                        marginTop: "16px",
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
      </Slide>
    </Modal>
  );
}

export default AddListAccount;

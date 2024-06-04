import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Card, Grid, Modal, Slide } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { setActivePopupChangePassword } from "app/slices/activeSlice";
import { BASE_URL } from "utilities/initialValue";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const isActivePopup = () => dispatch(setActivePopupChangePassword(false));
  const jwt = localStorage.getItem("jwt");
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng nhập lại mật khẩu mới để xác nhận"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    console.log("Form submitted", values);
    const { oldPassword, newPassword } = values;
    setSubmitting(true);
    try {
      await axios.post(
        `${BASE_URL}/user/change_password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      toast.success("Đã cập nhật mật khẩu mới thành công!");
      isActivePopup();
      resetForm();
    } catch (error) {
      console.log(error.response || error);
      toast.error("Cập nhật mật khẩu thất bại: " + (error.response?.data.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
      open={true}
      onClose={isActivePopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Slide direction="down" in={true} timeout={500}>
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
                Đổi Mật Khẩu
              </MKTypography>
            </MKBox>
            <MKBox pt={4} pb={3} px={3}>
              <Formik
                initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, handleChange, handleBlur }) => (
                  <Form>
                    <MKBox mb={2}>
                      <Field
                        name="oldPassword"
                        id="oldPassword"
                        value={values.oldPassword}
                        component={MKInput}
                        type="password"
                        label="Mật khẩu cũ"
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                      />
                      <ErrorMessage
                        name="oldPassword"
                        component="div"
                        className="lg_error_message"
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <Field
                        id="newPassword"
                        name="newPassword"
                        value={values.newPassword}
                        component={MKInput}
                        type="password"
                        label="Mật khẩu mới"
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="lg_error_message"
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        component={MKInput}
                        type="password"
                        label="Xác nhận mật khẩu mới"
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="lg_error_message"
                      />
                    </MKBox>
                    <MKBox textAlign="center">
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
                        Cập nhật mật khẩu
                      </MKButton>
                    </MKBox>
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

export default ChangePassword;

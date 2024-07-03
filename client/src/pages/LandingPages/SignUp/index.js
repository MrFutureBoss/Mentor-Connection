/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React example components
import DefaultNavbar from "Navbars/DefaultNavbar";
import SimpleFooter from "examples/Footers/SimpleFooter";

// Material Kit 2 React page layout routes
import routes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { BASE_URL } from "utilities/initialValue";
import { useDispatch, useSelector } from "react-redux";
import { setFetchError } from "app/slices/errorSlice";
import { setUserRegister } from "app/slices/userSlice";
import { headers } from "utilities/initialValue";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import "./style.css";
import axios from "axios";

const initFormValues = {
  username: "",
  email: "",
  password: "",
  cfPassword: "",
  role: "",
  agreeConditions: true,
};

function SignUpBasic() {
  const dispatch = useDispatch();
  const fetchError = useSelector((state) => state.error.fetchError);
  const navigation = useNavigate();
  const handleSubmit = async (values) => {
    const { username, password, role, email } = values;
    const data = { username, password, role: Number(role), email };
    await axios
      .post(BASE_URL + "/user/register", data, headers)
      .then((res) => {
        dispatch(setUserRegister({ username, password, email }));
        navigation("/");
        dispatch(setFetchError(false));
        return res;
      })
      .catch(() => {
        dispatch(setFetchError(true));
      });
  };
  useEffect(() => {
    dispatch(setFetchError(false));
  }, [dispatch]);
  const SignupSchema = Yup.object().shape({
    username: Yup.string().required("Vui lòng nhập họ và tên."),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu.")
      .min(6, "Chiều dài mật khẩu lớn hơn hoặc bằng 6 ký tự"),
    email: Yup.string()
      .required("Vui lòng nhập mail.")
      .matches(/@fpt\.edu\.vn$/, "Email phải có đuôi @fpt.edu.vn"),
    cfPassword: Yup.string()
      .required("Vui lòng nhập lại mật khẩu.")
      .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp."),
    role: Yup.string().required("Vui lòng chọn vai trò của bạn."),
    agreeConditions: Yup.boolean().oneOf(
      [true],
      "Bạn cần đồng ý với các điều khoản của chúng tôi!"
    ),
  });
  return (
    <>
      <DefaultNavbar routes={routes} transparent light />
      <MKBox
        width="100%"
        minHeight="100%"
        overflow="auto"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
          <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
            <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
              <Card>
                <MKBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={2}
                  textAlign="center"
                >
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Đăng ký
                  </MKTypography>
                </MKBox>
                {fetchError ? (
                  <div className="error-message-response">
                    <svg
                      style={{ marginRight: 8 }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="20"
                      fill="currentColor"
                      className="bi bi-exclamation-circle"
                      viewBox="-1 -1 18 18"
                    >
                      <path
                        strokeWidth={0.4}
                        stroke={`#d70707`}
                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                      />
                      <path
                        strokeWidth={0.4}
                        stroke={`#d70707`}
                        d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"
                      />
                    </svg>
                    <div>Email đã tồn tại trong hệ thống hãy thử lại!</div>
                  </div>
                ) : (
                  ""
                )}
                <MKBox
                  className="rg_form-register"
                  pt={2}
                  pb={3}
                  px={3}
                  maxHeight="500px"
                  overflow="auto"
                >
                  <Formik
                    initialValues={initFormValues}
                    onSubmit={(values) => handleSubmit(values)}
                    validationSchema={SignupSchema}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="rg_form-group">
                          <label
                            style={{ marginBottom: "4px" }}
                            className="rg_label block"
                            htmlFor="username"
                          >
                            Họ tên <span className="required">*</span>
                          </label>
                          <Field
                            type="text"
                            name="username"
                            placeholder="Abc"
                            id="username"
                            className={`${
                              touched.username && errors.username ? "error" : ""
                            } rg_form-control`}
                            style={{ background: "#F4F4F4" }}
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="rg_error_message"
                          />
                        </div>
                        <div className="rg_form-group">
                          <label
                            style={{ marginBottom: "4px" }}
                            className="rg_label block"
                            htmlFor="email"
                          >
                            Email <span className="required">*</span>
                          </label>
                          <Field
                            type="email"
                            name="email"
                            placeholder="abc@gmail.com"
                            className={`${
                              touched.email && errors.email ? "error" : ""
                            } rg_form-control`}
                            style={{ background: "#F4F4F4" }}
                            id="email"
                          />
                          <ErrorMessage name="email" component="div" className="rg_error_message" />
                        </div>
                        <div className="rg_form-group">
                          <label
                            style={{ marginBottom: "4px" }}
                            className="rg_label block"
                            htmlFor="password"
                          >
                            Mật khẩu <span className="required">*</span>
                          </label>
                          <div className="relative">
                            <Field
                              type="password"
                              name="password"
                              placeholder="12345678"
                              className={`${
                                touched.password && errors.password ? "error" : ""
                              } rg_form-control`}
                              id="password"
                              style={{ background: "#F4F4F4" }}
                            />
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="rg_error_message"
                          />
                        </div>
                        <div className="rg_form-group">
                          <label
                            style={{ marginBottom: "4px" }}
                            className="rg_label block"
                            htmlFor="cfPassword"
                          >
                            Xác nhận mật khẩu <span className="required">*</span>
                          </label>
                          <div className="relative">
                            <Field
                              type="password"
                              name="cfPassword"
                              placeholder="12345678"
                              className={`${
                                touched.cfPassword && errors.cfPassword ? "error" : ""
                              } rg_form-control`}
                              id="cfPassword"
                              style={{ background: "#F4F4F4" }}
                            />
                          </div>
                          <ErrorMessage
                            name="cfPassword"
                            component="div"
                            className="rg_error_message"
                          />
                        </div>
                        <div className="flx flx-column">
                          <div className="rg_seting-role">Bạn là ai?</div>
                          <div className="rg_form-group flx flx-row flx-ct-a">
                            <div>
                              <Field name="role" type="radio" id="role_1" value="2" />
                              <label className="rg_label" htmlFor="role_1">
                                Giảng viên
                              </label>
                            </div>
                            <div>
                              <Field name="role" type="radio" id="role_2" value="3" />
                              <label className="rg_label" htmlFor="role_2">
                                Người hướng dẫn
                              </label>
                            </div>
                            <div>
                              <Field name="role" type="radio" id="role_3" value="4" />
                              <label className="rg_label" htmlFor="role_3">
                                Sinh viên
                              </label>
                            </div>
                          </div>
                          <ErrorMessage name="role" component="div" className="rg_error_message" />
                        </div>
                        <div className="rg_form-group" style={{ marginBottom: "24px" }}>
                          <Field
                            type="checkbox"
                            name="agreeConditions"
                            id="agreeConditions"
                            className={`${
                              touched.agreeConditions && errors.agreeConditions ? "error" : ""
                            }`}
                            style={{ background: "#F4F4F4" }}
                          />
                          <label
                            style={{ marginBottom: "4px" }}
                            className="rg_label"
                            htmlFor="agreeConditions"
                          >
                            Tôi đã đọc và đồng ý với <Link to="#">Điều khoản dịch vụ</Link> và{" "}
                            <Link to="#">Chính sách bảo mật</Link>{" "}
                          </label>
                          <ErrorMessage
                            name="agreeConditions"
                            component="div"
                            className="rg_error_message"
                          />
                        </div>
                        <button type="submit" className="btn-sbm pointer">
                          Tạo tài khoản
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div>
                    <div style={{ position: "relative", textAlign: "center", margin: "12px 0" }}>
                      <span
                        style={{
                          position: "relative",
                          background: "#FFF",
                          padding: "0 4px",
                          zIndex: 2,
                        }}
                      >
                        Hoặc
                      </span>
                      <div
                        style={{
                          border: "1px solid #E0E0E0",
                          position: "absolute",
                          width: "100%",
                          top: "50%",
                          transform: "translateY(50%)",
                          zIndex: 1,
                        }}
                      ></div>
                    </div>
                    <div
                      style={{ textAlign: "center", margin: "12px 0 24px", fontSize: ".825rem" }}
                    >
                      Bạn đã có tài khoản?{" "}
                      <Link
                        style={{ fontWeight: 600, color: "#000" }}
                        to="/pages/authentication/sign-in"
                      >
                        Đăng nhập tại đây
                      </Link>
                    </div>
                  </div>
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
      <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
        <SimpleFooter light />
      </MKBox>
    </>
  );
}

export default SignUpBasic;

import { useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// // @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React example components
import SimpleFooter from "examples/Footers/SimpleFooter";

// Material Kit 2 React page layout routes
import routes from "routes";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { setFetchError } from "app/slices/errorSlice";
import { BASE_URL } from "utilities/initialValue";
import axios from "axios";
import MKButton from "components/MKButton";
import DefaultNavbar from "Navbars/DefaultNavbar";
import MKInput from "components/MKInput";

function SignInBasic() {
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.user.userRegister);
  const formValues = {
    email: userRegister.email || "admin_1@fpt.edu.vn",
    password: userRegister.password || "Aa@123",
  };
  const fetchError = useSelector((state) => state.error.fetchError);
  const navigation = useNavigate();
  const handleSubmit = async (values) => {
    if (!values) return;
    const formData = { ...values };
    axios
      .post(BASE_URL + "/user/login", formData)
      .then((res) => {
        const result = res.data;
        if (result) {
          localStorage.setItem("jwt", result);
          dispatch(setFetchError(false));
          navigation("/");
        } else return res;
      })
      .catch(() => {
        dispatch(setFetchError(true));
      });
  };
  useEffect(() => {
    dispatch(setFetchError(false));
  }, [dispatch]);
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .required("Vui lòng nhập email!")
      .matches(/@fpt\.edu\.vn$/, "Email phải có đuôi @fpt.edu.vn"),
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
                  mb={1}
                  textAlign="center"
                >
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Đăng nhập
                  </MKTypography>
                </MKBox>
                {fetchError && (
                  <MKBox className="error-message-response">
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
                    <div>Email và mật khẩu không chính xác</div>
                  </MKBox>
                )}
                <MKBox pt={4} pb={3} px={3}>
                  <Formik
                    initialValues={formValues}
                    onSubmit={(values) => handleSubmit(values)}
                    validationSchema={SignupSchema}
                  >
                    {({ values, errors, touched, handleChange }) => (
                      <Form>
                        <MKBox className="lg_form-group" mb="1rem">
                          <Field
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="Email"
                            variant="standard"
                            component={MKInput}
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="abc@gmail.com"
                            className={`${
                              touched.email && errors.email && "error"
                            } lg_form-control`}
                            id="email"
                          />
                          <ErrorMessage name="email" component="div" className="lg_error_message" />
                        </MKBox>
                        <MKBox className="lg_form-group">
                          <MKBox className="relative">
                            <Field
                              component={MKInput}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              label="Mật khẩu"
                              variant="standard"
                              type="password"
                              onChange={handleChange}
                              name="password"
                              value={values.password}
                              placeholder="12345678"
                              className={`${
                                touched.password && errors.password && "error"
                              } rg_form-control`}
                              id="password"
                            />
                          </MKBox>
                        </MKBox>
                        <MKBox
                          className="flx forgot-password-title pointer"
                          style={{ justifyContent: "end" }}
                        >
                          <Link to={"/forgot_password"}>Quên mật khẩu</Link>
                        </MKBox>
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
                          Đăng nhập
                        </MKButton>
                      </Form>
                    )}
                  </Formik>
                  {/* <MKBox>
                    <MKBox style={{ position: "relative", textAlign: "center", margin: "12px 0" }}>
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
                      <MKBox
                        style={{
                          border: "1px solid #E0E0E0",
                          position: "absolute",
                          width: "100%",
                          top: "50%",
                          transform: "translateY(50%)",
                          zIndex: 1,
                        }}
                      ></MKBox>
                    </MKBox>
                    <MKBox
                      style={{ textAlign: "center", margin: "12px 0 24px", fontSize: ".825rem" }}
                    >
                      Bạn chưa có tài khoản?{" "}
                      <Link style={{ fontWeight: 600, color: "#000" }} to="/register">
                        Đăng ký tại đây
                      </Link>
                    </MKBox>
                  </MKBox> */}
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </MKBox>
        <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
          <SimpleFooter light />
        </MKBox>
      </MKBox>
    </>
  );
}

export default SignInBasic;

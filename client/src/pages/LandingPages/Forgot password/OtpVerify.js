/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RecoveryContext } from './RecoveryContext'; 
import { useDispatch, useSelector } from 'react-redux';
import { setActivePopupVerifyOTP } from "app/slices/activeSlice";
import { Modal, Slide, Grid, Card } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

const OtpVerify = () => {
  const { email, otp, setPage } = useContext(RecoveryContext);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const isActivePopup = () => dispatch(setActivePopupVerifyOTP(false));
  const { active_popup_verify_otp } = useSelector((state) => state.active);

  useEffect(() => {
    if (disable) return;

    axios.post("http://localhost:5000/send_recovery_email", {
      OTP: otp,
      recipient_email: email,
    })
      .then(() => {
        setDisable(true);
        alert("A new OTP has successfully been sent to your email.");
        setTimer(60);
      })
      .catch(console.log);
  }, [disable, email, otp]);

  const verifyOTP = () => {
    if (parseInt(OTPinput.join("")) === otp) {
      setPage("reset");
      return;
    }
    alert("The code you have entered is not correct, try again or re-send the link");
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false);
          return 0;
        }
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

  const resendOTP = () => {
    setDisable(true);
  };

  return (
    <Modal
      sx={{ display: "grid", placeItems: "center", overflow: "auto" }}
      open={active_popup_verify_otp}
      onClose={isActivePopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Slide direction="down" in={active_popup_verify_otp} timeout={500}>
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
                Email Verification
              </MKTypography>
            </MKBox>
            <MKBox pt={4} pb={3} px={3}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="font-semibold text-3xl">
                    <p>Email Verification</p>
                  </div>
                  <div className="flex flex-row text-sm font-medium text-gray-400">
                    <p>We have sent a code to your email {email}</p>
                  </div>
                </div>

                <form>
                  <div className="flex flex-col space-y-16">
                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                      {OTPinput.map((value, index) => (
                        <div key={index} className="w-16 h-16">
                          <input
                            maxLength="1"
                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                            type="text"
                            value={value}
                            onChange={(e) => {
                              const newOTPinput = [...OTPinput];
                              newOTPinput[index] = e.target.value;
                              setOTPinput(newOTPinput);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-5">
                      <div>
                        <MKButton
                          type="button"
                          onClick={verifyOTP}
                          sx={{
                            fontSize: "16px",
                            color: "#FFFFFF",
                            marginTop: "5px",
                            backgroundColor: "blue",
                            "&:hover": {
                              backgroundColor: "darkblue",
                            },
                          }}
                          variant="contained"
                        >
                          Verify Account
                        </MKButton>
                      </div>

                      <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                        <p>Did not receive the code?</p>
                        <a
                          className="flex flex-row items-center"
                          style={{
                            color: disable ? "gray" : "blue",
                            cursor: disable ? "not-allowed" : "pointer",
                            textDecoration: disable ? "none" : "underline",
                          }}
                          onClick={disable ? undefined : resendOTP}
                        >
                          {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </MKBox>
          </Card>
        </Grid>
      </Slide>
    </Modal>
  );
};

export default OtpVerify;

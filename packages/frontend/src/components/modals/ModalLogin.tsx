import * as React from "react";
import { useState, FC, ReactElement } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";

import { style } from "./ReusableModal";
import { SignupModal } from "./ModalSignup";
import { IModalLogin } from "./interfaces/IModalLogin";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";
import { PasswordInput } from "../user/_userPassword";
import { ModalForgotPassword } from "./ModalForgotPassword";

export const LoginModal: FC<IModalLogin> = ({
  loginModalOpen = false,
  setLoginModalOpen = () => console.log(),
  isLoading,
  setIsLoading,
  open,
  handleClose,
  handleLogin,
}): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [isCodeReset, setIsCodeReset] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleSignUp = async (
    email: string,
    password: string,
    passwordConfirm: string,
    username: string,
  ) => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/signup",
        "POST",
        {
          email,
          password,
          passwordConfirm,
          name: username,
        },
      );

      if (response && response.status === "success") {
        handleLogin(email, password);
        setIsCodeReset(true);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/forgotPassword",
        "POST",
        {
          email,
        },
      );

      if (response && response.status === "success") {
        toast.success("Check your email for a reset code");
        setIsCodeReset(true);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

    setIsLoading(false);
  };

  const handleGetResetCode = async (email: string, code: number) => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/getCode",
        "POST",
        {
          email,
          code,
        },
      );

      if (response && response.status === "success") {
        setIsCodeReset(false);
        setIsPasswordReset(true);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (
    email: string,
    code: number,
    newPassword: string,
    newPasswordConfirm: string,
  ) => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/resetPassword",
        "PATCH",
        {
          email,
          code,
          newPassword,
          newPasswordConfirm,
        },
      );

      if (response && response.status === "success") {
        toast.success("Password reset successful");
        setForgotPasswordModalOpen(false);
        setIsCodeReset(false);
        setIsPasswordReset(false);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

    setIsLoading(false);
  };

  const submitHandler = () => {
    handleLogin(email, password);
  };

  return (
    <>
      <Modal
        open={open && !signUpModalOpen}
        onClose={() => {
          setSignUpModalOpen(false);
          handleClose();
        }}
        sx={{
          boxShadow: 24,
          backdropFilter: "blur(4px)",
          display: `${
            (isLoading || signUpModalOpen || forgotPasswordModalOpen) && "none"
          }`,
        }}
      >
        <Box
          sx={{
            ...style,
            borderColor: "success.dark",
          }}
        >
          <Typography variant="h6" component="h2">
            Login
          </Typography>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            label="Password"
            size="medium"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={isLoading || !email || !password}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            disabled={isLoading}
            onClick={() => {
              setForgotPasswordModalOpen(!forgotPasswordModalOpen);
            }}
          >
            Forgot Password?
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setSignUpModalOpen(!signUpModalOpen);
            }}
            disabled={isLoading}
          >
            Don`t have an account? Sign Up
          </Button>
        </Box>
      </Modal>

      {forgotPasswordModalOpen && (
        <ModalForgotPassword
          isCodeReset={isCodeReset}
          isLoading={isLoading}
          handleClose={() => {
            setForgotPasswordModalOpen(false);
            setLoginModalOpen(false);
          }}
          open={forgotPasswordModalOpen}
          handleForgotPassword={handleForgotPassword}
          handleResetPassword={handleResetPassword}
          handleGetResetCode={handleGetResetCode}
          isPasswordReset={isPasswordReset}
        />
      )}

      {signUpModalOpen && (
        <SignupModal
          setSignUpModalOpen={setSignUpModalOpen}
          loginModalOpen={loginModalOpen}
          setLoginModalOpen={setLoginModalOpen}
          isLoading={isLoading}
          open={signUpModalOpen}
          handleClose={() => {
            setSignUpModalOpen(false);
            setLoginModalOpen(false);
          }}
          handleSignUp={handleSignUp}
        />
      )}
    </>
  );
};

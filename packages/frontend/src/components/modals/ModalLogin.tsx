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

export const LoginModal: FC<IModalLogin> = ({
  loginModalOpen,
  setLoginModalOpen,
  isLoading,
  setIsLoading,
  open,
  handleClose,
  handleLogin,
}): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

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
            onClick={() => {
              setSignUpModalOpen(!signUpModalOpen);
            }}
            disabled={isLoading}
          >
            Don`t have an account? Sign Up
          </Button>
        </Box>
      </Modal>

      {signUpModalOpen && (
        <SignupModal
          loginModalOpen={loginModalOpen}
          setLoginModalOpen={setLoginModalOpen}
          isLoading={isLoading}
          open={signUpModalOpen}
          handleClose={() => {
            setSignUpModalOpen(false);
          }}
          handleSignUp={handleSignUp}
        />
      )}
    </>
  );
};

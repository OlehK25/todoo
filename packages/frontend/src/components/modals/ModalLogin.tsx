import * as React from "react";
import { useState, FC, ReactElement } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import { style } from "./ReusableModal";
import { SignupModal } from "./ModalSignup";
import { IModalLogin } from "./interfaces/IModalLogin";
import { sendApiRequest } from "../../helpers/sendApiRequest";

export const LoginModal: FC<IModalLogin> = ({
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
      const response = await sendApiRequest<{
        status: string;
        data: { user: never };
      }>("http://localhost:3500/users/signup", "POST", {
        email,
        password,
        passwordConfirm,
        name: username,
      });

      if (response && response.status === "success") {
        console.log("Registered successfully");
        // For auto-login:
        handleLogin(email, password);
      } else {
        console.error("Error signing up");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error || "An unexpected error occurred during sign-up");
    }

    setIsLoading(false);
  };

  const submitHandler = () => {
    handleLogin(email, password);
    handleClose();
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            ...style,
            borderColor: "success.dark",
          }}
        >
          <Typography variant="h6" component="h2">
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={isLoading}
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
          isLoading={isLoading}
          open={signUpModalOpen}
          handleClose={() => {
            handleClose();
            setSignUpModalOpen(false);
          }}
          handleSignUp={handleSignUp}
        />
      )}
    </>
  );
};

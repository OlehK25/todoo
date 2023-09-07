import React, { useState, FC, ReactElement } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import { style } from "./ReusableModal";
import { IModalSignup } from "./interfaces/IModalSignup";

export const SignupModal: FC<IModalSignup> = ({
  loginModalOpen = false,
  setLoginModalOpen = () => console.log(),
  isLoading,
  open,
  handleClose,
  handleSignUp,
}): ReactElement => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<
    Partial<{
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }>
  >({});

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const submitHandler = () => {
    let newErrors = {};

    if (!username)
      newErrors = { ...newErrors, username: "Username is required" };
    if (!email) newErrors = { ...newErrors, email: "Email is required" };
    if (!validateEmail(email))
      newErrors = { ...newErrors, email: "Invalid email format" };
    if (password.length < 6)
      newErrors = {
        ...newErrors,
        password: "Password should be at least 6 characters",
      };
    if (!password)
      newErrors = { ...newErrors, password: "Password is required" };
    if (password !== passwordConfirm)
      newErrors = { ...newErrors, confirmPassword: "Passwords don't match!" };

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSignUp(email, password, passwordConfirm, username);
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        boxShadow: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          ...style,
          borderColor: "warning.dark",
        }}
      >
        <Typography variant="h6" component="h2">
          Sign Up
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
          disabled={isLoading}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
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
          error={!!errors.password}
          helperText={errors.password}
          disabled={isLoading}
        />
        <TextField
          label="Confirm password"
          variant="outlined"
          fullWidth
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          margin="normal"
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={submitHandler}
          disabled={isLoading || !email || !password || !username}
        >
          Register
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setLoginModalOpen(loginModalOpen);
            handleClose();
          }}
          disabled={isLoading}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Modal>
  );
};

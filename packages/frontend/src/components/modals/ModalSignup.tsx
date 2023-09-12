import React, { useState, FC, ReactElement } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import { style } from "./ReusableModal";
import { IModalSignup } from "./interfaces/IModalSignup";
import { PasswordInput } from "../user/_userPassword";

export const SignupModal: FC<IModalSignup> = ({
  setSignUpModalOpen = () => console.log(),
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
      username: string | null;
      email: string | null;
      password: string | null;
      passwordConfirm: string | null;
    }>
  >({});

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "username":
        return value ? null : "Username is required";
      case "email":
        return validateEmail(value) ? null : "Invalid email format";
      case "password":
        return value.length >= 6
          ? null
          : "Password should be at least 6 characters";
      case "passwordConfirm":
        return password === value ? null : "Passwords don't match!";
      default:
        return null;
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    const fieldError = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError }));
  };

  const submitHandler = () => {
    const newErrors = {
      username: validateField("username", username),
      email: validateField("email", email),
      password: validateField("password", password),
      passwordConfirm: validateField("passwordConfirm", passwordConfirm),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === null)) {
      setLoginModalOpen(false);
      handleSignUp(email, password, passwordConfirm, username);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
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
          onBlur={() => handleFieldBlur("username", username)}
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
          disabled={isLoading}
          sx={{ margin: "2px 0px" }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleFieldBlur("email", email)}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          disabled={isLoading}
          sx={{ margin: "2px 0px" }}
        />
        <PasswordInput
          id="passwordM"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          label="Password"
          size="medium"
          onBlur={() => handleFieldBlur("password", password)}
          error={!!errors.password}
          helperText={errors.password}
        />
        <PasswordInput
          id="passwordConfirmM"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          disabled={isLoading}
          label="Password Confirm"
          size="medium"
          onBlur={() => handleFieldBlur("passwordConfirm", passwordConfirm)}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={submitHandler}
          disabled={
            isLoading || !email || !password || !passwordConfirm || !username
          }
        >
          Register
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setLoginModalOpen(loginModalOpen);
            setSignUpModalOpen(false);
          }}
          disabled={isLoading}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Modal>
  );
};

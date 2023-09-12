import * as React from "react";
import { FC, ReactElement, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

import { IModalForgot } from "./interfaces/IModalForgot";
import { style } from "./ReusableModal";
import { PasswordInput } from "../user/_userPassword";

export const ModalForgotPassword: FC<IModalForgot> = ({
  handleGetResetCode = () => console.log(),
  isPasswordReset = false,
  handleResetPassword = () => console.log(),
  isCodeReset = false,
  handleForgotPassword = () => console.log(),
  open = false,
  isLoading = false,
  handleClose = () => console.log(),
}): ReactElement => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  function submitHandler() {
    if (isCodeReset && !isPasswordReset) {
      handleGetResetCode(email, code);
    } else if (isPasswordReset) {
      handleResetPassword(email, code, newPassword, newPasswordConfirm);
    } else {
      handleForgotPassword(email);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      sx={{
        boxShadow: 24,
        backdropFilter: "blur(4px)",
        display: `${isLoading && "none"}`,
      }}
    >
      <Box
        sx={{
          ...style,
          borderColor: "success.dark",
        }}
      >
        <Typography variant="h6" component="h2">
          Reset Password
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
          disabled={isLoading || isCodeReset}
        />
        {isCodeReset && (
          <TextField
            id="code"
            variant="outlined"
            value={code === 0 ? "" : code}
            fullWidth
            margin="normal"
            onChange={(e) => setCode(+e.target.value)}
            disabled={isLoading || isPasswordReset}
            label="Code"
          />
        )}
        {isPasswordReset && (
          <>
            <PasswordInput
              id="passwordReset"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              label="New password"
              size="medium"
            />
            <PasswordInput
              id="passwordConfirmReset"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              disabled={isLoading}
              label="New password confirm"
              size="medium"
            />
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={submitHandler}
          disabled={
            isLoading ||
            !email ||
            (isCodeReset && !code) ||
            (isPasswordReset && !newPassword && !newPasswordConfirm)
          }
        >
          Submit
        </Button>
        {isCodeReset && (
          <Button color="secondary" onClick={() => {}} disabled={isLoading}>
            Don`t get code? Resend
          </Button>
        )}
      </Box>
    </Modal>
  );
};

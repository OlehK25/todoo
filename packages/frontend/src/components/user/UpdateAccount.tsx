import * as React from "react";
import { FC, ReactElement, useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

import { IUpdateAccount } from "./interfaces/IUpdateAccount";
import { UserContext } from "../../context";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";
import { UpdatePassword } from "./_userUpdatePassword";
import { DeleteAccount } from "./DeleteAccount";

export const UpdateAccount: FC<IUpdateAccount> = ({
  setIsClickedAccount = () => console.log(),
}): ReactElement => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleUpdateAccount = async () => {
    setIsLoading(true);
    const body: {
      name?: string;
      currentPassword?: string;
      password?: string;
      passwordConfirm?: string;
    } = {};
    if (userName) {
      body.name = userName;
    } else if (currentPassword && password && passwordConfirm) {
      body.currentPassword = currentPassword;
      body.password = password;
      body.passwordConfirm = passwordConfirm;
    }

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/updateMe",
        "PATCH",
        body,
      );

      console.log(response);

      if (response && response.status === "success") {
        toast.success("Updated successfully");
        if (user) {
          setUser({ ...user, name: userName });
        }
        setUserName("");
        setPassword("");
        setPasswordConfirm("");
        setCurrentPassword("");
      } else if (response && response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error updating account: ${error}`);
    }

    setIsLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          margin: "1rem",
        }}
        size="medium"
        color="secondary"
        onClick={() => setIsClickedAccount(false)}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>

      <Typography mb={2} component="h2" variant="h6">
        Update your account name
      </Typography>

      <Stack
        sx={{
          width: "100%",
          marginBottom: "20px",
          bgcolor: "#313131",
          borderRadius: "8px",
          border: "0px solid",
          p: 3,
        }}
        spacing={2}
      >
        <TextField
          id="email"
          disabled
          label="Email"
          defaultValue={user?.email}
          variant="outlined"
          size="small"
        />
        <TextField
          id="fullName"
          disabled={isLoading}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          label="User Name"
          variant="outlined"
          size="small"
        />

        <Button
          disabled={isLoading || !userName}
          onClick={handleUpdateAccount}
          variant="contained"
          size="large"
          fullWidth
        >
          Update Account Name
        </Button>
      </Stack>

      <Typography mb={2} component="h2" variant="h6">
        Update your password
      </Typography>

      <Stack
        sx={{
          width: "100%",
          marginBottom: "20px",
          bgcolor: "#313131",
          borderRadius: "8px",
          border: "0px solid",
          p: 3,
        }}
        spacing={2}
      >
        <UpdatePassword
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          label="Current Password"
        />

        <UpdatePassword
          id="newPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          label="Password"
        />
        <UpdatePassword
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          disabled={isLoading}
          label="Confirm Password"
        />

        <Button
          disabled={
            isLoading || !currentPassword || password !== passwordConfirm
          }
          onClick={handleUpdateAccount}
          variant="contained"
          size="large"
          fullWidth
        >
          Update Password
        </Button>
      </Stack>

      <DeleteAccount
        setIsClickedAccount={setIsClickedAccount}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </Box>
  );
};

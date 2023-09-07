import * as React from "react";
import { FC, ReactElement, useContext, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LogoutOutlined } from "@mui/icons-material";
import toast from "react-hot-toast";

import { UserContext } from "../../context";
import { LoginModal } from "../modals/ModalLogin";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { ReusableModal } from "../modals/ReusableModal";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";
import { IHeader } from "./interfaces/IHeader";

export const Header: FC<IHeader> = ({
  isClickedAccount = false,
  setIsClickedAccount = () => console.log(),
  loginModalOpen = false,
  setLoginModalOpen = () => console.log(),
  isClicked = false,
  setIsClicked = () => console.log(),
  isAuthenticated = false,
}): ReactElement => {
  const { setUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/login",
        "POST",
        { email, password },
      );

      if (response && response.status === "success") {
        setLoginModalOpen(false);
        toast.success("Authentication is successful!");
        setUser(response.data.user);
        localStorage.setItem("token", response.token);
      }
    } catch (error) {
      toast.error(`${error}`);
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsClickedAccount(false);
    if (isClicked) setIsClicked(false);
    setUser(null);
    localStorage.removeItem("token");
    setLogoutModalOpen(false);
    toast.success("Logged out successfully");
  };

  return (
    <Box
      mb={8}
      px={4}
      display="flex"
      justifyContent="space-around"
      alignItems="center"
    >
      <h2>Status Of Your Tasks As On {format(new Date(), "PPPP")}</h2>

      <Box>
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          sx={{
            mx: "5px",
          }}
          onClick={() => {
            if (isClickedAccount) setIsClickedAccount(!isClickedAccount);
            setIsClicked(!isClicked);
          }}
        >
          {isClicked ? <RemoveIcon /> : <AddIcon />}
        </Fab>

        <Fab
          color="primary"
          aria-label="user"
          size="small"
          sx={{
            mx: "5px",
          }}
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <AccountCircleIcon />
        </Fab>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem
            onClick={() => {
              if (!isAuthenticated) setLoginModalOpen(true);
              else {
                if (isClicked) setIsClicked(!isClicked);
                setIsClickedAccount(!isClickedAccount);
              }
            }}
          >
            <Avatar sx={{ mr: "10px" }} />
            {isAuthenticated ? "My account" : "Login"}
          </MenuItem>
          {isAuthenticated && <Divider />}

          {isAuthenticated && (
            <MenuItem onClick={() => setLogoutModalOpen(true)}>
              <ListItemIcon>
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          )}
        </Menu>

        {logoutModalOpen && (
          <ReusableModal
            open={logoutModalOpen}
            handleClose={() => setLogoutModalOpen(false)}
            title="Confirm Logout"
            description="Are you sure you want to logout?"
            onConfirm={handleLogout}
            confirmButtonText="Logout"
          />
        )}

        {loginModalOpen && (
          <LoginModal
            loginModalOpen={loginModalOpen}
            setLoginModalOpen={setLoginModalOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            open={loginModalOpen}
            handleClose={() => setLoginModalOpen(false)}
            handleLogin={handleLogin}
          />
        )}
      </Box>
    </Box>
  );
};

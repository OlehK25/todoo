import React, { FC, ReactElement, useContext } from "react";
import { Grid } from "@mui/material";

import { Profile } from "../profile/Profile";
import { CreateTaskForm } from "../CreateTaskForm/CreateTaskForm";
import { UserContext } from "../../context";
import { ISidebar } from "./interfaces/ISidebar";

export const styleSidebar = {
  height: "100vh",
  position: "fixed",
  right: 0,
  top: 0,
  width: "100%",
  backgroundColor: "background.paper",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
};

export const Sidebar: FC<ISidebar> = ({
  isAuthenticated = false,
}): ReactElement => {
  const { user } = useContext(UserContext);
  return (
    <Grid item md={4} sx={styleSidebar}>
      {isAuthenticated ? (
        <>
          <Profile name={user?.name} />
          <CreateTaskForm />
        </>
      ) : (
        <p>Log in to create tasks</p>
      )}
    </Grid>
  );
};

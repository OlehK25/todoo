import * as React from "react";
import { FC, ReactElement } from "react";
import { Grid } from "@mui/material";

import { UpdateAccount } from "./UpdateAccount";
import { IAccount } from "./interfaces/IAccount";
import { styleSidebar } from "../sidebar/Sidebar";

export const Account: FC<IAccount> = ({
  setIsClickedAccount = () => console.log(),
}): ReactElement => {
  return (
    <Grid item md={4} sx={styleSidebar}>
      <UpdateAccount setIsClickedAccount={setIsClickedAccount} />
    </Grid>
  );
};

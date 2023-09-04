import React, { FC, ReactElement, useContext, useState } from "react";
import { Grid } from "@mui/material";

import { Sidebar } from "../../components/sidebar/Sidebar";
import { TaskArea } from "../../components/taskArea/TaskArea";
import { UserContext } from "../../context";

export const Dashboard: FC = (): ReactElement => {
  const { user } = useContext(UserContext);
  const isAuthenticated = user !== null;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Grid container={isClicked} minHeight="100vh" p={0} m={0}>
      <TaskArea
        isAuthenticated={isAuthenticated}
        isClicked={isClicked}
        setIsClicked={() => setIsClicked(!isClicked)}
      />
      {isClicked && <Sidebar isAuthenticated={isAuthenticated} />}
    </Grid>
  );
};

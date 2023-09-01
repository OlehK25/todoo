import React, { FC, ReactElement, useState } from "react";
import { Grid } from "@mui/material";

import { Sidebar } from "../../components/sidebar/Sidebar";
import { TaskArea } from "../../components/taskArea/TaskArea";

export const Dashboard: FC = (): ReactElement => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Grid container={isClicked} minHeight="100vh" p={0} m={0}>
      <TaskArea
        isClicked={isClicked}
        setIsClicked={() => setIsClicked(!isClicked)}
      />
      {isClicked && <Sidebar />}
    </Grid>
  );
};

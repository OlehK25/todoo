import * as React from "react";
import { FC, ReactElement } from "react";
import { Box, Fab } from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { ITaskArea } from "./interfaces/ITaskArea";

export const Header: FC<ITaskArea> = ({
  isClicked = false,
  setIsClicked = () => console.log(),
}): ReactElement => {
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
          onClick={setIsClicked}
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
        >
          <AccountCircleIcon />
        </Fab>
      </Box>
    </Box>
  );
};

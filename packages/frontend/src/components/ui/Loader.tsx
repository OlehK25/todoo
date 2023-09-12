import * as React from "react";
import { FC, ReactElement } from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loader: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        zIndex: 9999,
        display: "flex",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

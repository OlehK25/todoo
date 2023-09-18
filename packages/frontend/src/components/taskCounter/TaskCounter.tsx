import React, { FC, ReactElement } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

import { ITaskCounter } from "./interfaces/ITaskCounter";
import { emitCorrectBorderColor } from "./helpers/emitCorrectBorderColor";
import { emitCorrectLabel } from "./helpers/emitCorrectLabel";

export const TaskCounter: FC<ITaskCounter> = (props): ReactElement => {
  const { status = "ALL", count = 0, selectedStatus = "ALL" } = props;

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar
          sx={{
            backgroundColor: `${
              selectedStatus === status
                ? emitCorrectBorderColor(status)
                : "transparent"
            }`,
            border: "5px solid",
            width: "96px",
            height: "96px",
            marginBottom: "16px",
            borderColor: `${emitCorrectBorderColor(status)}`,
          }}
        >
          <Typography
            color={`${selectedStatus === status ? "#000" : "#ffffff"}`}
            fontWeight={`${selectedStatus === status ? "700" : "500"}`}
            variant="h4"
          >
            {count}
          </Typography>
        </Avatar>
        <Typography
          color="#ffffff"
          fontWeight="bold"
          fontSize="20px"
          variant="h5"
        >
          {emitCorrectLabel(status)}
        </Typography>
      </Box>
    </>
  );
};

TaskCounter.propTypes = {
  count: PropTypes.number,
  status: PropTypes.string,
};

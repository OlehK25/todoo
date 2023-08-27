import React, { FC, ReactElement } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";

import { ITaskHeader } from "./interfaces/ITaskHeader";
import { ModalDeleteWindow } from "../modal/ModalDelete";

export const TaskHeader: FC<ITaskHeader> = (props): ReactElement => {
  const {
    id,
    title = "This is a test title",
    date = new Date(),
    showCloseIcon = false,
    onDelete = (e) => console.log(e),
  } = props;

  return (
    <Box display="flex" width="100%" justifyContent="space-between" mb={3}>
      <Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      {!showCloseIcon && (
        <Box>
          <Chip variant="outlined" label={`${format(date, "PPP")}`} />
        </Box>
      )}
      {showCloseIcon && <ModalDeleteWindow id={id} onDelete={onDelete} />}
    </Box>
  );
};

TaskHeader.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  showCloseIcon: PropTypes.bool,
  onDelete: PropTypes.func,
};

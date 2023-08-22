import React, { FC, ReactElement, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

import { TaskHeader } from "./_taskHeader";
import { TaskDescription } from "./_taskDescription";
import { TaskFooter } from "./_taskFooter";
import { ITask } from "./interfaces/ITask";
import { Priority } from "../CreateTaskForm/enums/priority";
import { renderPriorityBorderColor } from "./helpers/renderPriorityBorderColor";
import { Status } from "../CreateTaskForm/enums/status";

export const Task: FC<ITask> = (props): ReactElement => {
  const {
    id,
    title = "Test Title",
    date = new Date(),
    description = "Test Description",
    priority = Priority.high,
    status = Status.completed,
    onStatusChange = (e) => console.log(e),
    onClick = (e) => console.log(e),
    onDelete = () => console.log("Delete"),
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="flex-start"
      flexDirection="column"
      mb={4}
      p={2}
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: `${renderPriorityBorderColor(priority)}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TaskHeader
        title={title}
        date={date}
        showCloseIcon={isHovered}
        onDelete={onDelete}
      />
      <TaskDescription description={description} />
      <TaskFooter
        id={id}
        status={status}
        onStatusChange={onStatusChange}
        onClick={onClick}
      />
    </Box>
  );
};

Task.propTypes = {
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  description: PropTypes.string,
  onStatusChange: PropTypes.func,
  onClick: PropTypes.func,
  priority: PropTypes.oneOf([Priority.low, Priority.normal, Priority.high]),
  onDelete: PropTypes.func,
};

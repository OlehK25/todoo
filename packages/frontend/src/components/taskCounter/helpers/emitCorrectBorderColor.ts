import { Status } from "../../CreateTaskForm/enums/status";

export const emitCorrectBorderColor = (status: Status | string): string => {
  switch (status) {
    case Status.todo:
      return "error.light";
    case Status.inProgress:
      return "warning.light";
    case Status.completed:
      return "success.light";
    default:
      return "#3D246C";
  }
};

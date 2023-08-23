import { TaskCounterStatusType } from "../interfaces/ITaskCounter";
import { Status } from "../../CreateTaskForm/enums/status";

export const emitCorrectLabel = (
  status: TaskCounterStatusType | string,
): string => {
  switch (status) {
    case Status.todo:
      return "Todo's";
    case Status.inProgress:
      return "In progress";
    case Status.completed:
      return "Completed";
    default:
      return "ALL";
  }
};

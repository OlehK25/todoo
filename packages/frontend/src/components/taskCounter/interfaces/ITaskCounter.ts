import { Status } from '../../CreateTaskForm/enums/status';

export type TaskCounterStatusType =
  | Status.todo
  | Status.inProgress
  | Status.completed;

export interface ITaskCounter {
  count?: number;
  status?: TaskCounterStatusType;
}

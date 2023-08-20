import { ITaskAPI } from '../interfaces/ITaskAPI';
import { TaskCounterStatusType } from '../../taskCounter/interfaces/ITaskCounter';

export const countTasks = (
  tasks: ITaskAPI[],
  status: TaskCounterStatusType,
): number => {
  if (!Array.isArray(tasks)) return 0;

  return tasks.filter((task) => {
    return task.status === status;
  }).length;
};

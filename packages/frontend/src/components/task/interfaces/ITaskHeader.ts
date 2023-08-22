import { IModalDelete } from "../../modal/interfaces/IModalDelete";

export interface ITaskHeader extends IModalDelete {
  title?: string;
  date?: Date;
  showCloseIcon?: boolean;
}

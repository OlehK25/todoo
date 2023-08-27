import { IModalDelete } from "../../modal/interfaces/IModalDelete";
import { ITaskFooter } from "./ITaskFooter";

export interface ITaskHeader extends IModalDelete, ITaskFooter {
  title?: string;
  date?: Date;
  showCloseIcon?: boolean;
}

import { ITaskFooter } from "./ITaskFooter";
import React from "react";

export interface ITaskHeader extends ITaskFooter {
  title?: string;
  date?: Date;
  showCloseIcon?: boolean;
  handleClose?: () => void;
  handleDelete?: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => void;
}

import React, { ReactElement } from "react";

export interface IReusableModal {
  open?: boolean;
  handleClose?: () => void;
  title?: string;
  description?: string;
  onConfirm?: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  confirmButtonText?: string;
  confirmButtonIcon?: ReactElement;
}

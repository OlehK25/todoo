export interface IModalForgot {
  isCodeReset?: boolean;
  handleForgotPassword?: (email: string) => void;
  handleResetPassword?: (
    email: string,
    code: number,
    newPassword: string,
    newPasswordConfirm: string,
  ) => void;
  open?: boolean;
  isLoading?: boolean;
  handleClose?: () => void;
  isPasswordReset?: boolean;
  handleGetResetCode?: (email: string, code: number) => void;
}

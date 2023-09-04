export interface IModalSignup {
  isLoading: boolean;
  open: boolean;
  handleClose: () => void;
  handleSignUp: (
    username: string,
    password: string,
    email: string,
    passwordConfirm: string,
  ) => void;
}

export interface IModalSignup {
  setSignUpModalOpen?: (value: boolean) => void;
  loginModalOpen?: boolean;
  setLoginModalOpen?: (value: boolean) => void;
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

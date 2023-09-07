export interface IModalLogin {
  loginModalOpen?: boolean;
  setLoginModalOpen?: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  open: boolean;
  handleClose: () => void;
  handleLogin: (username: string, password: string) => void;
}

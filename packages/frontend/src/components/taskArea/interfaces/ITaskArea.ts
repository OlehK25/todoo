export interface ITaskArea {
  loginModalOpen?: boolean;
  setLoginModalOpen?: (i: boolean) => void;
  setIsClicked?: () => void;
  isClicked?: boolean;
  isAuthenticated?: boolean;
}

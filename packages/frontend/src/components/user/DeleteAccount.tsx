import * as React from "react";
import { FC, ReactElement, useContext, useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { IDeleteAccount } from "./interfaces/IDeleteAccount";
import { ReusableModal } from "../modals/ReusableModal";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import toast from "react-hot-toast";
import { UserContext } from "../../context";

export const DeleteAccount: FC<IDeleteAccount> = ({
  setIsClickedAccount = () => console.log(),
  isLoading = false,
  setIsLoading = () => console.log(),
}): ReactElement => {
  const { setUser } = useContext(UserContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const response = await sendApiRequest<IApiResponse>(
        "http://localhost:3500/users/deleteMe",
        "DELETE",
      );

      if (response) {
        localStorage.removeItem("token");
        toast.success("Deleted successfully");
        setUser(null);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error deleting account: ${error}`);
    } finally {
      setIsClickedAccount(false);
      setDeleteModalOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        disabled={isLoading}
        startIcon={<DeleteIcon />}
        onClick={() => setDeleteModalOpen(true)}
      >
        Delete Account
      </Button>

      {deleteModalOpen && (
        <ReusableModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete Account"
          description="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleDeleteAccount}
          confirmButtonText="Delete"
        />
      )}
    </>
  );
};

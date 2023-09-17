import { backendURL } from "../../helpers/constants";

export const fetchUserDetails = async (token: string) => {
  if (!token) return;
  const response = await fetch(`${backendURL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch user details.");
  }

  return response.json();
};

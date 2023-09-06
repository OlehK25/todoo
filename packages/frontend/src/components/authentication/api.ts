export const fetchUserDetails = async (token: string) => {
  const response = await fetch("http://localhost:3500/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch user details.");
  }

  return response.json();
};

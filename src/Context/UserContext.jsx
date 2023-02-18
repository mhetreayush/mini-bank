import { createContext, useContext, useState } from "react";

const userDetails = createContext();

export const UserDetailsContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <userDetails.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
      }}
    >
      {children}
    </userDetails.Provider>
  );
};
export const UserDetails = () => {
  return useContext(userDetails);
};

import React, { createContext, useState, useContext, useEffect } from "react";
import { Cookies } from "typescript-cookie";

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userid: boolean;
  setUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get("authToken"));
  const [userid, setUser] = useState(Cookies.get("userId"));

  useEffect(() => {
    setLoggedIn(!!Cookies.get("authToken"));
    setUser(Cookies.get("userId"));
  }, [Cookies.get("authToken"), Cookies.get("userId")]);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userid, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };

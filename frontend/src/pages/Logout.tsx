import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "typescript-cookie";
import { useAuth } from "../AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const token = getCookie("authToken");

    if (token) {
      removeCookie("authToken");
      removeCookie("userId");
      setLoggedIn(false);
    }

    setTimeout(() => {
      navigate("/");
    }, 100);
  }, [navigate, setLoggedIn]);

  return null;
}

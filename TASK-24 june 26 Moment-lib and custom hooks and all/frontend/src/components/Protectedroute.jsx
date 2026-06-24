import { Navigate } from "react-router-dom";

const Protectedroute = ({ children }) => {
  const isLogin = localStorage.getItem("token");

  return isLogin ? children : <Navigate to="/signin" />;
};

export default Protectedroute;

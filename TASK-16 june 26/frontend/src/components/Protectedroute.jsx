import { Navigate } from "react-router-dom";

const Protectedroute = ({ children }) => {
  const isLogin = JSON.parse(localStorage.getItem("user"));

  return isLogin ? children : <Navigate to="/signin" />;
};

export default Protectedroute;

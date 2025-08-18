import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getItem } from "../../utils/permission";

const PrivateRoute = () => {
  const acces_token = getItem("access");  
  const organization = getItem("organization");
  const location = useLocation();

  if (!organization) {
    <Navigate to="/organisasi" state={{ from: location }} replace />;
  }

  return acces_token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

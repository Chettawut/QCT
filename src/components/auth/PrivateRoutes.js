import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingProvider } from "../../store/context/loading-context";
import { AxiosInterceptor } from "../layout/AxiosInterceptor";
import Header from "../layout/Header";
import Main from "../layout/Main";

const PrivateRoute = ({ allowdRole }) => {
  const location = useLocation();
  // const navigate = useNavigate();

  //   useEffect(() => {
  //     let exp = STORAGE.GET("expired");
  //     let token = STORAGE.GET("token");
  //     let current = parseInt(Date.now() / 1000);

  //     if (!token || !exp || current > exp) {
  //       navigate("/login", { replace: true });
  //     }
  //   }, [location.pathname]);

  const authCheck = () => {
    let payload = { role: "admin" };
    return allowdRole.includes(payload?.role);
  };

  return authCheck() ? (
    <Main>
      <Header></Header>
      <LoadingProvider>
        <AxiosInterceptor>
          <Outlet />
        </AxiosInterceptor>
      </LoadingProvider>
    </Main>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

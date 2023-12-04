// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Items from "../pages/Items";
import SR from "../pages/SR";
import PO from "../pages/PO";
import Unit from "../pages/Unit";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import PageNotFound from "../pages/404";
import Itemtype from "../pages/Itemtype";
import User from "../pages/User";
import Customer from "../pages/Customer";
import PrivateRoute from "../components/auth/PrivateRoutes";
import { BomForm, BomIndex } from "../pages/bom/bom";
import { ROLES } from "../constant/constant";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
        <Route path="/" element={<Login />} />

        <Route
          element={<PrivateRoute allowdRole={[ROLES.ADMIN, ROLES.USER,  ]} />}
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/sr" element={<SR />} />
          <Route path="/PO" element={<PO />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/itemtype" element={<Itemtype />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="bom/" element={<BomIndex />}></Route>
          <Route path="bom/:action/:id?" element={<BomForm />} />
        </Route>


        <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN]} />}>
          <Route path="/user" element={<User />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

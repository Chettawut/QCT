import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import RB from "../pages/RB";
import Billing from "../pages/Billing";
import Receivinggoods from "../pages/Receiving_goods";
import Car from "../pages/Car";
import Business from "../pages/Business";
import Items from "../pages/Items";
import Employee from "../pages/Employee";
import Supplier from "../pages/Supplier";
import History from "../pages/History";
import { PO, POAccess, POManage } from "../pages/po/index";
import Unit from "../pages/Unit";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import PageNotFound from "../pages/404";
import Itemtype from "../pages/Itemtype";
import Billinginformation from "../pages/Billing_information";
import User from "../pages/User";
import Quotation from "../pages/Quotation";
import Customer from "../pages/Customer";
import PrivateRoute from "../components/auth/PrivateRoutes";
import Cardata from "../pages/Cardata";
import { ROLES } from "../constant/constant";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN, ROLES.USER]} />} >
          <Route path="/dashboard" element={<Dashboard />} />          
          <Route path="/RB" element={<RB />} />
          <Route path="/Billing" element={<Billing />} />
          <Route path="/History" element={<History />} />
          <Route path="/Items" element={<Items />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Supplier" element={<Supplier />} />
          <Route path="/Car" element={<Car />} />
          <Route path="/Business" element={<Business />} />
          <Route path="/Receivinggoods" element={<Receivinggoods />} />
          <Route path="/Billinginformation" element={<Billinginformation />} />
          <Route path="/Quotation" element={<Quotation />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/user" element={<User />} />
          <Route path="/itemtype" element={<Itemtype />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/cardata" element={<Cardata />} />
          {/* <Route path="/purchase-order/" exact element={<PO />}>
            <Route index element={<POIndex />} />
            <Route path="manage/:action" element={<POForm />} />
            <Route path="view" element={<POView />} />
          </Route> */}
          <Route path="/purchase-order/"  exact element={<PO />} >
                <Route index element={<POAccess />} />
                <Route path="manage/:action" element={<POManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

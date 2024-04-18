import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import RB from "../pages/RB";
import Billing from "../pages/Billing";
import Car from "../pages/Car";
import Business from "../pages/Business";
import Items from "../pages/Items";
import Employee from "../pages/Employee";
import Supplier from "../pages/Supplier";
import History from "../pages/History";
import { PO, POAccess, POManage } from "../pages/po/index";
import { GR, GRAccess, GRManage } from "../pages/gr/index";
import {
  Quotation,
  QuotationAccess,
  QuotationManage,
} from "../pages/quotation/index";
import Unit from "../pages/Unit";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import PageNotFound from "../pages/404";
import Itemtype from "../pages/Itemtype";
import Billinginformation from "../pages/Billing_information";
import User from "../pages/User";
import Customer from "../pages/Customer";
import PrivateRoute from "../components/auth/PrivateRoutes";
import Model from "../pages/Model";
import { ROLES } from "../constant/constant";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route
          element={<PrivateRoute allowdRole={[ROLES.ADMIN, ROLES.USER]} />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/RB" element={<RB />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/history" element={<History />} />
          <Route path="/items" element={<Items />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/car" element={<Car />} />
          <Route path="/business" element={<Business />} />
          <Route path="/billinginformation" element={<Billinginformation />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/user" element={<User />} />
          <Route path="/itemtype" element={<Itemtype />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/model" element={<Model />} />
          {/* <Route path="/purchase-order/" exact element={<PO />}>
            <Route index element={<POIndex />} />
            <Route path="manage/:action" element={<POForm />} />
            <Route path="view" element={<POView />} />
          </Route> */}
          <Route path="/purchase-order/" exact element={<PO />}>
            <Route index element={<POAccess />} />
            <Route path="manage/:action" element={<POManage />} />
            {/* <Route path="view" element={<PilotScaleView />} /> */}
          </Route>
          <Route path="/good-receive/" exact element={<GR />}>
            <Route index element={<GRAccess />} />
            <Route path="manage/:action" element={<GRManage />} />
          </Route>
          <Route path="/quotation/" exact element={<Quotation />}>
            <Route index element={<QuotationAccess />} />
            <Route path="manage/:action" element={<QuotationManage />} />
          </Route>
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

// import axios from "axios";
// import { MEDTHOD } from "../constant/constant";
// import { BACKEND_URL } from "../utils/util";

// const API_URL = {
//   Add_CUSTOMER: `${BACKEND_URL}/customer/add_customer.php`,
//   GET_CUSTOMER: `${BACKEND_URL}/customer/get_customer.php`,
//   GETSUP_CUSTOMER: `${BACKEND_URL}/customer/getsup_customer.php`,
//   Edit_CUSTOMER: `${BACKEND_URL}/customer/edit_customer.php`,
//   GET_CUSCODE: `${BACKEND_URL}/customer/get_cuscode.php`,
// };

// let contenttype = {"content-type": "application/x-www-form-urlencoded"};

// const CustomerService = {
//   addCustomer: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,
//       url: API_URL.Add_CUSTOMER,
//       headers: contenttype,
//       data: reqData,
//     });
//   },

//   getCuscode: () => {
//     return axios({
//       medthod: MEDTHOD.GET,
//       url: API_URL.GET_CUSCODE,
//     });
//   },  
  
//   getSupCustomer: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,      
//       url: API_URL.GETSUP_CUSTOMER,
//       data: {
//         idcode: reqData,
//       },
//       headers: contenttype,
//     });
//   },

//   editCustomer: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,
//       url: API_URL.Edit_CUSTOMER,
//       headers: contenttype,
//       data: reqData,
//     });
//   },

//   getCustomer: () => {
//     return axios({
//       medthod: MEDTHOD.GET,
//       url: API_URL.GET_CUSTOMER,
//     });
//   },
// };

// export default CustomerService;

import { requestService as api } from "./Request.service"  
import { STORE_KEY } from "../constant/constant";

const API_URL = {
  API_GETMASTER: `/customer/get_customer.php`, 
  API_GETCODE: `/customer/get_cuscode.php`, 
  API_MANAGE: `/customer/manage.php`,
};

const getHeader = () => {
  const t = sessionStorage.getItem(STORE_KEY.authen);

  return {
    // "content-type" : "application/x-www-form-urlencoded",
    "Authorization" : `Bearer ${t}`
  }
}

const CustomerService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm, { headers: getHeader() });
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm, { headers: getHeader() });
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`, { headers: getHeader() });
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`, { headers: getHeader() });
  const getcode = () => api.get(`${API_URL.API_GETCODE}`, { headers: getHeader() });

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm, { headers: getHeader() });

  return {
    create,
    update,
    deleted,
    get,
    getcode,
    search,
  };
};

export default CustomerService;

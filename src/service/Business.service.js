// import axios from "axios";
// import { MEDTHOD } from "../constant/constant";
// import { BACKEND_URL } from "../utils/util";

// const API_URL = {
//   Add_BUSINESS: `${BACKEND_URL}/business/add_business.php`,
//   GET_BUSINESS: `${BACKEND_URL}/business/get_business.php`,
//   GETSUP_BUSINESS: `${BACKEND_URL}/business/getsup_business.php`,
//   Edit_BUSINESS: `${BACKEND_URL}/business/edit_business.php`,
//   GET_BUSINESSNO: `${BACKEND_URL}/business/get_businesscode.php`,
//   GET_CUSCODE: `${BACKEND_URL}/customer/get_cuscode.php`,
// };

// let contenttype = {"content-type": "application/x-www-form-urlencoded"};

// const BusinessService = {
//   addBusiness: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,
//       url: API_URL.Add_BUSINESS,
//       headers: contenttype,
//       data: reqData,
//     });
//   },  

//   getBusinessno: () => {
//     return axios({
//       medthod: MEDTHOD.GET,
//       url: API_URL.GET_BUSINESSNO,
//     });
//   },  
  
//   getSupBusiness: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,      
//       url: API_URL.GETSUP_BUSINESS,
//       data: {
//         idcode: reqData,
//       },
//       headers: contenttype,
//     });
//   },

//   editBusiness: (reqData) => {
//     return axios({
//       method: MEDTHOD.POST,
//       url: API_URL.Edit_BUSINESS,
//       headers: contenttype,
//       data: reqData,
//     });
//   },

//   getBusiness: () => {
//     return axios({
//       medthod: MEDTHOD.GET,
//       url: API_URL.GET_BUSINESS,
//     });
//   },
// };

// export default BusinessService;

import { requestService as api } from "./Request.service"  
import { STORE_KEY } from "../constant/constant";

const API_URL = {
  API_GETMASTER: `/business/get_business.php`, 
  API_GETCODE: `/business/get_buscode.php`, 
  API_MANAGE: `/business/manage.php`,
};

const getHeader = () => {
  const t = sessionStorage.getItem(STORE_KEY.authen);

  return {
    // "content-type" : "application/x-www-form-urlencoded",
    "Authorization" : `Bearer ${t}`
  }
}

const BusinessService = () => { 
  
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

export default BusinessService;
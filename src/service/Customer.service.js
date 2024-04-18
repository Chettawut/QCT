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

import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_CUSTOMER: `${BACKEND_URL}/customer/add_customer.php`,
  GET_CUSTOMER: `${BACKEND_URL}/customer/get_customer.php`,
  GETSUP_CUSTOMER: `${BACKEND_URL}/customer/getsup_customer.php`,
  Edit_CUSTOMER: `${BACKEND_URL}/customer/edit_customer.php`,
  GET_CUSCODE: `${BACKEND_URL}/customer/get_cuscode.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const CustomerService = {
  addCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_CUSTOMER,
      headers: contenttype,
      data: reqData,
    });
  },

  getCuscode: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CUSCODE,
    });
  },  
  
  getSupCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_CUSTOMER,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_CUSTOMER,
      headers: contenttype,
      data: reqData,
    });
  },

  getCustomer: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CUSTOMER,
    });
  },
};

export default CustomerService;

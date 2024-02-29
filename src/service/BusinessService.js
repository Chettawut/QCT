import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_BUSINESS: `${BACKEND_URL}/business/add_business.php`,
  GET_BUSINESS: `${BACKEND_URL}/business/get_business.php`,
  GETSUP_BUSINESS: `${BACKEND_URL}/business/getsup_business.php`,
  Edit_BUSINESS: `${BACKEND_URL}/business/edit_business.php`,
  GET_BUSINESSNO: `${BACKEND_URL}/business/get_business.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const BusinessService = {
  addBusiness: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_BUSINESS,
      headers: contenttype,
      data: reqData,
    });
  },

  getBusinessno: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_BUSINESSNO,
    });
  },  
  
  getSupBusiness: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_BUSINESS,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editBusiness: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_BUSINESS,
      headers: contenttype,
      data: reqData,
    });
  },

  getBusiness: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_BUSINESS,
    });
  },
};

export default BusinessService;

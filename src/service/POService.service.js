import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_PO: `${BACKEND_URL}/po/add_po.php`,
  GET_PO: `${BACKEND_URL}/po/get_po.php`,
  GETSUP_PO: `${BACKEND_URL}/po/getsup_po.php`,
  Edit_PO: `${BACKEND_URL}/po/edit_po.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const POService = {
  addPO: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_PO,
      headers: contenttype,
      data: reqData,
    });
  },

  getPO: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_PO,
    });
  },
  
  getSupPO: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_PO,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editPO: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_PO,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default POService;

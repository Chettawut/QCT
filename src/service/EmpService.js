import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_EMP: `${BACKEND_URL}/employee/add_emp.php`,
  GET_EMP: `${BACKEND_URL}/employee/get_emp.php`,
  GETSUP_EMP: `${BACKEND_URL}/employee/getsup_emp.php`,
  Edit_EMP: `${BACKEND_URL}/employee/edit_emp.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const UserService = {

  addEmp: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_EMP,
      headers: contenttype,
      data: reqData,
    });
  },

  getEmp: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_EMP,
    });
  },
  
  getSupEmp: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_EMP,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editEmp: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_EMP,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default UserService;

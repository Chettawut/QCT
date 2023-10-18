import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_SR: `${BACKEND_URL}/sr/add_sr.php`,
  GET_SR: `${BACKEND_URL}/sr/get_sr.php`,
  GETSUP_SR: `${BACKEND_URL}/sr/getsup_sr.php`,
  Edit_SR: `${BACKEND_URL}/sr/edit_sr.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const SRService = {
  addSR: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_SR,
      headers: contenttype,
      data: reqData,
    });
  },

  getSR: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_SR,
    });
  },
  
  getSupSR: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_SR,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editSR: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_SR,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default SRService;

import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  GET_ALL_Model: `${BACKEND_URL}/model/get_allmodel.php`,
  Add_Model: `${BACKEND_URL}/model/add_model.php`,
  GET_Model: `${BACKEND_URL}/model/get_model.php`,
  GETSUP_Model: `${BACKEND_URL}/model/getsup_model.php`,
  Edit_Model: `${BACKEND_URL}/model/edit_model.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const ModelService = {
  getAllModel: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ALL_Model,
      headers: contenttype,
    });
  },

  addModel: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_Model,
      headers: contenttype,
      data: reqData,
    });
  },

  getModel: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_Model,
      headers: contenttype,
    });
  },
  
  getSupModel: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_Model,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editModel: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_Model,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default ModelService;

import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  GET_ALL_ITEMS: `${BACKEND_URL}/item/get_allitem.php`,
  Add_ITEM: `${BACKEND_URL}/item/add_item.php`,
  GET_ITEM: `${BACKEND_URL}/item/get_item.php`,
  GETSUP_ITEM: `${BACKEND_URL}/item/getsup_item.php`,
  Edit_ITEM: `${BACKEND_URL}/item/edit_item.php`,
};

let contenttype = { "content-type": "application/x-www-form-urlencoded" };

const ItemService = {
  getAllItems: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ALL_ITEMS,
    });
  },

  addItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_ITEM,
      headers: contenttype,
      data: reqData,
    });
  },

  getItem: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ITEM,
      headers: contenttype,
    });
  },
  
  getSupItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_ITEM,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_ITEM,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default ItemService;

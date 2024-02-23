import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  GET_ALL_SUPPLIER: `${BACKEND_URL}/supplier/get_allsupplier.php`,
  GET_ALL_Producer: `${BACKEND_URL}/supplier/get_allproducer.php`,
  Add_SUPPLIER: `${BACKEND_URL}/supplier/add_supplier.php`,
  GET_SUPCODE: `${BACKEND_URL}/supplier/get_supcode.php`,
  GET_SUPPLIER: `${BACKEND_URL}/supplier/get_supplier.php`,
  GETSUP_SUPPLIER: `${BACKEND_URL}/supplier/getsup_supplier.php`,
  Edit_SUPPLIER: `${BACKEND_URL}/supplier/edit_supplier.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const SupplierService = {
  getAllSupplier: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ALL_SUPPLIER,
      headers: contenttype,
    });
  },

  getAllProducer: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ALL_Producer,
      headers: contenttype,
    });
  },

  getSupcode: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_SUPCODE,
    });
  },  

  addSupplier: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_SUPPLIER,
      headers: contenttype,
      data: reqData,
    });
  },

  getSupplier: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_SUPPLIER,
      headers: contenttype,
    });
  },
  
  getSupSupplier: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_SUPPLIER,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editSupplier: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_SUPPLIER,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default SupplierService;

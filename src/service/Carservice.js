import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_Car: `${BACKEND_URL}/car/add_car.php`,
  GET_Car: `${BACKEND_URL}/car/get_car.php`,
  GETSUP_Car: `${BACKEND_URL}/car/getsup_car.php`,
  Edit_Car: `${BACKEND_URL}/car/edit_car.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const CarService = {
  addCar: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_Car,
      headers: contenttype,
      data: reqData,
    });
  },

  getCar: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_Car,
    });
  },
  
  getSupCar: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_Car,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editCar: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_Car,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default CarService;

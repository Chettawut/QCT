import { requestService } from "./Request.service" 
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  ITEMS_OPTION: `${BACKEND_URL}/common/items-option.php`, 
};
 
const request = requestService();

const optionService  = () => {
  const optionsItems = (parm = {}) => request.get(API_URL.ITEMS_OPTION, parm).catch(e => { throw new Error("เกิดปัญช้อผิดพลาด") })

  return {
    optionsItems
  };
};

export default optionService;
import { requestService } from "./Request.service" 
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  ITEMS_BOMS: `${BACKEND_URL}/common/items-option.php`, 
};
 
const request = requestService();

const bomService  = () => {
  const bomItems = (parm = {}) => request.get(API_URL.ITEMS_BOMS, {...parm, p:"items"}).catch(e => { throw new Error("เกิดปัญช้อผิดพลาด") });

  return {
    bomItems
  };
};

export default bomService;
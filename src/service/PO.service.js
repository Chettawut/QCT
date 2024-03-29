import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/po/manage.php`, 
  API_GETMASTER: `/po/get-purchase-order.php`, 
  GET_POCODE: `/po/get_pocode.php`, 

  API_MANAGE_PACKING_GROUP: `/po/manage-packing-set-group.php`
};

const POService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const getPOcode = (parm = {}) => api.post(`${API_URL.GET_POCODE}`, parm);
  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  const createGroup = (parm = {}) => api.post(`${API_URL.API_MANAGE_PACKING_GROUP}`, parm, { ignoreLoading : true });
  const updateGroup = (parm = {}) => api.put(`${API_URL.API_MANAGE_PACKING_GROUP}`, parm, { ignoreLoading : true });
  const deleteGroup = (code) => api.delete(`${API_URL.API_MANAGE_PACKING_GROUP}?code=${code}`, { ignoreLoading : true });
  return {
    create,
    update,
    deleted,
    get,
    getPOcode,
    search,
    createGroup,
    updateGroup,
    deleteGroup,
  };
};

export default POService;
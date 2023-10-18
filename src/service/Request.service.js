 
import axios from "axios"; 
import {  message } from 'antd';
const contenttype = {"content-type": "application/x-www-form-urlencoded"};
// const [messageApi] = message.useMessage();
export const requestService = () => {
    const get = (url, parm)=>( 
        axios({
            method: "get",      
            url: `${url}`,
            params: parm,
            headers: contenttype,
        })
        .catch( (error)=>{
            message.error(error.message, 5); 

            throw new Error("เกิดปัญช้อผิดพลาด");
        })
    );

    const post = (url, parm)=>(
        axios({
            method: "post",      
            url: url,
            data: parm,
            headers: contenttype,
        })
        .catch( (error)=>{
            message.error(error.message, 5);

            throw new Error("เกิดปัญช้อผิดพลาด");
        })
    );

    return {
        get,
        post,
    }
}
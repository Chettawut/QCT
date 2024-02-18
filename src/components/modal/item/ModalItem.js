import React, {useState, useEffect} from 'react';
import "./modal-item.css";
import { Button,Modal, Table, message ,Spin } from "antd";
import { useForm } from 'antd/es/form/Form';

import { itemscolumns } from "./modal-item.model";
import ItemService from "../../../service/Item.service";

export default function ModalItem({show, close, values, selected}) {
    const [form] = useForm();

    const [itemList, setItemList] = useState([]);
    
    const [openModal,  setOpenModel] = useState(show);
    const [loading,  setLoading] = useState(true);
    
    const handleClose = () =>{ 
         close();  
        
        //setTimeout( () => close(false), 200 );
    } 

    const handleDelete = (productCode) => {
        // const newData = selectedList.filter(
        //   (item) => item?.productCode !== productCode
        // );
        // setSelectedList(newData);
      };

    const checkDupItem = (itemCode) => {
        let isDup = false;
        // selectedList.map((item) => {
        //   if (item?.productCode === itemCode) isDup = true;
        //   return item;
        // });
        return isDup;
      };
    
      const resetData = () => {
        setItemList([]);
        // setSelectedList([]);
      };
    
      const handleCreate = () => {
        // ==== CALL API TO CREATE SR HERE ==== //
        // console.log("selectedList ==> ", selectedList);
        resetData();
        close();
      };

      const handleSelectedItem = (record) => {
        const newData = {
          productCode: record?.stcode,
          productName: record?.stname,
          productQty: 1,
          productUnit: record?.unit,
          productPrice: +record?.price,
          productDiscount: 0,
          productTotalPrice: +record?.price,
        };
    
        close();
        // setSelectedList([...selectedList, newData]);
      };

    /** setting initial component */ 
    const itemsColumn = itemscolumns({handleSelectedItem,checkDupItem});

    const onload = () =>{
        setLoading(true);
        ItemService.getAllItems()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemList(data);
        }
      }).catch((err) => { 
            message.error("Request error!")
        })
        .finally( () => setTimeout( () => { setLoading(false) }, 400));
    }

    useEffect( () => {
        if( !!openModal ){
            onload();
            // console.log("modal-customers");       
        } 
    }, [openModal]);

    return (
        <>
        <Spin spinning={loading} >
        <Modal
        open={openModal}
        title="เลือกสินค้า"
        onCancel={handleClose}
        footer={<Button onClick={handleClose}>ปิด</Button>}
      >
        <Table
          rowClassName={() => "editable-row"}
          bordered
          dataSource={itemList}
          columns={itemsColumn}
          rowKey="stcode"
        />
      </Modal> 
      </Spin>
        </>
    )
}

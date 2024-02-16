import React, {useState, useEffect} from 'react';
import "./modal-customers.css";
import { Modal, Card, Table, message, Form, Spin } from "antd";
import { Row, Col, Space } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from 'antd/es/form/Form';

import { customersColumn } from "./modal-customers.model";
import CustomerService from '../../../service/CustomerService';

export default function ModalCustomers({show, close, values, selected}) {
    const [form] = useForm();

    const [customersData, setCustomersData] = useState([]);
    const [customersDataWrap, setCustomersDataWrap] = useState([]);

    const [openModal,  setOpenModel] = useState(show);
    const [loading,  setLoading] = useState(true);
    /** handle logic component */
    const handleClose = () =>{ 
        setTimeout( () => { close(false);  }, 140);
        
        //setTimeout( () => close(false), 200 );
    }

    // const handleConfirm = () => {
    //     // console.log(itemsList); 
    //     // values([...itemsList, ...selected]);
    //     // setItemsList([]);
    //     setOpenModel(false);
    // }

    const handleSearch = (value) => {
        if(!!value){    
            const f = customersData.filter( d => ( (d.cuscode?.includes(value)) || (d.cusname?.includes(value)) ) );
             
            setCustomersDataWrap(f);            
        } else { 
            setCustomersDataWrap(customersData);            
        }

    }

    const handleChoose = (value) => {
        values(value);
        setOpenModel(false);
    }

    /** setting initial component */ 
    const column = customersColumn({handleChoose});

    const onload = () =>{
        CustomerService.getAllCustomer()
        .then((res) => {
          let { status, data } = res;
          if (status === 200) {
            setCustomersData(data);
            setCustomersDataWrap(data);
          }
        })
        .catch((err) => { 
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

    /** setting child component */
    // const ButtonModal = (
    //     <Space direction="horizontal" size="middle" >
    //         <Button type='primary' onClick={() => handleConfirm() }>ยืนยันการเลือกสินค้า</Button>
    //         <Button onClick={() => setOpenModel(false) }>ปิด</Button>
    //     </Space>
    // )
    /** */
    return (
        <>
        <Modal
            open={openModal}
            title="เลือกสินค้า"
            afterClose={() => handleClose() }
            onCancel={() => setOpenModel(false) } 
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='modal-customers'
        >
            <Spin spinning={loading} >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหาชื่อ หรือ รหัสลูกค้า'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                    <Card>
                        <Table  
                            bordered
                            dataSource={customersDataWrap}
                            columns={column}
                            rowKey="cuscode"
                            pagination={{ 
                                total:customersData.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${customersData.length} items`,
                                defaultPageSize:25,
                                pageSizeOptions:[25,35,50,100]
                            }}
                            scroll={{ x: 'max-content', y:400 }} 
                            size='small'
                        /> 
                    </Card>
                </Space> 
            </Spin>

        </Modal>    
        </>
    )
}

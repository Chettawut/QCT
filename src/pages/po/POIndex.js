/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Space } from "antd";
import { Table, Card } from "antd";
import { Button } from "antd";

import Highlighter from "react-highlight-words"; 
import { columns } from "./purchase-order.model"; 

import SRService from "../../service/SRService"; 
import dayjs from 'dayjs';

// import { useLoadingContext } from "../../store/context/loading-context";
export default function PO() {
    const navigate = useNavigate();
    // const { startLoading, stopLoading } = useLoadingContext(); 
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const [sampleRequestData, setSampleRequestData] = useState([]);

    const [manageConfig] = useState({title:"เพิ่ม Sample Request", textOk:null, textCancel:null, action:"create", code:null});

    const searchInput = useRef(null);
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleFilter = (selectedKeys, confirm, dataIndex) => {
        confirm({ closeDropdown: false, });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };

    const hendleRender = (text, dataIndex) => {
        text = dataIndex === "srdate" ? dayjs(text).format("DD/MM/YYYY") : text;
        return searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : ( text );
    }   

    const showEditModal = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode} }, replace:true } );
    }; 
      
    const handleView = (data) => {
        navigate("view", { state: { config: {...manageConfig, title:"View", code:data?.srcode} }, replace:true } );
    };    

    const handleDelete = (data) => { 
        // startLoading();
        SRService.delete(data?.srcode).then( _ => {
            const tmp = sampleRequestData.filter( d => d.srcode !== data?.srcode );

            setSampleRequestData([...tmp]);

            // stopLoading();
        })
        .catch(e => {
            // stopLoading();
        });
    };   

    const columnSearchProp = { handleSearch, handleFilter, handleReset, hendleRender } 
    
    const srColumn = columns( searchInput, columnSearchProp, {handleAction:showEditModal, handleView, handleDelete} ); 

    const onload = () =>{
        // startLoading();
        // SRService.search().then((res) => {
        //   let { data } = res.data; 
        //   setSampleRequestData(data);

        // //   stopLoading();
        // })
        // .catch((err) => { 
        //     console.log(err);
        //     message.error("Request error!");

        //     // stopLoading();
        // });
    }

    useEffect( () => { 
        onload();
    }, []);
    return (
        <>
        <div className="layout-content">
            <Space direction="vertical" size="middle" className='width-100 sample-request' >
                <Row className='m-0'>
                    <Col span={12}>
                        <Button 
                        type="primary" 
                        onClick={() => { 
                            navigate("manage/create", { state: { config: {...manageConfig, title:"เพิ่ม Purchase Order", action:"create"} }, replace:true })
                        }}
                        > เพิ่ม Purchase Order </Button>
                    </Col>
                    <Col span={12}></Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mbs-24">
                        <Card bordered={false} className="criclebox cardbody h-full">
                            <Table 
                                scroll={{ x: 'max-content' }} 
                                size='small' 
                                rowKey="srcode" 
                                columns={srColumn} 
                                dataSource={sampleRequestData}
                                className='table-sample-request'
                            />
                        </Card>
                    </Col>
                </Row>                
            </Space> 
 
        </div>
        </>
    )
}

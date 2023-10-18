import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Card, Space, Button } from 'antd';

import {columns} from "./bom.model"
import "./bom.css"

const BomIndex = () => { 
  const [bomData,  setBomData] = useState([]);
  // for (let i = 0; i < 100; i++) {
  //   data.push({
  //     key: i,
  //     name: `Edward ${i}`,
  //     age: 32,
  //     address: `London Park no. ${i}`,
  //   });
  // } 
  // console.log(data);
  console.log("setBomData ==> ", setBomData);

  const navigate = useNavigate();
  return (
    <div className='bom--page-layout'>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }} >
          <Space wrap align="baseline">
            <Button type="primary" onClick={()=>{navigate("/bom/create")}} >
              เพิ่ม BOM
            </Button>
          </Space>
        
          <Card bordered={false} className="criclebox cardbody h-full no-box-shadow" style={{"padding":"0.745rem", paddingLeft: "1.7rem"}}> 
              <Table
                columns={columns}
                dataSource={bomData} 
                id='table--list' 
              />
          </Card>
        </Space>
    </div> 
  );
};


export default BomIndex;

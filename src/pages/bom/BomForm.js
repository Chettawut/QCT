/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Form, Input, Radio, Table, Select } from 'antd';
import { Card, Space, Col, Row, Modal } from 'antd'; 
import { SearchOutlined } from '@ant-design/icons';

import optionService from "../../service/Options.service"
import bomService from "../../service/Boms.service"

import {  columnsBomItems } from  './bom.model'
import { bomRequestViewModel } from  './bom.model'
import { components, getColumns } from "./bom-component/bom-edit-table"

import { message } from 'antd';

export default function BomForm() {
  // console.log(new Date());
  const optionRequest = optionService();
  const bomRequest = bomService(); 
  const [form] = Form.useForm();
  const [form_search] = Form.useForm();
  const navigate = useNavigate();
  const [bomDetail, setBomDetail] = useState([]);
  const [formValue, setFormValue] = useState({...bomRequestViewModel});

  // const [itemSelection, setItemSelection] = useState([]);
  
  const [showModalItem, setShowModalItem] = useState(false);

  const [itemsOption, setItemsOption] = useState([]);
  const [itemsBom, setItemsBom] = useState([]);
  const [itemsBomSource, setItemsBomSource] = useState([]);
  const [itemsBomRowKeySelect, setItemsBomRowKeySelect] = useState([]);
  const [itemsBomRowDataSelect, setItemsBomRowDataSelect] = useState([]);

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} is required!', 
  };

  /** Hook use Effect */

  useEffect( () => { 
    async function getItemOption(){
      const {data, status} =  await optionRequest.optionsItems({type:"1"}) 
      
      if(status === 200) setItemsOption(data.data); 
    } 
    getItemOption();
    return () => {};
  }, []);

  useEffect( () => { 
    async function getItemBoms(){
      const {data, status} =  await bomRequest.bomItems();
      
      if(status === 200) {
        let res = data.data;
        let itemid = bomDetail.map( m =>  m.itemid)
        let choosed = res.filter( f => !itemid.includes(f.stcode) )
        setItemsBom(choosed); 
        setItemsBomSource(choosed);
      }
    } 
    if(!!showModalItem){
      getItemBoms();

    }

  }, [showModalItem]); 

  /** End Hook use Effect */

  /** Config Conponent */

  const itemSelection = {
    selectedRowKeys : itemsBomRowKeySelect,
    type: "checkbox",
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setItemsBomRowKeySelect(selectedRowKeys); 
      setItemsBomRowDataSelect(selectedRows);
      // console.log(selectedRowKeys, itemsBomSelect);
    },
    getCheckboxProps: (record) => {
      const {parent_itemid} = form.getFieldValue()
      return{
        disabled: record.stcode === parent_itemid,
        // Column configuration not to be checked
        name: record.stcode,
      }
    },
  };

  /** End Config Component */

  //** Function logic */

  const onSubmitBom = () =>{
    form.validateFields().then(value=>{
      value = {...formValue, ...value};
      setFormValue(value);
      if(bomDetail.length < 1) {
        message.warning("กรุณาเลือกวัถุดิบสำหรับ bom.")
        return;
      } 
      let parm = {
        bom_detail : value,
        bom_items : bomDetail
      }
      console.log(parm); 
    });
  }

  const onCloseBomItems = () =>{
    setShowModalItem(false);
    setItemsBomRowKeySelect([]);
    form_search.resetFields(); 
    // setItemsBomSelect([]);
  } 

  const onSearchTableBomItem = (e) => {
    let search = itemsBom.filter( f => (
         f.stname.toLowerCase().includes(e.target.value?.toLowerCase())
      || f.stcode.toLowerCase().includes(e.target.value?.toLowerCase())
      || f.stnameEN.toLowerCase().includes(e.target.value?.toLowerCase())
    ))
    setItemsBomSource(search);
  }

  const onConfirmBomIten = () => { 
    let bomd = convertBomItemToBomDetail(itemsBomRowDataSelect); 
    setBomDetail( [...bomDetail, ...bomd ]);

    setShowModalItem(false);
  }
 
  const handleSave = (row) => {
    const newData = [...bomDetail];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index]; 
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // console.log(row, index);
    // console.log(item); 
    // console.log(newData);
    setBomDetail(newData);
  };
  
  const columnsBomDetail = getColumns(handleSave);

  function convertBomItemToBomDetail(bomItem){ 
    return bomItem?.map( m => ({
      itemid : m.stcode,
      item_name : m.stnamedisplay,
      item_amount : 1,
      unit : m.unit,
      key : m.stcode,
      remarks: "-"
    }))
  }
  /** End Function Logic */

  //** Component */
  const BomDetailHeder = ()=>{
    return (
      <>
        <Row gutter={[8, 8]} style={{ display: 'flex', alignItems:'center', justifyContent:"space-between" }}>
          <Col span={12} style={{ display: 'flex', alignItems:'center', justifyContent:'start' }}> 
            <Space size="middle" style={{ display: 'flex', alignItems:'center' }} >
              <span style={{fontSize: 'clamp(0.9rem, 1.1vw, 24px)'}}>Bom Detail</span>
            </Space>
          </Col>
          <Col span={12} style={{ display: 'flex', alignItems:'center', justifyContent:'end' }}> 
            <Space size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
              <Button type="primary" 
                onClick={() => {
                  const {parent_itemid} = form.getFieldValue()
                  if(!!parent_itemid)
                    setShowModalItem(true)
                  else message.warning("กรุณาเลือก parent item ก่อน")
                }}
              >
                Add  Child Items
              </Button>
            </Space>
          </Col>
        </Row>       
      </>
    )
  };

  const BomDetailForm = ()=>{
    return(
      <Form 
        form={form} 
        layout="vertical" 
        name="wrap"
        initialValues={formValue}
        validateMessages={validateMessages}
      >
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Bom name" name="bom_name" rules={[{ required: true }]} >
              <Input placeholder="input bom name." />
            </Form.Item>
          </Col> 

          <Col xs={24} sm={12}>
          <Form.Item label="Parent Item" name="parent_itemid" rules={[{ required: true, message: 'Please select Parent item.' }]}  >
            <Select
              showSearch
              style={{ width: "100%", height: 40 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)} 
              options={itemsOption}
            />
          </Form.Item> 
        </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please choose status' }]}  >
              <Radio.Group value={formValue.status} buttonStyle="solid" className='status-group'>
                <Radio.Button value="Y">Enable</Radio.Button>
                <Radio.Button value="N">Disable</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>  
      </Form>
    )
  };

  // const BomItemsTable = ()=>{
  //   return (

  //   ) 
  // };

  
 
  /** Emd Component */
  return (
    <>
      <div className='bom--page-layout' >  
        <Space direction="vertical" size="middle" style={{ display: 'flex' }} >  
          <Card bordered={false} className="criclebox card-p cardbody h-full no-box-shadow card-secondary"> 
            <BomDetailForm />
          </Card>
          <Card bordered={false} className="criclebox card-p cardbody h-full no-box-shadow card-tb">
            <Table
              components={components}
              columns={columnsBomDetail}
              dataSource={bomDetail} 
              title={BomDetailHeder}
              rowKey="itemid" 
              id="table--bom-detail-list"
              pagination={false}
            />
          </Card> 

          <Row gutter={[8, 8]}>
            <Col span={12}> 
              <Space size="middle" style={{ display: 'flex' }} >
                <Button type="primary" onClick={() => navigate(-1)} className='bg-secondary'>
                  Back
                </Button>  
              </Space>
            </Col>
            <Col span={12}> 
              <Space size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type="primary" onClick={()=>{ onSubmitBom()} }>
                  Submit
                </Button>
              </Space>
            </Col>
          </Row> 
        </Space> 
      </div>
      <Modal
        id="bom--items"
        open={showModalItem}
        title="เลือกสินค้า"
        onCancel={() => onCloseBomItems()} 
        footer={
        <>
          <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
            <Button type='primary' onClick={()=>{onConfirmBomIten()}} >ยืนยัน</Button>
            <Button onClick={() => onCloseBomItems()}>ปิด</Button> 
          </Space>
        </>
        }
        className='choose-res'
        style={{ top: 20 }} 
      >
        <Card bordered={false} className="criclebox card-p cardbody h-full no-box-shadow card-secondary" style={{marginBottom:".45rem"}} bodyStyle={{paddingBlock:".25rem"}}> 
         <Form  
          form={form_search}
          layout="vertical" 
          name="search--bom-item" 
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Search" name="input_search" >
                  <Input 
                    prefix={<SearchOutlined /> }  
                    onChange={(e)=>{ onSearchTableBomItem(e) }} 
                    placeholder="input value for search" 
                    autoComplete='off'
                  />
                </Form.Item>
              </Col>
            </Row>  
          </Form> 
        </Card>
        <div id='items-bom-layout' >
          <Table 
            bordered
            dataSource={itemsBomSource}
            columns={columnsBomItems}
            pagination={false}
            rowKey="stcode" 
            rowSelection={itemSelection}
            tableLayout="-"
            scroll={{ y: "calc(100vh - 24rem)", x: "100%" }}
          />
        </div> 
      </Modal> 
    </>

  )
}

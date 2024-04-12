import React, { useState, useEffect } from "react";
import { SearchOutlined, ToolTwoTone, ClearOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Collapse,
  Checkbox,
  Tabs,
  message,
  Divider,
  Form,
  Badge,
  Select,
  Flex,
  Radio,
} from "antd";
import Swal from "sweetalert2";
// COMPONENT
// SERVICE
import ItemService from "../service/Item.service";
import ItemTypeService from "../service/ItemType.service";
import UnitService from "../service/Unit.service";

import { items } from "../model/items.model";

const Items = () => {
  const { TextArea } = Input;
  const [AllItems, setAllItems] = useState("");

  // MODAL CONTROLLER
  const [openModalManage, setOpenModalManage] = useState(false);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มประเภทสินค้า",
    confirmText: "Create",
  });

  const [itemsDetail, setItemsDetail] = useState(items);
  const [optionType, setOptionType] = useState([]);
  const [optionValueType, setOptionValueType] = useState();
  const [optionUnit, setOptionUnit] = useState([]);
  const [optionValueUnit, setOptionValueUnit] = useState();
  const [form] = Form.useForm();
  const [activeSearch, setActiveSearch] = useState([]);

  const [formAdd] = Form.useForm();
  const [formManage] = Form.useForm();

  useEffect(() => {
    GetItems();
    GetItemType();
    GetUnit();
  }, []);

  const GetItems = (data) => {
    ItemService.getItem(data)
      .then((res) => {
        const { data } = res.data;

        setAllItems(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const GetItemType = () => {
    ItemTypeService.getAllItemsType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setOptionType(data);
        }
      })
      .catch((err) => {});
  };

  const GetUnit = () => {
    UnitService.getAllUnit()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setOptionUnit(data);
        }
      })
      .catch((err) => {});
  };

  const handleSearch = () => {
    form
      .validateFields()
      .then((v) => {
        const data = { ...v };

        GetItems(data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };

  const columns = [
    {
      title: "รหัสสินค้า",
      dataIndex: "stcode",
      key: "stcode",
      width: "20%",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname",
      width: "20%",
    },
    {
      title: "ประเภทสินค้า",
      dataIndex: "typename",
      key: "typename",
      width: "20%",
    },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
      width: "20%",
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "statusitem",
      key: "statusitem",
      width: "20%",
      render: (data) => (
        <div>
          {data === "Y" ? (
            <Badge status="success" text="เปิดการใช้งาน" />
          ) : (
            <Badge status="error" text="ปิดการใช้การ" />
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          size="small"
          icon={
            <ToolTwoTone twoToneColor="#E74C3C" style={{ fontSize: ".9rem" }} />
          }
          danger
          onClick={(e) => showEditModal(text.stcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);
  const columnsdetail = [
    {
      title: "ปีผลิต",
      dataIndex: "stcode",
      key: "stcode",
      width: "20%",
    },
    {
      title: "หนึ่งในสี่ส่วน",
      dataIndex: "stname",
      key: "stname",
      width: "40%",
    },
    {
      title: "สถานที่เก็บ",
      dataIndex: "typename",
      key: "typename",
      width: "40%",
    },
  ].filter((item) => !item.hidden);
  const showEditModal = (data) => {
    document.body.style = "overflow: hidden !important;";
    ItemService.getSupItem(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemsDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขประเภทสินค้า",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    ItemService.addItem(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItems();
            setOpenModalManage(false);
            formAdd.resetFields();
          } else {
            Swal.fire({
              title: "<strong>" + data.message + "</strong>",
              html: "ผิดพลาด",
              icon: "error",
            });
          }
        } else {
          // alert(data.message)
          Swal.fire({
            title: "<strong>ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    ItemService.editItem({ ...itemsDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItems();

            setOpenModalManage(false);
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        } else {
          // alert(data.message)
          Swal.fire({
            title: "<strong>ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };

  const onModalManageClose = async () => {
    setItemsDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
    document.body.style = "overflow: visible !important;";
  };

  const CollapseItemSearch = () => {
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="รหัสสินค้า" name="stcode" onChange={handleSearch}>
              <Input placeholder="ใส่รหัสสินค้า" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="ชื่อสินค้า" name="stname" onChange={handleSearch}>
              <Input placeholder="ใส่ชื่อสินค้า" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
            {/* Ignore */}
          </Col>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
            <Flex justify="flex-end" gap={8}>
              <Button
                type="primary"
                size="small"
                className="bn-action"
                htmlType="submit"
                icon={<SearchOutlined />}
                onClick={() => handleSearch()}
              >
                ค้นหา
              </Button>
              <Button
                type="primary"
                size="small"
                className="bn-action"
                danger
                icon={<ClearOutlined />}
                onClick={() => handleClear()}
              >
                ล้าง
              </Button>
            </Flex>
          </Col>
        </Row>
      </>
    );
  };

  const itemsManage = [
    {
      key: "1",
      label: "ข้อมูลพื้นฐาน",
      children: (
        <Form form={formManage} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stcode" label="รหัสสินค้า">
                <Input
                  disabled={actionManage.action === "edit" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item name="stname" label="ชื่อสินค้า">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="typecode" label="ประเภทสินค้า">
                <Select
                  size={"large"}
                  value={optionValueType}
                  onChange={(value) => setOptionValueType(value)}
                  options={optionType.map((item) => ({
                    value: item.typecode,
                    label: item.typename,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="unit" label="หน่วยสั่งซื้อ">
                <Select
                  size={"large"}
                  value={optionValueUnit}
                  onChange={(value) => setOptionValueUnit(value)}
                  options={optionUnit.map((item) => ({
                    value: item.unitname,
                    label: item.unitname,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="material_code" label="Material code">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="ตัดสต๊อก" name="count_stock">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="1">Enable</Radio.Button>
                  <Radio.Button value="0">Disable</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={6}
              style={
                actionManage.action === "edit"
                  ? { display: "inline" }
                  : { display: "none" }
              }
            >
              <Form.Item label="สถานการใช้งาน" name="active_status">
                <Select
                  size="large"
                  options={[
                    {
                      value: "Y",
                      label: <Badge status="success" text="เปิดการใช้งาน" />,
                    },
                    {
                      value: "N",
                      label: <Badge status="error" text="ปิดการใช้งาน" />,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item name="stname_vat" label="ชื่อเปิดบิล VAT">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="brand" label="ยี่ห้อ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stname_per" label="ชื่อสินค้า/ดอก">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stfront" label="รุ่น1/หน้า">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stseries" label="รุ่น2/ซี่รี่ย์">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stborder" label="รุ่น3/ขอบ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stload" label="รุ่น4/โหลด">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stspeed" label="รุ่น5/สปีด">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="sttw" label="รุ่น6/TW">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stweight" label="รุ่น7/น้ำหนัก">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stwidth" label="รุ่น8/กว้าง">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stlong" label="รุ่น9/ยาว">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="sthigh" label="รุ่น10/สูง">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stchange_round" label="รอบการเปลี่ยน">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="stchange_time" label="เวลาในการเปลี่ยน">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="stcar_brand" label="ยี่ห้อรถ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="stcar_model" label="รุ่นรถ">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="remark" label="หมายเหตุ">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      key: "2",
      label: "ราคา",
      children: (
        <Form form={formManage} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="price" label="ราคาขายปลีก">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="price_A" label="ราคาส่ง A">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="price_B" label="ราคาส่ง B">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="price_online" label="ราคา Online">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="สต๊อกขั้นต่ำ (ชิ้น)" label="สต๊อกขั้นต่ำ (ชิ้น)">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="แยกตามล๊อตการผลิต" name="stock_by_product">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="1">Enable</Radio.Button>
                  <Radio.Button value="0">Disable</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      key: "3",
      label: "สต๊อก",
      disabled: actionManage.action === "add" ? true : false,
      children: (
        <Form form={formManage} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="สต๊อกจริง" label="สต๊อกจริง">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="สต๊อก VAT" label="สต๊อก VAT">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="จำนวนขายต่อชุด" label="จำนวนขายต่อชุด">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="small"
            columns={columnsdetail}
            // dataSource={AllItems}
            rowKey="stcode"
          />
        </Form>
      ),
    },
  ];

  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => {
        setActiveSearch(e);
      }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: (
            <>
              <SearchOutlined />
              <span> ค้นหา</span>
            </>
          ),
          children: CollapseItemSearch(),
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  const ModalManage = () => {
    return (
      <Modal
        open={openModalManage}
        title={actionManage.title}
        okText={actionManage.confirmText}
        cancelText="ยกเลิก"
        style={{ top: 20 }}
        width={1000}
        afterClose={() => formManage.resetFields()}
        onCancel={() => onModalManageClose()}
        onOk={() => {
          formManage
            .validateFields()
            .then((values) => {
              if (actionManage.action === "add") {
                submitAdd(values);
              } else if (actionManage.action === "edit") {
                submitEdit(values);
              }
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Card>
          <Tabs defaultActiveKey="1" items={itemsManage} />
        </Card>
      </Modal>
    );
  };
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));
  return (
    <>
      <div className="pilot-scale-access" style={{ padding: 20 }}>
        <h1>ระบบสินค้า</h1>
        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex", position: "relative" }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form form={form} layout="vertical" autoComplete="off">
                {FormSearch}
              </Form>
            </Col>
          </Row>
        </Space>
        <br></br>

        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มสินค้า",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มสินค้า
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Checkbox.Group
                style={{ padding: 15 }}
                value={checkedList}
                options={options}
                onChange={(value) => {
                  setCheckedList(value);
                }}
              />
              <Table
                rowSelection={{
                  type: "radio",
                }}
                size="small"
                columns={newColumns}
                dataSource={AllItems}
                rowKey="stcode"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal จัดการสินค้า */}
      {openModalManage && ModalManage()}
    </>
  );
};

export default Items;

import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
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
  DatePicker,
  Divider,
  Form,
  Badge,
  Select,
} from "antd";
import Highlighter from "react-highlight-words";
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
  const searchInput = useRef(null);

  // MODAL CONTROLLER
  const [openModalManage, setOpenModalManage] = useState(false);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มประเภทสินค้า",
    confirmText: "Create",
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [itemsDetail, setItemsDetail] = useState(items);
  const [optionType, setOptionType] = useState([]);
  const [optionValueType, setOptionValueType] = useState();
  const [optionUnit, setOptionUnit] = useState([]);
  const [optionValueUnit, setOptionValueUnit] = useState();

  const [formAdd] = Form.useForm();
  const [formManage] = Form.useForm();

  useEffect(() => {
    GetItems();
    GetItemType();    
    GetUnit();
    
  }, []);

  const GetItems = () => {
    ItemService.getItem()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllItems(data);
        }
      })
      .catch((err) => {});
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Item Code",
      dataIndex: "stcode",
      key: "stcode",
      width: "20%",
      ...getColumnSearchProps("stname"),
      sorter: (a, b) => a.stname.length - b.stname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Item Name",
      dataIndex: "stname",
      key: "stname",
      width: "20%",
      ...getColumnSearchProps("stname"),
      sorter: (a, b) => a.stname.length - b.stname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Item Type",
      dataIndex: "typename",
      key: "typename",
      width: "20%",
      ...getColumnSearchProps("typename"),
      sorter: (a, b) => a.typename.length - b.typename.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: "20%",
      ...getColumnSearchProps("unit"),
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "statusitem",
      key: "statusitem",
      width: "20%",
      ...getColumnSearchProps("statusitem"),
      sorter: (a, b) => a.statusitem.length - b.statusitem.length,
      sortDirections: ["descend", "ascend"],
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
      title: "แก้ใข",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          danger
          style={{ cursor: "pointer" }}
          onClick={(e) => showEditModal(text.stcode)}
        >
          แก้ใข
        </Button>
      ),
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

  const itemsManage = [
    {
      key: "1",
      label: "ข้อมูลพื้นฐาน",
      children: (
        <Form form={formManage} layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item name="stname" label="ชื่อสินค้า">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="typename" label="ประเภทสินค้า">
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
                    value: item.unitcode,
                    label: item.unitname,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="material_code" label="Material code">
                <Input />
              </Form.Item>
            </Col>
            <Col
              style={{ paddingTop: 32 }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={6}
            >
              <Form.Item name="count_stock" valuePropName="checked">
                <Checkbox  size="large">
                  ติดตามสต๊อก
                </Checkbox>
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
              <Form.Item label="สถานการใช้งาน" name="status">
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
                <Input disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="สต๊อก VAT" label="สต๊อก VAT">
                <Input disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="จำนวนขายต่อชุด" label="จำนวนขายต่อชุด">
                <Input disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item name="check-1" valuePropName="checked">
                <Checkbox>แยกสต๊อกตามล็อตการผลิต</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={16}>
              <Form.Item name="check-1" valuePropName="checked1">
                <Checkbox>ใช้กำหนดสต๊อกขั้นต่ำ แบบกำหนดเป็นเดือนตามปริมาณการใช้จริง</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <Form.Item name="สต๊อกขั้นต่ำ (ชิ้น)" label="สต๊อกขั้นต่ำ (ชิ้น)">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    
  ];

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
  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>ระบบงานขาย</h1>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Collapse
              items={[
                {
                  key: "1",
                  label: "ตัวกรอง",
                  children: (
                    <Checkbox.Group
                      style={{
                        width: "100%",
                      }}
                    >
                      <Row>
                        <Col
                          style={{ paddingTop: 9 }}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={9}
                        >
                          <Checkbox value="A">
                            มีของ (สต๊อกตั้งแต่ 1 ขึ้นไป)
                          </Checkbox>
                        </Col>
                        <Col
                          style={{ paddingTop: 9 }}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={6}
                        >
                          <Checkbox value="B">มีของในปีที่ระบุ</Checkbox>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                          <DatePicker
                            style={{ height: 40, width: 140 }}
                            picker="year"
                          />
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  ),
                },
              ]}
            />
          </Col>
        </Row>

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
              <Table columns={columns} dataSource={AllItems} />
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

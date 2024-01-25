import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Select,
  Space,
  Tabs,
  Badge,
  InputNumber,
} from "antd";
import Swal from "sweetalert2";
import ItemService from "../service/ItemService";
import SupplierService from "../service/SupplierService";
import UnitService from "../service/UnitService";
import ItemTypeService from "../service/ItemTypeService";
import { items } from "../model/items.model";

const Items = () => {
  const { TextArea } = Input;
  const [AllItem, setAllItem] = useState("");
  const [AllSupplier, setAllSupplier] = useState("");
  const [AllProducer, setAllProducer] = useState("");
  const [AllUnit, setAllUnit] = useState("");
  const [option, setOption] = useState([]);
  const [optionValue, setOptionValue] = useState();

  const [OpenModalAdd] = useState(false);

  const [openModalManage, setOpenModalManage] = useState(false);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มประเภทสินค้า",
    confirmText: "Create",
  });

  const [isShowModalSupcode, setIsShowModalSupcode] = useState(false);
  const [isShowModalProcode, setIsShowModalProcode] = useState(false);
  const [isShowModalUnit, setIsShowModalUnit] = useState(false);

  const [formAdd] = Form.useForm();
  const [formManage] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [itemsDetail, setItemsDetail] = useState(items);

  const [disableUpload, setDisableUpload] = useState(true);
  const [stcode, setStcode] = useState(null);

  const searchInput = useRef(null);
  useEffect(() => {
    GetItem();
    GetSupcode();
    GetProcode();
    GetUnit();
    GetType();
  }, []);

  const GetItem = () => {
    ItemService.getItem()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllItem(data);
        }
      })
      .catch((err) => {});
  };

  const GetSupcode = () => {
    SupplierService.getAllSupplier()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSupplier(data);
        }
      })
      .catch((err) => {});
  };

  const GetProcode = () => {
    SupplierService.getAllProducer()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllProducer(data);
        }
      })
      .catch((err) => {});
  };

  const GetUnit = () => {
    UnitService.getAllUnit()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUnit(data);
        }
      })
      .catch((err) => {});
  };

  const GetType = () => {
    ItemTypeService.getAllItemsType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setOption(data);
        }
      })
      .catch((err) => {});
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const heandleCheckCode = (code) => {
    setDisableUpload(!code);
    setStcode(code);
  };

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
          onClick={(e) => showEditModal(text.id)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const columnssupcode = [
    {
      title: "Supplier Code",
      dataIndex: "supcode",
      key: "supcode",
      width: "40%",
      ...getColumnSearchProps("supcode"),
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Supplier Name",
      dataIndex: "supname",
      key: "supname",
      width: "60%",
      ...getColumnSearchProps("supname"),
      sorter: (a, b) => a.supname.length - b.supname.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const columnsprocode = [
    {
      title: "Producer Code",
      dataIndex: "supcode",
      key: "supcode",
      width: "40%",
      ...getColumnSearchProps("supcode"),
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Producer Name",
      dataIndex: "supname",
      key: "supname",
      width: "60%",
      ...getColumnSearchProps("supname"),
      sorter: (a, b) => a.supname.length - b.supname.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const columnsunit = [
    {
      title: "Unit Name",
      dataIndex: "unit",
      key: "unit",
      width: "100%",
      ...getColumnSearchProps("unit"),
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

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
            confirmText: "Edit",
          });
          setOpenModalManage(true);
          setDisableUpload(!data.stcode);
          setStcode(data.stcode);
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

            GetItem();
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

            GetItem();

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
    setDisableUpload(true);
    document.body.style = "overflow: visible !important;";
  };
  ////////////////////////////////

  const itemsManage = [
    {
      /////////////////////////////// Tab 1 ///////////////////////////////////////////
      key: "1",
      label: "ข้อมูลสินค้า",
      children: (
        <Form
          form={formManage}
          layout="vertical"
          // initialValues={{ ...itemsDetail }}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Form.Item
                name="stcode"
                rules={[{ required: true, message: "กรุณาใส่รหัสสินค้าใหม่!" }]}
                label="รหัสสินค้า"
              >
                <Input
                  placeholder="ใส่รหัสสินค้า"
                  onChange={(e) => {
                    heandleCheckCode(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              <Form.Item
                name="stname"
                label="ชื่อสินค้า"
                rules={[{ required: true, message: "กรุณาใส่ชื่อสินค้าใหม่!" }]}
              >
                <Input placeholder="ใส่ชื่อสินค้า" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Form.Item
                name="stnamedisplay"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้าที่แสดงผลใหม่!",
                  },
                ]}
                label="ชื่อสินค้าที่แสดงผล"
              >
                <Input placeholder="ใส่ชื่อสินค้าที่แสดงผล" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              <Form.Item
                name="stnameEN"
                label="ชื่อสินค้าภาษาอังกฤษ(EN)"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้าภาษาอังกฤษ(EN) ใหม่!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อสินค้าภาษาอังกฤษ(EN)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="unit"
                label="หน่วย"
                rules={[
                  { required: true, message: "กรุณาใส่หน่วยสินค้าใหม่!" },
                ]}
              >
                <Input
                  addonAfter={
                    <Button
                      type="primary"
                      className="bt-verified"
                      ghost
                      onClick={() => setIsShowModalUnit(true)}
                      icon={<SearchOutlined />}
                      style={{ width: "55px" }}
                    />
                  }
                  readOnly
                  placeholder="ใส่หน่วยสินค้า"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="typecode"
                label="ประเภท"
                rules={[
                  { required: true, message: "กรุณาใส่ประเภทสินค้าใหม่!" },
                ]}
              >
                <Select
                  size={"large"}
                  value={optionValue}
                  onChange={(value) => setOptionValue(value)}
                  options={option.map((item) => ({
                    value: item.typecode,
                    label: item.typename,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="supcode" label="รหัสผู้ขาย">
                  <Input addonAfter={
                     <Button
                     type="primary"
                     className="bt-verified"
                     ghost
                     onClick={() => setIsShowModalSupcode(true)}
                     icon={<SearchOutlined />}
                     style={{ width: "55px" }}
                   />
                  } readOnly placeholder="ใส่รหัสผู้ขาย" />
                 
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="supname" label="ชื่อผู้ขาย">
                <Input readOnly placeholder="ใส่ชื่อผู้ขาย" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="procode" label="รหัสผู้ผลิต">
                  <Input addonAfter={
                     <Button
                     type="primary"
                     className="bt-verified"
                     ghost
                     onClick={() => setIsShowModalProcode(true)}
                     icon={<SearchOutlined />}
                     style={{ width: "55px" }}
                   />} readOnly placeholder="ใส่รหัสผู้ผลิต" />
                  
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="proname" label="ชื่อผู้ผลิต">
                <Input readOnly placeholder="ใส่ชื่อผู้ผลิต" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    /////////////////////////////// Tab 2 ///////////////////////////////////////////
    {
      key: "2",
      label: "รายละเอียดสินค้า",
      children: (
        <Form
          form={formManage}
          layout="vertical"
          // initialValues={{ ...itemsDetail }}
          defaultValue={{ multiply: "1" }}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="price" label="ราคาขาย">
                <Input addonAfter="บาท" placeholder="ใส่ราคาขาย" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="multiply" label="ตัวคูณน้ำหนัก">
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="ใส่ตัวคูณน้ำหนัก"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="yield" label="Yield">
                <Input name="yield" addonAfter="%" placeholder="ใส่ค่า Yield" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="enumber" label="E-number">
                <Input placeholder="ใส่ E-number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="allergen" label="สารก่อภูมิแพ้">
                <Input placeholder="ใส่สารก่อภูมิแพ้" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="purpose" label="วัตถุประสงค์">
                <Input placeholder="ใส่วัตถุประสงค์" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="country" label="ประเทศหรือแหล่งกำเนิด">
                <Input placeholder="ใส่ประเทศหรือแหล่งกำเนิด" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="status" label="สถานะการใช้งาน">
                <Select
                  placeholder="ใส่สถานะการใช้งาน"
                  style={{ height: 38 }}
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
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="feature" label="ลักษณะสินค้า">
                <TextArea rows={4} placeholder="ใส่ลักษณะสินค้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
              <Form.Item name="remarks" label="Remark">
                <TextArea rows={4} placeholder="ใส่ Remarks สินค้า" />
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
        cancelText="Cancel"
        style={{ top: 20 }}
        width={1000}
        afterClose={() => formManage.resetFields() }
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
        <Card title="มูลสินค้า">
          <Tabs defaultActiveKey="1" items={itemsManage} />
        </Card>
      </Modal>
    );
  };

  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มประเภทสินค้า",
              confirmText: "Create",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มใบสั่งซื้อสินค้า
        </Button>
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table
                size="small"
                columns={columns}
                dataSource={AllItem}
                rowKey="stcode"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal จัดการสินค้า */}
      {openModalManage && ModalManage()}

      {/* Modal เลือกรหัสผู้ขาย */}
      {isShowModalSupcode && (
        <Modal
          open={isShowModalSupcode}
          title="เลือกรหัสผู้ขาย"
          width={1000}
          onCancel={() => setIsShowModalSupcode(false)}
          footer={
            <Button onClick={() => setIsShowModalSupcode(false)}>ปิด</Button>
          }
        >
          <Table
            columns={columnssupcode}
            dataSource={AllSupplier}
            rowKey="supcode"
            onRow={(record) => {
              return {
                onClick: () => {
                  if (OpenModalAdd) {
                    formAdd.setFieldValue("Add_supcode", record.supcode);
                    formAdd.setFieldValue("Add_supname", record.supname);
                  } else if (openModalManage) {
                    formManage.setFieldValue("supcode", record.supcode);
                    formManage.setFieldValue("supname", record.supname);
                  }
                  setIsShowModalSupcode(false);
                },
              };
            }}
          />
        </Modal>
      )}

      {/* Modal เลือกรหัสผู้ผลิต */}
      {isShowModalProcode && (
        <Modal
          open={isShowModalProcode}
          title="เลือกรหัสผู้ผลิต"
          width={1000}
          onCancel={() => setIsShowModalProcode(false)}
          footer={
            <Button onClick={() => setIsShowModalProcode(false)}>ปิด</Button>
          }
        >
          <Table
            columns={columnsprocode}
            dataSource={AllProducer}
            rowKey="procode"
            onRow={(record) => {
              return {
                onClick: () => {
                  if (OpenModalAdd) {
                    formAdd.setFieldValue("Add_procode", record.supcode);
                    formAdd.setFieldValue("Add_proname", record.supname);
                  } else if (openModalManage) {
                    formManage.setFieldValue("procode", record.supcode);
                    formManage.setFieldValue("proname", record.supname);
                  }
                  setIsShowModalProcode(false);
                },
              };
            }}
          />
        </Modal>
      )}

      {/* Modal เลือกหน่วย */}
      {isShowModalUnit && (
        <Modal
          open={isShowModalUnit}
          title="เลือกรหัสผู้ผลิต"
          width={1000}
          onCancel={() => setIsShowModalUnit(false)}
          footer={
            <Button onClick={() => setIsShowModalUnit(false)}>ปิด</Button>
          }
        >
          <Table
            columns={columnsunit}
            dataSource={AllUnit}
            rowKey="unitcode"
            onRow={(record) => {
              return {
                onClick: () => {
                  // alert(record.unit)
                  // setItemsDetail.unit = record.unit
                  setItemsDetail((prev) => ({ ...prev, unit: record?.unit }));

                  formManage.setFieldValue("unit", record?.unit);
                  console.log(itemsDetail);
                  //   setItemsDetail (
                  //     items.map((item) => {
                  //         return item.id === updatedItem.id? updatedItem: item;
                  //     })
                  // );
                  // .setFieldValue("unit3", );
                  setIsShowModalUnit(false);
                },
              };
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Items;

import { SearchOutlined, InboxOutlined } from "@ant-design/icons";
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
  Upload,
} from "antd";
import Swal from "sweetalert2";
import ItemService from "../service/ItemService";

const Items = () => {
  const { TextArea } = Input;
  const [AllItem, setAllItem] = useState("");

  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [isShowModalSupcode, setIsShowModalSupcode] = useState(false);
  const [isShowModalProcode, setIsShowModalProcode] = useState(false);
  
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  
  const searchInput = useRef(null);
  useEffect(() => {
    GetItem();
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
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => showEditModal(text.id)}
        >
          Edit
        </span>
      ),
    },
  ].filter((item) => !item.hidden);

  const showEditModal = (data) => {
    // alert(data)
    ItemService.getSupItem(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editstcode", data.stcode);
          formEdit.setFieldValue("Editstname", data.stname);
          formEdit.setFieldValue("EditstnameEN", data.stnameEN);          

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    ItemService.addItemType(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetItem();
          setOpenModalAdd(false);
          formAdd.resetFields();
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
    ItemService.editItemType(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetItem();

          setOpenModalEdit(false);
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

  ////////////////////////////////

  const item = [
    {
      /////////////////////////////// Tab 1 ///////////////////////////////////////////
      key: "1",
      label: "ข้อมูลสินค้า",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                รหัสสินค้า
                <Form.Item
                  name="Addstcode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่รหัสสินค้า" />
                </Form.Item>
              </Col>              
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                ชื่อสินค้า
                <Form.Item
                  name="Addstname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อสินค้า" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                ชื่อสินค้าที่แสดงผล
                <Form.Item
                  name="Addstnamedisplay"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อสินค้าที่แสดงผลใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อสินค้าที่แสดงผล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                ชื่อสินค้าภาษาอังกฤษ(EN)
                <Form.Item
                  name="AddstnameEN"
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
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                รหัสผู้ขาย
                <Form.Item
                  name="Addsupcode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสผู้ขายใหม่!",
                    },
                  ]}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input placeholder="ใส่รหัสผู้ขาย" />
                    <Button
                      type="primary"
                      ghost
                      style={{
                        width: 80,
                      }}
                      onClick={() => setIsShowModalSupcode(true)}
                      icon={<SearchOutlined />}
                    ></Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                ชื่อผู้ขาย
                <Form.Item
                  name="Addsupname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อผู้ขายใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อผู้ขาย" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                รหัสผู้ผลิต
                <Form.Item
                  name="Addprocode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสผู้ผลิตใหม่!",
                    },
                  ]}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input placeholder="ใส่รหัสผู้ผลิต" />
                    <Button
                      type="primary"
                      ghost
                      style={{
                        width: 80,
                      }}
                      onClick={() => setIsShowModalProcode(true)}
                      icon={<SearchOutlined />}
                    ></Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                ชื่อผู้ผลิต
                <Form.Item
                  name="Addproname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อผู้ผลิตใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อผู้ผลิต" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    /////////////////////////////// Tab 2 ///////////////////////////////////////////
    {
      key: "2",
      label: "รายละเอียดสินค้า",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                หน่วย
                <Form.Item
                  name="Addunit"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่หน่วยสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่หน่วยสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ประเภท
                <Form.Item
                  name="Addtypecode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ประเภทสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ประเภทสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ราคาขาย
                <Form.Item
                  name="Addprice"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ราคาขายใหม่!",
                    },
                  ]}
                >
                  <Input addonAfter="บาท" placeholder="ใส่ราคาขาย" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ตัวคูณน้ำหนัก
                <Form.Item
                  name="Addmultiply"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ตัวคูณน้ำหนักใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ตัวคูณน้ำหนัก" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                Yield
                <Form.Item
                  name="Addyield"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ค่า Yield ใหม่!",
                    },
                  ]}
                >
                  <Input name="yield" placeholder="ใส่ค่า Yield" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                E-number
                <Form.Item
                  name="Addenumber"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ E-number ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ E-number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                สารก่อภูมิแพ้
                <Form.Item
                  name="Addallergen"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่สารก่อภูมิแพ้ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่สารก่อภูมิแพ้" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                วัตถุประสงค์
                <Form.Item
                  name="Addpurpose"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่วัตถุประสงค์!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่วัตถุประสงค์" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ประเทศหรือแหล่งกำเนิด
                <Form.Item
                  name="Addcountry"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ประเทศหรือแหล่งกำเนิดใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ประเทศหรือแหล่งกำเนิด" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                สถานะการใช้งาน
                <Form.Item
                  name="Addstatus"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่สถานะการใช้งานใหม่!",
                    },
                  ]}
                >
                  <Select placeholder="ใส่สถานะการใช้งาน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ลักษณะสินค้า
                <Form.Item
                  name="Addfeature"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ลักษณะสินค้าใหม่!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="ใส่ลักษณะสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                Remark :
                <Form.Item
                  name="Addremarks"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ Remarks ใหม่!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="ใส่ Remarks สินค้า" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    /////////////////////////////// Tab 3 ///////////////////////////////////////////
    {
      key: "3",
      label: "เพิ่มเติม",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                แนบไฟล์ :
                <Form.Item name="dragger" getValueFromEvent={normFile} noStyle>
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      คลิก หรือ ลาก ไฟล์ไปยังบริเวณนี้เพื่ออัปโหลด
                    </p>
                    <p className="ant-upload-hint">
                      รองรับการอัปโหลดครั้งเดียวหรือจำนวนมาก
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];

  const itemEdit = [
    {
      /////////////////////////////// Tab 1 ///////////////////////////////////////////
      key: "1",
      label: "ข้อมูลสินค้า",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                รหัสสินค้า
                <Form.Item
                  name="Editstcode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่รหัสสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                ชื่อสินค้า
                <Form.Item
                  name="Editstname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อสินค้า" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                ชื่อสินค้าที่แสดงผล
                <Form.Item
                  name="Editstnamedisplay"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อสินค้าที่แสดงผลใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อสินค้าที่แสดงผล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                ชื่อสินค้าภาษาอังกฤษ(EN)
                <Form.Item
                  name="EditstnameEN"
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
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                รหัสผู้ขาย
                <Form.Item
                  name="Editsupcode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสผู้ขายใหม่!",
                    },
                  ]}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input placeholder="ใส่รหัสผู้ขาย" />
                    <Button
                      type="primary"
                      ghost
                      style={{
                        width: 80,
                      }}
                      onClick={() => setIsShowModalSupcode(true)}
                      icon={<SearchOutlined />}
                    ></Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                ชื่อผู้ขาย
                <Form.Item
                  name="Editsupname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อผู้ขายใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อผู้ขาย" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                รหัสผู้ผลิต
                <Form.Item
                  name="Editprocode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่รหัสผู้ผลิตใหม่!",
                    },
                  ]}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Input placeholder="ใส่รหัสผู้ผลิต" />
                    <Button
                      type="primary"
                      ghost
                      style={{
                        width: 80,
                      }}
                      onClick={() => setIsShowModalProcode(true)}
                      icon={<SearchOutlined />}
                    ></Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
                ชื่อผู้ผลิต
                <Form.Item
                  name="Editproname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อผู้ผลิตใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อผู้ผลิต" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    /////////////////////////////// Tab 2 ///////////////////////////////////////////
    {
      key: "2",
      label: "รายละเอียดสินค้า",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                หน่วย
                <Form.Item
                  name="Editunit"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่หน่วยสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่หน่วยสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ประเภท
                <Form.Item
                  name="Edittypecode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ประเภทสินค้าใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ประเภทสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ราคาขาย
                <Form.Item
                  name="Editprice"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ราคาขายใหม่!",
                    },
                  ]}
                >
                  <Input addonAfter="บาท" placeholder="ใส่ราคาขาย" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ตัวคูณน้ำหนัก
                <Form.Item
                  name="Editmultiply"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ตัวคูณน้ำหนักใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ตัวคูณน้ำหนัก" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                Yield
                <Form.Item
                  name="Edityield"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ค่า Yield ใหม่!",
                    },
                  ]}
                >
                  <Input name="yield" placeholder="ใส่ค่า Yield" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                E-number
                <Form.Item
                  name="Editenumber"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ E-number ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ E-number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                สารก่อภูมิแพ้
                <Form.Item
                  name="Editallergen"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่สารก่อภูมิแพ้ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่สารก่อภูมิแพ้" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                วัตถุประสงค์
                <Form.Item
                  name="Editpurpose"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่วัตถุประสงค์!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่วัตถุประสงค์" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ประเทศหรือแหล่งกำเนิด
                <Form.Item
                  name="Editcountry"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ประเทศหรือแหล่งกำเนิดใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ประเทศหรือแหล่งกำเนิด" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                สถานะการใช้งาน
                <Form.Item
                  name="Editstatus"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่สถานะการใช้งานใหม่!",
                    },
                  ]}
                >
                  <Select placeholder="ใส่สถานะการใช้งาน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                ลักษณะสินค้า
                <Form.Item
                  name="Editfeature"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ลักษณะสินค้าใหม่!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="ใส่ลักษณะสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
                Remark :
                <Form.Item
                  name="Editremarks"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ Remarks ใหม่!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="ใส่ Remarks สินค้า" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    /////////////////////////////// Tab 3 ///////////////////////////////////////////
    {
      key: "3",
      label: "เพิ่มเติม",
      children: (
        <div>
          <Form
            form={formAdd}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                แนบไฟล์ :
                <Form.Item name="dragger" getValueFromEvent={normFile} noStyle>
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      คลิก หรือ ลาก ไฟล์ไปยังบริเวณนี้เพื่ออัปโหลด
                    </p>
                    <p className="ant-upload-hint">
                      รองรับการอัปโหลดครั้งเดียวหรือจำนวนมาก
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];
  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มประเภทสินค้า"
        okText="Create"
        cancelText="Cancel"
        width={1000}
        onCancel={onCancel}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >        
        <Card title=" เพิ่มสินค้าใหม่">
          <Tabs defaultActiveKey="1" items={item} />
        </Card>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขประเภทสินค้า"
        okText="Create"
        cancelText="Cancel"
        width={1000}
        onCancel={onCancel}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              submitEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Card title="แก้ใขข้อมูลสินค้า">
          <Tabs defaultActiveKey="1" items={itemEdit} />
        </Card>
      </Modal>
    );
  };
  
  return (
    <>
      <div className="layout-content">
        <Button type="primary" onClick={() => setOpenModalAdd(true)}>
          เพิ่มใบสั่งซื้อสินค้า
        </Button>
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllItem} rowKey="unitcode" />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal เลือกรหัสผู้ขาย 1*/}
      <Modal
        open={isShowModalSupcode}
        title="เลือกรหัสผู้ขาย"
        width={1000}
        style={{zIndex:1}}
        onCancel={() => setIsShowModalSupcode(false)}
      >
        <Table columns={columns} dataSource={AllItem} rowKey="unitcode" />
      </Modal>
      {/* Modal เลือกรหัสผู้ขาย 2 */}
      <Modal
        open={isShowModalProcode}
        title="เลือกรหัสผู้ผลิต"
        width={1000}
        style={{zIndex:1}}
        onCancel={() => setIsShowModalProcode(false)}
        footer={
          <Button onClick={() => setIsShowModalProcode(false)}>ปิด</Button>
        }
      >
        <Table columns={columns} dataSource={AllItem} rowKey="unitcode" />
      </Modal>
      {/* Modal เพิ่มสินค้า */}
      <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        />
      

      {/* Modal แก้ใขสินค้า */}
      <ModalEdit
          open={OpenModalEdit}
          onCancel={() => {
            setOpenModalEdit(false);
          }}
        />
      
    </>
  );
};

export default Items;

import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Space,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Select,
  Badge,
  // Divider,
  // DatePicker,
} from "antd";
import Swal from "sweetalert2";
import BusinessService from "../service/BusinessService";
import { business } from "../model/business.model";
function Employee() {
  const [AllUser, setAllUser] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มพนักงาน",
    confirmText: "ยืนยัน",
  });
  const [EmpDetail, setEmpDetail] = useState(business);
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  useEffect(() => {
    getBusiness();
  }, []);
  const { TextArea } = Input;
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
      title: "รหัสบริษัท",
      dataIndex: "businessno",
      key: "businessno",
      width: "15%",
      ...getColumnSearchProps("businessno"),
      sorter: (a, b) => a.businessno.length - b.businessno.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อบริษัท",
      dataIndex: "title_name",
      key: "title_name",
      width: "30%",
      ...getColumnSearchProps("title_name"),
      sorter: (a, b) => a.title_name.length - b.title_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel_phone",
      key: "tel_phone",
      width: "15%",
      ...getColumnSearchProps("tel_phone"),
      sorter: (a, b) => a.tel_phone.length - b.tel_phone.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: "10%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          style={{ cursor: "pointer" }}
          danger
          onClick={(e) => showEditModal(text.businessno)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const getBusiness = () => {
    BusinessService.getBusiness()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    BusinessService.getSupBusiness(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setEmpDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขข้อมูลลูกค้าบริษัท",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    BusinessService.addBusiness(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            getBusiness();
            setOpenModalManage(false);
            formAdd.resetFields();
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    BusinessService.editBusiness({ ...EmpDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });
            getBusiness();
            setOpenModalManage(false);
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        }
      })
      .catch((err) => {});
  };

  const onModalManageClose = async () => {
    // await setCardataDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
  };
  ////////////////////////////////
  const ModalManage = () => {
    return (
      <Modal
        open={openModalManage}
        title={actionManage.title}
        okText={actionManage.confirmText}
        cancelText="ยกเลิก"
        onCancel={() => onModalManageClose()}
        width={1200}
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
        <Form form={formManage} layout="vertical" autoComplete="off">
          <Card>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  label="รหัสลูกค้าบริษัท"
                  name="businessno"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ รหัสลูกค้าบริษัท ใหม่!",
                    },
                  ]}
                >
                  <Input
                    disabled={actionManage.action === "edit" ? true : false}
                    placeholder="รหัสลูกค้าบริษัท"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  label="คำนำหน้าชื่อ"
                  name="title_name"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ คำนำหน้าชื่อ ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="คำนำหน้าชื่อ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่อบริษัท"
                  name="business_name"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ ชื่อบริษัท ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อบริษัท" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  label="เลขประจำตัวผู้เสียภาษี"
                  name="taxno"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ เลขประจำตัวผู้เสียภาษี ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="เลขประจำตัวผู้เสียภาษี" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="อีเมล" name="email">
                  <Input placeholder="อีเมล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="ผู้ติดต่อ" name="contact_person">
                  <Input placeholder="ผู้ติดต่อ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="ติดต่อแผนก" name="contact_department">
                  <Input placeholder="ติดต่อแผนก" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="โทรศัพท์" name="tel_phone">
                  <Input placeholder="โทรศัพท์" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="มือถือ" name="tel_mobile">
                  <Input placeholder="มือถือ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="โทรสาร" name="fax">
                  <Input placeholder="โทรสาร" />
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
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item label="ที่อยู่" name="address">
                  <TextArea rows={3} placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item label="รหัสไปรษณีย์" name="zipcode">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item label="ที่อยู่จัดส่งสินค้า" name="shipping_address">
                  <TextArea rows={3} placeholder="ที่อยู่จัดส่งสินค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  label="รหัสไปรษณีย์ที่อยู่จัดส่งสินค้า"
                  name="shipping_zipcode"
                >
                  <Input placeholder="รหัสไปรษณีย์ที่อยู่จัดส่งสินค้า" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>รายการลูกค้าบริษัท</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มลูกค้าบริษัท",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มลูกค้าบริษัท
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllUser} />
            </Card>
          </Col>
        </Row>
      </div>

      {openModalManage && ModalManage()}
    </>
  );
}

export default Employee;

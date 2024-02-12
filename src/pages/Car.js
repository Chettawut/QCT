import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import Header from "../components/layout/PublicHeader";
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
  InputNumber,
} from "antd";
import Swal from "sweetalert2";
import UserService from "../service/UserService";
import { Userdata } from "../model/userdata.model";
function SR() {
  const [AllUser, setAllUser] = useState("");
  const [OpenModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [UserdataDetail, setUserdataDetail] = useState(Userdata);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มผู้ใช้งาน",
    confirmText: "ยืนยัน",
  });
  const [formAdd] = Form.useForm();
  const [formReset] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  useEffect(() => {
    GetUser();
  }, []);

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
      title: "User Code",
      dataIndex: "unitcode",
      key: "unitcode",
      hidden: "true",
      width: "10%",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "20%",
      ...getColumnSearchProps("username"),
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อ",
      dataIndex: "firstname",
      key: "firstname",
      width: "20%",
      ...getColumnSearchProps("firstname"),
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      key: "lastname",
      width: "20%",
      ...getColumnSearchProps("lastname"),
      sorter: (a, b) => a.lastname.length - b.lastname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      width: "20%",
      ...getColumnSearchProps("type"),
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          style={{ cursor: "pointer" }}
          danger
          onClick={(e) => showEditModal(text.code)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetUser = () => {
    UserService.getUser()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    document.body.style = "overflow: hidden !important;";
    UserService.getSupUser(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setUserdataDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขผู้ใช้งาน",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    UserService.addUser(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetUser();
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
    UserService.editUser({ ...UserdataDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetUser();
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
    await setUserdataDetail({});
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
          <Card title="เพิ่มข้อมูลรถ">
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ทะเบียนรถ
                <Form.Item
                  name="carno"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ทะเบียนรถ!",
                    },
                  ]}
                >
                  <Input placeholder="ทะเบียนรถ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ยี่ห้อ
                <Form.Item
                  name="brand"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ยี่ห้อ!",
                    },
                  ]}
                >
                  <Select size="large" placeholder="ยี่ห้อ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                รุ่น/ปี
                <Form.Item name="รุ่น/ปี">
                  <Input placeholder="รุ่น/ปี" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                สี
                <Form.Item name="color">
                  <Input placeholder="สี" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                เลขตัวรถ
                <Form.Item name="รุ่น/ปี">
                  <Input placeholder="เลขตัวรถ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                เลขตัวถัง
                <Form.Item name="color">
                  <Input placeholder="เลขตัวถัง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                เลขเครื่อง
                <Form.Item name="เลขเครื่อง">
                  <Input placeholder="เลขเครื่อง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                จังหวัด
                <Form.Item name="province">
                  <Input placeholder="จังหวัด" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                ประเภทรถ
                <Form.Item name="car_type">
                  <Select size="large" placeholder="ประเภทรถ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                วิ่งเฉลี่ยวันละ
                <Form.Item name="วิ่งเฉลี่ยวันละ">
                  <Input placeholder="วิ่งเฉลี่ยวันละ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                ความเร็วในการขับ
                <Form.Item name="ความเร็วในการขับ">
                  <Input placeholder="ความเร็วในการขับ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                การบรรทุก
                <Form.Item name="">
                  <Select
                    size="large"
                    placeholder="การบรรทุก"
                    options={[
                      {
                        value: "ไม่บรรทุก,โดยสารเท่านั้น",
                        label: "ไม่บรรทุก,โดยสารเท่านั้น",
                      },
                      {
                        value: "บรรทุกเป็นบางครั้ง,ไม่หนัก",
                        label: "บรรทุกเป็นบางครั้ง,ไม่หนัก",
                      },
                      {
                        value: "บรรทุกหนัก",
                        label: "บรรทุกหนัก",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                ความจุกระบอกสูบ
                <Form.Item name="ความจุกระบอกสูบ">
                  <Input placeholder="เลขความจุกระบอกสูบ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={4}>
                ลมยางล้อหน้า
                <Form.Item name="front_tire">
                  <InputNumber
                    style={{
                      width: 165,
                    }}
                    size="large"
                    placeholder="ลมยางล้อหน้า"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={4}>
                ลมยางล้อหลัง
                <Form.Item name="back_tire">
                  <InputNumber
                    style={{
                      width: 165,
                    }}
                    size="large"
                    placeholder="ลมยางล้อหลัง"
                  />
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
      <Header></Header>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>รถ</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มข้อมูลรถ
        </Button>

        {OpenModalResetPassword && (
          <Modal
            open={OpenModalResetPassword}
            title="แก้ไขรหัสผ่าน"
            width={500}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
            onOk={() => {
              UserService.resetPassword(
                formReset.getFieldValue("Resetpassword"),
                formReset.getFieldValue("Resetcode")
              )
                .then(async (res) => {
                  let { status, data } = res;
                  if (status === 200) {
                    if (data.status) {
                      await Swal.fire({
                        title: "<strong>สำเร็จ</strong>",
                        html: data.message,
                        icon: "success",
                      });

                      setOpenModalResetPassword(false);
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
            }}
            onCancel={() => setOpenModalResetPassword(false)}
          >
            <Form
              form={formReset}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public",
              }}
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={16} lg={16} xl={24}>
                  รหัสผ่านใหม่
                  <Form.Item name="Resetpassword">
                    <Input.Password placeholder="ใส่รหัสผ่านใหม่" />
                  </Form.Item>
                  <Form.Item name="Resetcode">
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}
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

export default SR;

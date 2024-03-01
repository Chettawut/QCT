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
} from "antd";
import Swal from "sweetalert2";
import UserService from "../service/UserService";
import { userdata } from "../model/userdata.model";
function User() {
  const [AllUser, setAllUser] = useState("");
  const [OpenModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [UserdataDetail, setUserdataDetail] = useState(userdata);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มผู้ใช้งาน",
    confirmText: "ยืนยัน",
  });
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
          formReset.setFieldValue("Resetcode", data.code);

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
            formManage.resetFields();
          } else {
            console.log(data.message);
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
    // await setUserdataDetail({});
    if (actionManage.action === "edit") {
      formManage.resetFields();
    }
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
        width={1000}
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
          <Form form={formManage} layout="vertical" autoComplete="off">
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label=" Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อผู้ใช้!",
                    },
                  ]}
                >
                  <Input
                    disabled={actionManage.action === "edit" ? true : false}
                    size="small"
                    placeholder="Username"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={
                  actionManage.action === "add"
                    ? { display: "inline" }
                    : { display: "none" }
                }
              >
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    actionManage.action === "add"
                      ? { required: true, message: "กรุณาใส่รหัสผ่าน!" }
                      : {},
                  ]}
                >
                  <Input.Password
                    disabled={actionManage.action === "edit" ? true : false}
                    size="small"
                    placeholder="Password"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={9}
                style={
                  actionManage.action === "edit"
                    ? { display: "inline" }
                    : { display: "none" }
                }
              >
                <Form.Item label="Password">
                  <Input.Password
                    disabled={actionManage.action === "edit" ? true : false}
                    size="small"
                    defaultValue="12345678"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={4}
                lg={4}
                xl={3}
                style={
                  actionManage.action === "edit"
                    ? { display: "inline" }
                    : { display: "none" }
                }
              >
                <Form.Item label="แก้ไขรหัสผ่าน">
                  <Button
                    style={{ width: 100 }}
                    onClick={() => {
                      setOpenModalResetPassword(true);
                    }}
                  >
                    แก้ไข
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่อจริง"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อจริง!",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อจริง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="นามสกุล"
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ชื่อนามสกุล!",
                    },
                  ]}
                >
                  <Input placeholder="นามสกุล" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="ตำแหน่ง" name="type">
                  <Select
                    style={{ height: 40 }}
                    options={[
                      { value: "Admin", label: "Admin" },
                      { value: "พนักงานขาย", label: "พนักงานขาย" },
                      { value: "ธุรการ", label: "ธุรการ" },
                      { value: "จัดซื้อ", label: "จัดซื้อ" },
                      { value: "ช่าง", label: "ช่าง" },
                      { value: "กรรมการ", label: "กรรมการ" },
                      { value: "ผู้จัดการสาขา", label: "ผู้จัดการสาขา" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="tel" label="เบอร์โทรศัพท์">
                  <Input placeholder="เบอร์โทรศัพท์" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  };

  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>ผู้ใช้ระบบ</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มผู้ใช้งาน",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มผู้ใช้งาน
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

export default User;

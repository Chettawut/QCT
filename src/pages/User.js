import { SearchOutlined } from "@ant-design/icons";
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
} from "antd";
import Swal from "sweetalert2";
import UserService from "../service/UserService";
import { Userdata } from "../model/Userdata.model";
function User() {
  const [AllUser, setAllUser] = useState("");
  // const [OpenModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [UserdataDetail, setUserdataDetail] = useState(Userdata);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มผู้ใช้งาน",
    confirmText: "Create",
  });
  const [formAdd] = Form.useForm();
  // const [formReset] = Form.useForm();
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
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => showEditModal(text.code)}
        >
          Edit
        </span>
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
            confirmText: "Edit",
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
        cancelText="Cancel"
        onCancel={() => onModalManageClose()}
        width={1000}
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
        <Form
          form={formManage}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Username
              <Form.Item name="username"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ใช้!",
                  },
                ]}
              >
                <Input placeholder="Username" style={{ height: 50 }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Password
              <Form.Item
                rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน!" }]}                
                style={actionManage.action === 'add' ? {display: 'inline'} : {display: 'none'}}>
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ชื่อจริง
              <Form.Item
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
              นามสกุล
              <Form.Item
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
              ประเภท
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุประเภท!",
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "User", label: "User" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              เบอร์โทรศัพท์
              <Form.Item name="tel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  return (
    <>
    <Header></Header>
      <div className="layout-content" style={{padding: 20}}>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มผู้ใช้งาน",
              confirmText: "Create",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มผู้ใช้งาน
        </Button>

        {/* {OpenModalResetPassword && (
          <Modal
            open={OpenModalResetPassword}
            title="แก้ไขรหัสผ่าน"
            width={1000}
            onOk={() => {
              UserService.resetPassword(formReset.getFieldValue("Resetpassword"),formReset.getFieldValue("Resetcode")).then(async (res) => {
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
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  Password
                  <Form.Item
                    name="Resetpassword"
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item name="Resetcode">
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )} */}
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table  size="small" columns={columns} dataSource={AllUser} />
            </Card>
          </Col>
        </Row>
      </div>

      {openModalManage && ModalManage()}
    </>
  );
}

export default User;

import React, { useRef, useState, useEffect } from "react";
import Header from "../components/layout/PublicHeader";
import { SearchOutlined } from "@ant-design/icons";
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
import Highlighter from "react-highlight-words";
// COMPONENT

// SERVICE
import EMPService from "../service/EmpService";

const Employee = () => {
  const [AllEmp, setAllEmp] = useState("");
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    GetEmp();
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

  const handleCloseModal = () => {
    
    setOpenModalAdd(false);
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
      title: "รหัสพนักงาน",
      dataIndex: "empcode",
      key: "empcode",
      width: "5%",
      ...getColumnSearchProps("empcode"),
      sorter: (a, b) => a.empcode.length - b.empcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "firstname",
      key: "firstname",
      width: "30%",
      ...getColumnSearchProps("firstname"),
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อเล่น",
      dataIndex: "nickname",
      key: "nickname",
      width: "10%",
      ...getColumnSearchProps("nickname"),
      sorter: (a, b) => a.nickname.length - b.nickname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "position",
      key: "position",
      width: "20%",
      ...getColumnSearchProps("position"),
      sorter: (a, b) => a.position.length - b.position.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      key: "tel",
      width: "20%",
      ...getColumnSearchProps("tel"),
      sorter: (a, b) => a.tel.length - b.tel.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "20%",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "แก้ใข",
      key: "operation",
      width: "15%",
      fixed: "right",
      render: (text) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => showEditModal(text.empcode)}
        >
          Edit
        </span>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetEmp = () => {
    EMPService.getEmp()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllEmp(data);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    EMPService.addEmp(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetEmp();
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
        }
      })
      .catch((err) => {});
  };

  // const submitEdit = (dataform) => {
  //   UserService.editUser(dataform)
  //     .then(async (res) => {
  //       let { status, data } = res;
  //       if (status === 200) {
  //         if (data.status) {
  //           await Swal.fire({
  //             title: "<strong>สำเร็จ</strong>",
  //             html: data.message,
  //             icon: "success",
  //           });

  //           GetUser();
  //           setOpenModalAdd(false);            
  //         } else {
  //           // alert(data.message)
  //           Swal.fire({
  //             title: "<strong>ผิดพลาด!</strong>",
  //             html: data.message,
  //             icon: "error",
  //           });
  //         }
  //       }
  //     })
  //     .catch((err) => {});
  // };

  const showEditModal = (data) => {
    EMPService.getSupEmp(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editusername", data.username);
          formEdit.setFieldValue("Editfirstname", data.firstname);
          formEdit.setFieldValue("Editlastname", data.lastname);
          formEdit.setFieldValue("Edittype", data.type);
          formEdit.setFieldValue("Edittel", data.tel);
          formEdit.setFieldValue("Editstatus", data.status);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขผู้ใช้งาน"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        width={1000}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              // formEdit.resetFields();
              // console.log(values)

              // submitEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={formEdit}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Username
              <Form.Item
                name="Editusername"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ใช้!",
                  },
                ]}
              >
                <Input placeholder="Username" style={{ height: 50 }} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              Password
              <Form.Item name="Editpassword">
                <Input.Password
                  defaultValue="123456789"
                  placeholder="Password"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item label="รีเซ็ต Password">
                <Button style={{ height: 40 }}>Reset</Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ชื่อจริง
              <Form.Item
                name="Editfirstname"
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
                name="Editlastname"
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
                name="Edittype"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อจริง!",
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
              <Form.Item name="Edittel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              สถานการใช้งาน
              <Form.Item
                name="Editstatususer"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "Y", label: "เปิดใช้งาน" },
                    { value: "N", label: "ปิดใช้งาน" },
                  ]}
                />
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
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>พนักงาน</h1>

        <br></br>

        <Button type="primary" onClick={() => setOpenModalAdd(true)}>
          เพิ่มพนักงาน
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllEmp} />
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        okButtonProps={{ style: { backgroundColor: "green" } }}
        open={OpenModalAdd}
        title="เพิ่มพนักงาน"
        okText="เพิ่ม"
        cancelText="ยกเลิก"
        onCancel={handleCloseModal}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              // formAdd.resetFields();
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        width={800}
        maskClosable={false}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="รหัสพนักงาน"
            name="idname"
            rules={[
              {
                required: true,
                message: "ใส่ รหัสพนักงาน ของคุณอีกครั้ง",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ชื่อ-นามสกุล"
            name="username"
            rules={[
              {
                required: true,
                message: "ใส่ ชื่อ-นามสกุล ของคุณอีกครั้ง",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ชื่อเล่น"
            name="nickname"
            rules={[
              {
                required: true,
                message: "ใส่ ชื่อเล่น ของคุณอีกครั้ง!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ตำแหน่ง"
            name="rank"
            rules={[
              {
                required: true,
                message: "ใส่ ตำแหน่ง ของคุณอีกครั้ง!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="เบอร์โทร"
            name="tol"
            rules={[
              {
                required: true,
                message: "ใส่ เบอร์โทร ของคุณอีกครั้ง!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <ModalEdit
        open={OpenModalEdit}
        onCancel={() => {
          setOpenModalEdit(false);
        }}
      />
    </>
  );
};

export default Employee;

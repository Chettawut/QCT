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
  Divider,
  InputNumber,
  Badge,
  // DatePicker,
} from "antd";
import Swal from "sweetalert2";
import EmpService from "../service/EmpService";
import { employee } from "../model/emp.model";
function Employee() {
  const [AllUser, setAllUser] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มพนักงาน",
    confirmText: "ยืนยัน",
  });
  const [EmpDetail, setEmpDetail] = useState(employee);
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  useEffect(() => {
    GetEmp();
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
      title: "รหัสพนักงาน",
      dataIndex: "empcode",
      key: "empcode",
      width: "15%",
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
      width: "15%",
      ...getColumnSearchProps("nickname"),
      sorter: (a, b) => a.nickname.length - b.nickname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "position",
      key: "position",
      width: "15%",
      ...getColumnSearchProps("position"),
      sorter: (a, b) => a.position.length - b.position.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      key: "tel",
      width: "15%",
      ...getColumnSearchProps("tel"),
      sorter: (a, b) => a.tel.length - b.tel.length,
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
          onClick={(e) => showEditModal(text.empcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetEmp = () => {
    EmpService.getEmp()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    EmpService.getSupEmp(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setEmpDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขข้อมูลพนักงาน",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    EmpService.addEmp(dataform)
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
    EmpService.editEmp({ ...EmpDetail, ...dataform })
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
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
                ชื่อ
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ ชื่อ ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                นามสกุล
                <Form.Item
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ นามสกุล ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="นามสกุล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ชื่อเล่น
                <Form.Item name="nickname">
                  <Input placeholder="ชื่อเล่น" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เลขประจำตัวประชาชน
                <Form.Item name="citizen_id">
                  <Input placeholder="เลขประจำตัวประชาชน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                วันเกิด
                <Form.Item name="dateofbirth">
                  <Input
                    style={{
                      width: 262,
                    }}
                    size="large"
                    placeholder="วันเกิด"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เบอร์โทร
                <Form.Item name="tel">
                  <Input placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เบอร์โทร (สำรอง)
                <Form.Item name="tel2">
                  <Input placeholder="เบอร์โทร (สำรอง)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={3}>
                สถานภาพ
                <Form.Item name="marital_status">
                  <Select
                    size="large"
                    placeholder="สถานภาพ"
                    showSearch
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: "โสด",
                        label: "โสด",
                      },
                      {
                        value: "แต่งงาน",
                        label: "แต่งงาน",
                      },
                      {
                        value: "หย่า",
                        label: "หย่า",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={3}>
                จำนวนบุตร
                <Form.Item name="no_of_children">
                  <InputNumber
                    style={{
                      width: 117,
                    }}
                    size="large"
                    placeholder="จำนวนบุตร"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={24}>
                ที่อยู่
                <Form.Item name="cur_address">
                  <TextArea rows={3} placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Divider />
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ระดับการศึกษาสูงสุด
                <Form.Item name="education">
                  <Input placeholder="ระดับการศึกษาสูงสุด" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ตำแหน่ง
                <Form.Item name="position">
                  <Input placeholder="ตำแหน่ง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                วันที่เริ่มเข้างาน
                <Form.Item name="dateofstart">
                  <Input
                    style={{
                      width: 262,
                    }}
                    size="large"
                    placeholder="วันที่เริ่มเข้างาน"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                วันที่ลาออก
                <Form.Item name="resign_date">
                  <Input
                    style={{
                      width: 262,
                    }}
                    size="large"
                    placeholder="วันที่ลาออก	"
                  />
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
          </Card>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>พนักงาน</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มพนักงาน",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มพนักงาน
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

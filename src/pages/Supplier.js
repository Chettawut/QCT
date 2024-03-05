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
  // DatePicker,
} from "antd";
import Swal from "sweetalert2";
import SupService from "../service/Supplier.service";
import { supplier } from "../model/sup.model";
function Supplier() {
  const [AllUser, setAllUser] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มพนักงาน",
    confirmText: "ยืนยัน",
  });
  const [SupDetail, setSupDetail] = useState(supplier);
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  useEffect(() => {
    GetSup();
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
      title: "รหัสผู้ขาย",
      dataIndex: "supcode",
      key: "supcode",
      width: "15%",
      ...getColumnSearchProps("supcode"),
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อผู้ขาย",
      dataIndex: "supname",
      key: "supname",
      width: "30%",
      ...getColumnSearchProps("supname"),
      sorter: (a, b) => a.supname.length - b.supname.length,
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
          onClick={(e) => showEditModal(text.supcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetSup = () => {
    SupService.getSupplier()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    SupService.getSupSupplier(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setSupDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขข้อมูลผู้ขาย",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    // console.log(dataform)
    SupService.addSupplier(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetSup();
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
    SupService.editSupplier({ ...SupDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });
            GetSup();
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
                  name="supcode"
                  label="รหัสผู้ขาย"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ รหัสผู้ขาย ใหม่!",
                    },
                  ]}
                >
                  <Input
                    disabled={actionManage.action === "edit" ? true : false}
                    placeholder="รหัสผู้ขาย"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="supname"
                  label="ชื่อผู้ขาย"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ ชื่อผู้ขาย ใหม่!",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อผู้ขาย" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="taxnumber" label="เลขที่ภาษี">
                  <Input placeholder="เลขที่ภาษี" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="เลขที่อยู่" name="idno">
                  <Input placeholder="เลขที่อยู่" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="ถนน" name="road">
                  <Input placeholder="ถนน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="subdistrict" label="ตำบล">
                  <Input placeholder="ตำบล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="district" label="อำเภอ">
                  <Input placeholder="อำเภอ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="province" label="จังหวัด">
                  <Input placeholder="จังหวัด" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="zipcode" label="รหัสไปไปรษณีย์">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col>{" "}
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="tel" label="เบอร์โทร">
                  <Input placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="fax" label="โทรสาร">
                  <Input placeholder="โทรสาร" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="email" label="อีเมล">
                  <Input placeholder="อีเมล" />
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
                <Form.Item label="สถานการใช้งาน" name="statussup">
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
        <h1>ผู้ขาย</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มผู้ขาย",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มผู้ขาย
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

export default Supplier;

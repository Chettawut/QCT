import { SearchOutlined, ToolTwoTone, ClearOutlined } from "@ant-design/icons";
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
  Checkbox,
  Flex,
  Collapse,
  message,
} from "antd";
import Swal from "sweetalert2";
import CustomerService from "../service/Customer.service";
import { PROVINCE_OPTIONS } from "../utils/util";

const customerService = CustomerService();
function Customer() {
  const [AllCustomer, setAllCustomer] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "create",
    title: "เพิ่มลูกค้า",
    confirmText: "ยืนยัน",
  });
  const [form] = Form.useForm();
  const [formManage] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const { TextArea } = Input;

  const [activeSearch, setActiveSearch] = useState([]);
  useEffect(() => {
    getCustomer({});
  }, []);
  const CollapseItemSearch = () => {
    return (
      <>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="รหัสลูกค้า"
                name="cuscode"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่รหัสลูกค้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="ชื่อ-นามสกุลลูกค้า"
                name="cusname"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่ชื่อ-นามสกุลลูกค้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="เบอร์โทร"
                name="tel"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่เบอร์โทร" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={8} md={12} lg={12} xl={12}>
              {/* Ignore */}
            </Col>
            <Col xs={24} sm={8} md={12} lg={12} xl={12}>
              <Flex justify="flex-end" gap={8}>
                <Button
                  type="primary"
                  size="small"
                  className="bn-action"
                  icon={<SearchOutlined />}
                  onClick={() => handleSearch()}
                >
                  ค้นหา
                </Button>
                <Button
                  type="primary"
                  size="small"
                  className="bn-action"
                  danger
                  icon={<ClearOutlined />}
                  onClick={() => handleClear()}
                >
                  ล้าง
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </>
    );
  };
  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => {
        setActiveSearch(e);
      }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: (
            <>
              <SearchOutlined />
              <span> ค้นหา</span>
            </>
          ),
          children: CollapseItemSearch(),
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );
  const handleSearch = () => {
    form.validateFields().then((v) => {
      const data = { ...v };
      getCustomer(data);
    });
  };

  const handleClear = () => {
    form.resetFields();
    handleSearch();
  };

  const handleSearchColumn = (selectedKeys, confirm, dataIndex) => {
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
          onPressEnter={() =>
            handleSearchColumn(selectedKeys, confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchColumn(selectedKeys, confirm, dataIndex)}
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
      title: "รหัสลูกค้า",
      dataIndex: "cuscode",
      key: "cuscode",
      width: "20%",
      ...getColumnSearchProps("cuscode"),
      sorter: (a, b) => a.cuscode.length - b.cuscode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "firstname",
      key: "firstname",
      width: "40%",
      ...getColumnSearchProps("firstname"),
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "หมายเลขบัตรประชาชน",
      dataIndex: "citizen_id",
      key: "citizen_id",
      width: "20%",
      ...getColumnSearchProps("citizen_id"),
      sorter: (a, b) => a.citizen_id.length - b.citizen_id.length,
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
      title: "Action",
      key: "operation",
      width: "10%",
      fixed: "right",
      render: (text) => (
        <Button
          size="small"
          icon={
            <ToolTwoTone twoToneColor="#E74C3C" style={{ fontSize: ".9rem" }} />
          }
          danger
          onClick={(e) => showEditModal(text.cuscode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const getCustomer = (data) => {
    customerService
      .search(data)
      .then((res) => {
        const { data } = res.data;
        // console.log(data)

        setAllCustomer(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const showAddModal = () => {
    customerService
      .getcode()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formManage.setFieldsValue({
            cuscode: data,
          });
          setActionManage({
            action: "create",
            title: "เพิ่มลูกค้า",
            confirmText: "เพิ่ม",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    customerService
      .get(data)
      .then((res) => {
        const { data } = res.data;
        formManage.setFieldsValue(data);
        setActionManage({
          action: "edit",
          title: "แก้ไขข้อมูลลูกค้า",
          confirmText: "แก้ใข",
        });
        setOpenModalManage(true);
      })
      .catch((err) => {});
  };

  const manageSubmit = (v) => {
    const action =
      actionManage?.action !== "create"
        ? customerService.update
        : customerService.create;

    action({ ...v })
      .then(async (_) => {
        getCustomer({});
        let datamessage;
        actionManage?.action !== "create"
          ? (datamessage = "แก้ไข ลูกค้า สำเร็จ")
          : (datamessage = "เพิ่ม ลูกค้า สำเร็จ");
        await Swal.fire({
          title: "<strong>สำเร็จ</strong>",
          html: datamessage,
          icon: "success",
        });
        formManage.resetFields();
      })
      .catch((err) => {
        console.warn(err);
        const data = err?.response?.data;
        message.error(data?.message || "error request");
      })
      .finally(() => {
        setOpenModalManage(false);
      });
  };

  const onModalManageClose = async () => {
    // await setCardataDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
  };
  ////////////////////////////////
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
              manageSubmit(values);
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
                  label="รหัสลูกค้าบุคคล"
                  name="cuscode"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ รหัสลูกค้าบุคคล ใหม่!",
                    },
                  ]}
                >
                  <Input disabled placeholder="รหัสลูกค้าบุคคล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="คำนำหน้าชื่อ" name="title_name">
                  <Select
                    size="large"
                    showSearch
                    filterOption={filterOption}
                    options={[
                      {
                        value: "0",
                        label: "นาย",
                      },
                      {
                        value: "1",
                        label: "นาง",
                      },
                      {
                        value: "2",
                        label: "นางสาว",
                      },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  label="ชื่อ"
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
                <Form.Item
                  label="นามสกุล"
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
                <Form.Item label="เลขประจำตัวประชาชน" name="citizen_id">
                  <Input placeholder="เลขประจำตัวประชาชน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="เบอร์โทร" name="tel">
                  <Input placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="อีเมล" name="email">
                  <Input placeholder="อีเมล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="รหัสไปรษณีย์" name="zipcode">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col> 
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="ที่อยู่" name="address">
                  <TextArea rows={3} placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  name="province"
                  label="จังหวัด"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาระบุจังหวัด!",
                    },
                  ]}
                >
                  <Select style={{ height: 40 }} showSearch
                    filterOption={filterOption} options={PROVINCE_OPTIONS} />
                </Form.Item>
              </Col>

              </Row>
              <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="หมายเหตุ" name="remark">
                  <TextArea rows={3} placeholder="หมายเหตุ" />
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
          </Card>
        </Form>
      </Modal>
    );
  };
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));
  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>ลูกค้าบุคคล</h1>
        {FormSearch}
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            showAddModal();
          }}
        >
          เพิ่มลูกค้า
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Checkbox.Group
                style={{ padding: 15 }}
                value={checkedList}
                options={options}
                onChange={(value) => {
                  setCheckedList(value);
                }}
              />
              <Table
                rowSelection={{
                  type: "radio",
                }}
                size="small"
                columns={newColumns}
                dataSource={AllCustomer}
                rowKey="cuscode"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {openModalManage && ModalManage()}
    </>
  );
}

export default Customer;

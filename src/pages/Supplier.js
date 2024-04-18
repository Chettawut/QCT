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
  Collapse,
  Flex,
  message,
} from "antd";
import Swal from "sweetalert2";
import SupplierService from "../service/Supplier.service";
import TextArea from "antd/es/input/TextArea";

const supplierService = SupplierService();
function Supplier() {
  const [AllSupplier, setAllSupplier] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "create",
    title: "เพิ่มผู้ขาย",
    confirmText: "ยืนยัน",
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  const [form] = Form.useForm();
  const [activeSearch, setActiveSearch] = useState([]);
  useEffect(() => {
    GetSup();
  }, []);
  const handleSearch = () => {
    form.validateFields().then((v) => {
      const data = { ...v };
      GetSup(data);
    });
  };
  const handleSearchColumn = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleClear = () => {
    form.resetFields();
    handleSearchColumn();
  };
  const CollapseItemSearch = () => {
    return (
      <>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="รหัสผู้ขาย"
                name="supcode"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่รหัสผู้ขาย" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="ชื่อผู้ขาย"
                name="supname"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่ชื่อผู้ขาย" />
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
      title: "รหัสผู้ขาย",
      dataIndex: "supcode",
      key: "supcode",
      width: "20%",
      ...getColumnSearchProps("supcode"),
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อผู้ขาย",
      dataIndex: "supname",
      key: "supname",
      width: "45%",
      ...getColumnSearchProps("supname"),
      sorter: (a, b) => a.supname.length - b.supname.length,
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
      width: "15%",
      fixed: "right",
      render: (text) => (
        <Button
          size="small"
          icon={
            <ToolTwoTone twoToneColor="#E74C3C" style={{ fontSize: ".9rem" }} />
          }
          danger
          onClick={(e) => showEditModal(text.supcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);
  const GetSup = (data) => {
    supplierService
      .search(data)
      .then((res) => {
        const { data } = res.data;
        // console.log(data)

        setAllSupplier(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };
  const showAddModal = () => {
    supplierService
      .getcode()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formManage.setFieldsValue({
            supcode: data,
          });
          setActionManage({
            action: "create",
            title: "เพิ่มผู้ขาย",
            confirmText: "เพิ่ม",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };
  const showEditModal = (data) => {
    supplierService
      .get(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
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
  const manageSubmit = (v) => {
    const action =
      actionManage?.action !== "create"
        ? supplierService.update
        : supplierService.create;

    action({ ...v })
      .then((_) => {
        GetSup({});
      })
      .catch((err) => {
        console.warn(err);
        const data = err?.response?.data;
        message.error(data?.message || "error request");
      })
      .finally(async () => {
        let datamessage;
        actionManage?.action !== "create"
          ? (datamessage = "แก้ไข Supplier สำเร็จ")
          : (datamessage = "เพิ่ม Supplier สำเร็จ");
        await Swal.fire({
          title: "<strong>สำเร็จ</strong>",
          html: datamessage,
          icon: "success",
        });
        formManage.resetFields();
        setOpenModalManage(false);
      });
  };
  const onModalManageClose = async () => {
    // await setCardataDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
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
                  name="supcode"
                  label="รหัสผู้ขาย"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ รหัสผู้ขาย ใหม่!",
                    },
                  ]}
                >
                  <Input disabled placeholder="รหัสผู้ขาย" />
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
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="zipcode" label="รหัสไปรษณีย์">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col>{" "}
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="tel" label="เบอร์โทร">
                  <Input placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="email" label="อีเมล">
                  <Input placeholder="อีเมล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="fax" label="โทรสาร">
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
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="ที่อยู่" name="address">
                  <TextArea rows={3} placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="หมายเหตุ" name="remark">
                  <TextArea rows={3} placeholder="ที่อยู่" />
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
        <Form form={form} layout="vertical" autoComplete="off">
          {FormSearch}
        </Form>
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "create",
              title: "เพิ่มผู้ขาย",
              confirmText: "เพิ่ม",
            });
            showAddModal();
          }}
        >
          เพิ่มผู้ขาย
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
                dataSource={AllSupplier}
                rowKey="supcode"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {openModalManage && ModalManage()}
    </>
  );
}

export default Supplier;

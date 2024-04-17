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
} from "antd";
import Swal from "sweetalert2";
import ItemtypeService from "../service/ItemType.service";
import { itemtype } from "../model/itemtype.model";

function Itemtype() {
  const [AllItemtype, setAllItemtype] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const [formManage] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [ItemtypeDetail, setItemtypeDetail] = useState(itemtype);
  const [formAdd] = Form.useForm();
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [activeSearch, setActiveSearch] = useState([]);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มประเภทสินค้า",
    confirmText: "Create",
  });

  useEffect(() => {
    GetItemtype();
  }, []);
  const handleClear = () => {
    form.resetFields();
    handleSearch();
  };
  const CollapseItemSearch = () => {
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="ชื่อประเภทสินค้า" name="created_by">
              <Input placeholder="ใส่ชื่อประเภทสินค้า" />
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
  const GetItemtype = () => {
    ItemtypeService.getItemType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllItemtype(data);
        }
      })
      .catch((err) => {});
  };
  const columns = [
    // {
    //   title: "typecode",
    //   dataIndex: "typecode",
    //   key: "typecode",
    //   width: "20%",
    //   ...getColumnSearchProps("typecode"),
    //   sorter: (a, b) => a.typecode.length - b.typecode.length,
    //   sortDirections: ["descend", "ascend"],
    // },
    {
      title: "ชื่อประเภทสินค้า",
      dataIndex: "typename",
      key: "typename",
      width: "50%",
      ...getColumnSearchProps("typename"),
      sorter: (a, b) => a.typename.length - b.typename.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "active_status",
      key: "active_status",
      width: "25%",
      ...getColumnSearchProps("active_status"),
      sorter: (a, b) => a.active_status.length - b.active_status.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => (
        <div>
          {data === "Y" ? (
            <Badge status="success" text="เปิดการใช้งาน" />
          ) : (
            <Badge status="error" text="ปิดการใช้การ" />
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "25%",
      fixed: "right",
      render: (text) => (
        <Button
          size="small"
          icon={
            <ToolTwoTone twoToneColor="#E74C3C" style={{ fontSize: ".9rem" }} />
          }
          danger
          onClick={(e) => showEditModal(text.typecode)}
        >
          แก้ไข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const showEditModal = (data) => {
    ItemtypeService.getSupItemType(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemtypeDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขหน่วยสินค้า",
            confirmText: "แก้ไข",
          });

          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    ItemtypeService.addItemType(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItemtype();
            setOpenModalManage(false);
            formAdd.resetFields();
          } else {
            Swal.fire({
              title: "<strong>" + data.message + "</strong>",
              html: "ผิดพลาด",
              icon: "error",
            });
          }
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
    ItemtypeService.editItemType({ ...ItemtypeDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItemtype();

            setOpenModalManage(false);
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
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

  const onModalManageClose = async () => {
    setItemtypeDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
    document.body.style = "overflow: visible !important;";
  };
  ////////////////////////////////

  const ModalManage = () => {
    return (
      <Modal
        open={openModalManage}
        title={actionManage.title}
        okText={actionManage.confirmText}
        cancelText="ยกเลิก"
        style={{ top: 20 }}
        width={1000}
        afterClose={() => formManage.resetFields()}
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
        <Form form={formManage} layout="vertical" autoComplete="off">
          <Card>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item
                  label="ใส่ชื่อประเภทสินค้า"
                  name="typename"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อหน่วยสินค้า",
                    },
                  ]}
                >
                  <Input placeholder="ใส่ชื่อประเภทสินค้า" />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={8}
                style={
                  actionManage.action === "edit"
                    ? { display: "inline" }
                    : { display: "none" }
                }
              >
                <Form.Item name="active_status" label="สถานะการใช้งาน">
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
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item name="typecode">
                  <Input type="hidden" />
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
        <h1>ประเภทสินค้า</h1>
        <Form form={form} layout="vertical" autoComplete="off">
          {FormSearch}
        </Form>
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มประเภทสินค้า",
              confirmText: "เพิ่ม",
            });
            formManage.resetFields();
            setOpenModalManage(true);
          }}
        >
          เพิ่มประเภทสินค้า
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
                dataSource={AllItemtype}
                rowKey="typecode"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal จัดการสินค้า */}
      {openModalManage && ModalManage()}
    </>
  );
}

export default Itemtype;

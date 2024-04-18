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
  Divider,
} from "antd";
import Swal from "sweetalert2";
import BusinessService from "../service/Business.service";

const businessService = BusinessService();
function Business() {
  const [AllBusiness, setAllBusiness] = useState("");
  const [actionManage, setActionManage] = useState({
    action: "create",
    title: "เพิ่มข้อมูลลูกค้าบริษัท",
    confirmText: "ยืนยัน",
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  const [form] = Form.useForm();
  const [activeSearch, setActiveSearch] = useState([]);
  const { TextArea } = Input;

  useEffect(() => {
    getBusiness();
  }, []);
  const { Option } = Select;
  const handleSearchColumn = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleSearch = () => {
    form.validateFields().then((v) => {
      const data = { ...v };
      getBusiness(data);
    });
  };
  const handleClear = () => {
    form.resetFields();
    handleSearch();
  };
  const CollapseItemSearch = () => {
    return (
      <>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="รหัสบริษัท"
                name="businessno"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่รหัสบริษัท" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                label="ชื่อบริษัท"
                name="businessno"
                onChange={() => handleSearch()}
              >
                <Input placeholder="ใส่ชื่อบริษัท" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={8}
              md={8}
              lg={8}
              xl={8}
              onChange={() => handleSearch()}
            >
              <Form.Item label="เบอร์โทร" name="tel">
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
      title: "รหัสบริษัท",
      dataIndex: "businessno",
      key: "businessno",
      width: "20%",
      ...getColumnSearchProps("businessno"),
      sorter: (a, b) => a.businessno.length - b.businessno.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อบริษัท",
      dataIndex: "title_name",
      key: "title_name",
      width: "40%",
      ...getColumnSearchProps("title_name"),
      sorter: (a, b) => a.title_name.length - b.title_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel_phone",
      key: "tel_phone",
      width: "20%",
      ...getColumnSearchProps("tel_phone"),
      sorter: (a, b) => a.tel_phone.length - b.tel_phone.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          size="small"
          icon={
            <ToolTwoTone twoToneColor="#E74C3C" style={{ fontSize: ".9rem" }} />
          }
          danger
          onClick={(e) => showEditModal(text.businessno)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const getBusiness = (data) => {
    businessService
      .search(data)
      .then((res) => {
        const { data } = res;
        // console.log(data)

        setAllBusiness(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const showEditModal = (data) => {
    businessService
      .get(data)
      .then((res) => {
        const { data } = res.data;
        formManage.setFieldsValue(data);
        setActionManage({
          action: "edit",
          title: "แก้ไขข้อมูลลูกค้าบริษัท",
          confirmText: "แก้ใข",
        });
        setOpenModalManage(true);
      })
      .catch((err) => {});
  };

  const manageSubmit = (v) => {
    const action =
      actionManage?.action !== "create"
        ? businessService.update
        : businessService.create;

    action({ ...v })
      .then((_) => {
        getBusiness({});
      })
      .catch((err) => {
        console.warn(err);
        const data = err?.response?.data;
        message.error(data?.message || "error request");
      })
      .finally( async (res) => {      
        let datamessage
        actionManage?.action !== "create"        
          ? datamessage="แก้ไขลูกค้าบริษัท สำเร็จจ"
          : datamessage="เพิ่มลูกค้าบริษัท สำเร็จ";
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: datamessage,
            icon: "success",
          });
          formManage.resetFields();
          setOpenModalManage(false);

      });
  };

  const showAddModal = () => {
    businessService.getcode()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formManage.setFieldsValue({
            businessno: data,
            business_branch: '1',
          });
          setActionManage({
            action: "create",
            title: "เพิ่มลูกค้าธุรกิจ",
            confirmText: "เพิ่ม",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };
  const onModalManageOpen = () => {
    formManage.setFieldsValue({
      business_branch: '1',
    });
    setActionManage({
      action: "add",
      title: "เพิ่มข้อมูลลูกค้า",
      confirmText: "เพิ่ม",
    });
    setOpenModalManage(true);
  };
  const onModalManageClose = async () => {
    // await setCardataDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
  };
  ////////////////////////////////
  const onGenderChange = (value) => {
    switch (value) {
      case "0":
        formManage.setFieldsValue({
          note: "สำนักงานใหญ่",
        });
        break;
      case "1":
        formManage.setFieldsValue({
          note: "ใส่รายละเอียดสาขา",
        });
        break;
      case "other":
        form.setFieldsValue({
          
        });
        break;
      default:
    }
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
                  <Select
                    size="large"
                    showSearch
                    filterOption={filterOption}
                    options={[
                      {
                        value: "0",
                        label: "บจก.",
                      },
                      {
                        value: "1",
                        label: "บมจ.",
                      },
                      {
                        value: "2",
                        label: "หจก.",
                      },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
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
            </Row>
            <Row gutter={[24, 0]}>
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
                <Form.Item label="ระบุสาขา" name="branch">
                  <Select size="large" allowClear onChange={onGenderChange}>
                    <Option value="0">สำนักงานใหญ่</Option>
                    <Option value="1">สาขา</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.branch !== currentValues.branch
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("branch") === "1" ? (
                      <Form.Item name="branch_details" label="รายละเอียดสาขา">
                        <Input />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[24, 0]}>
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
                <Form.Item label="อีเมล" name="email">
                  <Input placeholder="อีเมล" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item label="โทรสาร" name="fax">
                  <Input placeholder="โทรสาร" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item label="ที่อยู่" name="address">
                  <TextArea rows={2} placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Form.Item label="รหัสไปรษณีย์" name="zipcode">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item label="ที่อยู่จัดส่งสินค้า" name="shipping_address">
                  <TextArea rows={2} placeholder="ที่อยู่จัดส่งสินค้า" />
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
              <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <Form.Item label="หมายเหตุ" name="หมายเหตุ">
                  <TextArea rows={2} placeholder="หมายเหตุ" />
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
        <h1>รายการลูกค้าบริษัท</h1>
        {FormSearch}
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            onModalManageOpen();
          }}
        >
          เพิ่มลูกค้าบริษัท
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
                dataSource={AllBusiness}
                rowKey="businessno"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {openModalManage && ModalManage()}
    </>
  );
}

export default Business;

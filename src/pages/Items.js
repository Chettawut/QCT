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
  Collapse,
  Checkbox,
  Tabs,
  DatePicker,
  Divider,
  Form,
} from "antd";
import Highlighter from "react-highlight-words";
// COMPONENT
// SERVICE
import SRService from "../service/SRService";

const SR = () => {
  const [AllSR, setAllSR] = useState("");
  // const [formAdd] = Form.useForm();
  // const [OpenModalAdd, setOpenModalAdd] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // MODAL CONTROLLER
  const [isOpenModal, setIsOpenModal] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    GetSR();
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
      title: "หมายเลข",
      dataIndex: "srcode",
      key: "srcode",
      width: "20%",
      ...getColumnSearchProps("srcode"),
      sorter: (a, b) => a.srcode.length - b.srcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ลูกค้า",
      dataIndex: "srdate",
      key: "srdate",
      width: "20%",
      ...getColumnSearchProps("srdate"),
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "srdate",
      key: "srdate",
      width: "20%",
      ...getColumnSearchProps("srdate"),
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "จังหวัด",
      dataIndex: "srdate",
      key: "srdate",
      width: "20%",
      ...getColumnSearchProps("srdate"),
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "วันที่",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => text.srcode}
        >
          Edit
        </span>
      ),
    },
    {
      title: "ตัดสต๊อก",
      dataIndex: "srdate",
      key: "srdate",
      width: "20%",
      ...getColumnSearchProps("srdate"),
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "พิมพ์ VAT",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ตัดสต๊อก VAT",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => text.srcode}
        >
          Edit
        </span>
      ),
    },
    {
      title: "บิลออนไลน์",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ส่งด่วน",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการส่ง",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "จอง",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "พนักงานขาย",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สาขา",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
    },
  ].filter((item) => !item.hidden);

  const GetSR = () => {
    SRService.getSR()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSR(data);
        }
      })
      .catch((err) => {});
  };
  const Modaladdclose = () => {
    setIsOpenModal(false);
  };
  const Modaladdsubmit = () => {
    setIsOpenModal(false);
  };
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  const items = [
    {
      key: "1",
      label: "ข้อมูลพื้นฐาน",
      children: (
        <Form layout="vertical">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="1"
                label="ชื่อสินค้า"
                rules={[{ required: true, message: "กรุณาใส่ชื่อสินค้าใหม่!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                name="2"
                label="ประเภทสินค้า"
                rules={[
                  { required: true, message: "กรุณาใส่ประเภทสินค้าใหม่!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                name="3"
                label="หน่วยสั่งซื้อ"
                rules={[
                  { required: true, message: "กรุณาใส่หน่วยสั่งซื้อใหม่!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <Form.Item
              name="4"
              label="  Material code"
              rules={[
                { required: true, message: "กรุณาใส่ Material code ใหม่!" },
              ]}
            >
              <Input />
            </Form.Item>
            </Col>
            <Col
              style={{ paddingTop: 40 }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={12}
            >
              <Checkbox>ติดตามสต๊อก</Checkbox>
            </Col>
          </Row>

          <Divider />
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="5"
                label="ชื่อเปิดบิล VAT"
                rules={[{ required: true, message: "กรุณาใส่ชื่อเปิดบิล VAT ใหม่!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                name="6"
                label="ยี่ห้อ"
                rules={[
                  { required: true, message: "กรุณาใส่ยี่ห้อใหม่!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                name="7"
                label="ชื่อสินค้า/ดอก"
                rules={[
                  { required: true, message: "กรุณาใส่ชื่อ สินค้า/ดอก ใหม่!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      key: "2",
      label: "สต๊อก",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "ราคา",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <>
      <Header></Header>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>ระบบงานขาย</h1>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Collapse
              items={[
                {
                  key: "1",
                  label: "ตัวกรอง",
                  children: (
                    <Checkbox.Group
                      style={{
                        width: "100%",
                      }}
                      onChange={onChange}
                    >
                      <Row>
                        <Col
                          style={{ paddingTop: 9 }}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={9}
                        >
                          <Checkbox value="A">
                            มีของ (สต๊อกตั้งแต่ 1 ขึ้นไป)
                          </Checkbox>
                        </Col>
                        <Col
                          style={{ paddingTop: 9 }}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={6}
                        >
                          <Checkbox value="B">มีของในปีที่ระบุ</Checkbox>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                          <DatePicker
                            style={{ height: 40, width: 140 }}
                            picker="year"
                          />
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  ),
                },
              ]}
            />
          </Col>
        </Row>

        <br></br>
        <Button type="primary" onClick={() => setIsOpenModal(true)}>
          เพิ่มสินค้า
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllSR} />
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        open={isOpenModal}
        title="เพิ่มสินค้า"
        okText="Create"
        cancelText="Cancel"
        width={1000}
        onCancel={Modaladdclose}
        onOk={Modaladdsubmit}
        maskClosable={false}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}>
            รหัสสินค้า
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            ตย144531
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </>
  );
};

export default SR;

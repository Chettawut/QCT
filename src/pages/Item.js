import React, { useRef, useState, useEffect } from "react";
import Header from "./PublicHeader";
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

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  const items = [
    {
      key: "1",
      label: "ข้อมูลพื้นฐาน",
      children: "Content of Tab Pane 1",
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
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Checkbox value="A">A</Checkbox>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Checkbox value="B">B</Checkbox>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                          <Input size="small" />
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
        maskClosable={false}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}>
            หมายเลข
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

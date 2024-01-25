import React, { useRef, useState, useEffect } from "react";
import Header from "../pages/PublicHeader";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  Collapse,
  Radio,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
// COMPONENT
import { EditableRow, EditableCell } from "../components/table/TableEditAble";

// SERVICE
import ItemService from "../service/ItemService";
import SRService from "../service/SRService";

const SR = () => {
  const [AllSR, setAllSR] = useState("");
  const [itemList, setItemList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  // const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  // const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // MODAL CONTROLLER
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isShowModalItem, setIsShowModalItem] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    if (isShowModalItem) fetchItem();
  }, [isShowModalItem]);

  useEffect(() => {
    GetSR();
  }, []);

  const fetchItem = () => {
    ItemService.getAllItems()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemList(data);
        }
      })
      .catch((err) => {});
  };

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
          onClick={(e) => showEditModal(text.srcode)}
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
          onClick={(e) => showEditModal(text.srcode)}
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

  const defaultColumns = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "รหัสสินค้า",
      key: "productCode",
      dataIndex: "productCode",
    },
    {
      title: "ชื่อสินค้า",
      key: "productName",
      dataIndex: "productName",
    },
    {
      title: "จำนวน",
      key: "productQty",
      dataIndex: "productQty",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "หน่วย",
      align: "center",
      key: "productUnit",
      dataIndex: "productUnit",
    },
    {
      title: "ราคาซื้อ",
      key: "productPrice",
      dataIndex: "productPrice",
      align: "right",
      width: "10%",
    },
    {
      title: "ส่วนลด",
      key: "productDiscount",
      dataIndex: "productDiscount",
      align: "right",
      editable: true,
      width: "10%",
    },
    {
      title: "ราคาทั้งหมด",
      key: "productTotalPrice",
      dataIndex: "productTotalPrice",
      align: "right",
      render: (productTotalPrice) => productTotalPrice?.toLocaleString(),
    },
    {
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        selectedList.length >= 1 ? (
          <Button
            className="bt-icon"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record?.productCode)}
          />
        ) : null,
    },
  ];

  const components = {
    body: { row: EditableRow, cell: EditableCell },
  };

  const columnsOrder = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleDelete = (productCode) => {
    const newData = selectedList.filter(
      (item) => item?.productCode !== productCode
    );
    setSelectedList(newData);
  };

  const handleSave = (row) => {
    if (row?.productQty > 0) {
      const newData = [...selectedList];
      const index = newData.findIndex(
        (item) => row?.productCode === item?.productCode
      );
      const item = newData[index];
      row["productTotalPrice"] =
        row?.productQty * row?.productPrice - row?.productDiscount;
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setSelectedList(newData);
    }
  };

  const handleSelectedItem = (record) => {
    const newData = {
      productCode: record?.stcode,
      productName: record?.stname,
      productQty: 1,
      productUnit: record?.unit,
      productPrice: +record?.price,
      productDiscount: 0,
      productTotalPrice: +record?.price,
    };

    setIsShowModalItem(false);
    setSelectedList([...selectedList, newData]);
  };

  const checkDupItem = (itemCode) => {
    let isDup = false;
    selectedList.map((item) => {
      if (item?.productCode === itemCode) isDup = true;
      return item;
    });
    return isDup;
  };

  const resetData = () => {
    setItemList([]);
    setSelectedList([]);
  };

  const handleCloseModal = () => {
    resetData();
    setIsOpenModal(false);
  };

  const handleCreate = () => {
    // ==== CALL API TO CREATE SR HERE ==== //
    console.log("selectedList ==> ", selectedList);
    resetData();
    setIsOpenModal(false);
  };

  const selectItemColumn = [
    {
      title: "",
      key: "tools",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          className="bt-icon"
          icon={<PlusOutlined />}
          disabled={checkDupItem(record?.stcode)}
          onClick={() => handleSelectedItem(record)}
        />
      ),
    },
    {
      title: "รหัสสินค้า",
      key: "stcode",
      dataIndex: "stcode",
      width: "100px",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname",
      width: "50%",
    },
    {
      title: "ราคาต่อหน่วย",
      key: "price",
      dataIndex: "price",
      align: "right",
      render: (price) => {
        let nextPrice = parseFloat(price).toFixed(2);
        return nextPrice?.toLocaleString();
      },
    },
  ];

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

  const showEditModal = (data) => {
    SRService.getSupSR(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editusername", data.username);
          formEdit.setFieldValue("Editfirstname", data.firstname);
          formEdit.setFieldValue("Editlastname", data.lastname);
          formEdit.setFieldValue("Edittype", data.type);
          formEdit.setFieldValue("Edittel", data.tel);
          formEdit.setFieldValue("Editstatususer", data.statususer);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    // UserService.editUser(dataform)
    //   .then(async (res) => {
    //     let { status, data } = res;
    //     if (status === 200) {
    //       if (data.status === '1') {
    //         await Swal.fire({
    //           title: "<strong>สำเร็จ</strong>",
    //           html: data.message,
    //           icon: "success",
    //         });
    //         GetUser();
    //         setOpenModalAdd(false);
    //       } else {
    //         // alert(data.message)
    //         Swal.fire({
    //           title: "<strong>ผิดพลาด!</strong>",
    //           html: data.message,
    //           icon: "error",
    //         });
    //       }
    //     }
    //   })
    //   .catch((err) => {});
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
              submitEdit(values);
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
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <Header></Header>
      <div className="layout-content" style={{ padding: 20 }}>
        <h1>การรับสินค้า</h1>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Collapse
              items={[
                {
                  key: "1",
                  label: "ตัวกรองตามวันที่",
                  children: (
                    <Radio.Group onChange={onChange} value={value}>
                      <Row gutter={[24, 0]}>
                        <Col xs={24} sm={12} md={12} lg={12} xl={24}>
                          <Radio style={{ paddingTop: 6 }} value={1}>
                            เฉพาะวันนี้
                          </Radio>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12} xl={24}>
                          <Radio style={{ paddingTop: 6 }} value={4}>
                            ทั้งหมด
                          </Radio>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12} xl={3}>
                          <Radio style={{ paddingTop: 6 }} value={2}>
                            ตั้งแต่
                          </Radio>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                          <DatePicker format="DD-MM-YYYY" onChange={onChange} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={2}>
                          <p style={{ paddingTop: 6 }}>ถึง</p>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                          <DatePicker format="DD-MM-YYYY" onChange={onChange} />
                        </Col>
                      </Row>
                    </Radio.Group>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <br></br>
        <Button type="primary" onClick={() => setIsOpenModal(true)}>
          เพิ่มการรับสินค้า
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
        title="ใบสั่งซื้อสินค้า"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCloseModal}
        onOk={handleCreate}
        width={1000}
        maskClosable={false}
      >
        <Button
          type="primary"
          onClick={() => setIsShowModalItem(true)}
          style={{ marginBottom: 16, float: "right" }}
        >
          เพิ่มสินค้า
        </Button>

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={selectedList}
          columns={columnsOrder}
          pagination={false}
          rowKey="productCode"
        />
      </Modal>

      <Modal
        open={isShowModalItem}
        title="เลือกสินค้า"
        onCancel={() => setIsShowModalItem(false)}
        footer={<Button onClick={() => setIsShowModalItem(false)}>ปิด</Button>}
      >
        <Table
          rowClassName={() => "editable-row"}
          bordered
          dataSource={itemList}
          columns={selectItemColumn}
          rowKey="stcode"
        />
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

export default SR;

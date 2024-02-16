import { SearchOutlined } from "@ant-design/icons";
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
} from "antd";
import Swal from "sweetalert2";
import ItemTypeService from "../service/ItemTypeService";

const ProductType = () => {
  const [AllItemTypes, setAllItemTypes] = useState("");

  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  useEffect(() => {
    GetType();
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
      title: "Type Code",
      dataIndex: "typecode",
      key: "typecode",
      hidden: "true",
      width: "30%",
    },
    {
      title: "Type Name",
      dataIndex: "typename",
      key: "typename",
      width: "30%",
      ...getColumnSearchProps("typename"),
      sorter: (a, b) => a.typename.length - b.typename.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "statutype",
      key: "statutype",
      width: "20%",
      ...getColumnSearchProps("statutype"),
      sorter: (a, b) => a.statutype.length - b.statutype.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => showEditModal(text.typecode)}
        >
          Edit
        </span>
      ),
    },
  ].filter((item) => !item.hidden);

  const showEditModal = (data) => {
    ItemTypeService.getSupItemType(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Edittypename", data.typename);
          formEdit.setFieldValue("Editstatustype", data.statustype);
          formEdit.setFieldValue("Edittypecode", data.typecode);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    ItemTypeService.addItemType(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetType();
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
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    ItemTypeService.editItemType(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetType();

          setOpenModalEdit(false);
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

  ////////////////////////////////

  function GetType() {
    ItemTypeService.getItemType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllItemTypes(data);
        }
      })
      .catch((err) => {});
  }

  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มประเภทสินค้า"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={formAdd}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="Addtypename"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อประเภทสินค้า!",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อประเภทสินค้า" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขประเภทสินค้า"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
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
          <Form.Item
            name="Edittypename"
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อประเภทสินค้า",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อประเภทสินค้า" />
          </Form.Item>
          <Form.Item name="Editstatustype">
            <Select
              style={{ width: 120 }}
              // disabled={isEdit}
              options={[
                { value: "Y", label: "เปิดใช้งาน" },
                { value: "N", label: "ปิดใช้งาน" },
              ]}
            />
          </Form.Item>
          <Form.Item name="Edittypecode">
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  return (
    <>
      <div className="layout-content" style={{ padding: 20 }}>
      <h1>ประเภทสินค้า</h1>
        <Button
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          เพิ่มประเภทสินค้า
        </Button>
        <br></br>
        <br></br>
        <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        />
        <ModalEdit
          open={OpenModalEdit}
          onCancel={() => {
            setOpenModalEdit(false);
          }}
        />
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllItemTypes} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProductType;

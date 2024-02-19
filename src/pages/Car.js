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
  InputNumber,
  Divider,
  Badge,
} from "antd";
import Swal from "sweetalert2";
import UserService from "../service/UserService";
// import { Cardata } from "../model/cardata.model";
function Car() {
  const [AllUser, setAllUser] = useState("");
  // const [CardataDetail, setCardataDetail] = useState(Cardata);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มข้อมูลรถ",
    confirmText: "ยืนยัน",
  });
  const { Option } = Select;
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openModalManage, setOpenModalManage] = useState(false);
  const searchInput = useRef(null);
  const [formManage] = Form.useForm();
  useEffect(() => {
    GetUser();
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
      title: "ID ข้อมูลรถ",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id.length - b.id.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "carno",
      key: "carno",
      width: "20%",
      ...getColumnSearchProps("carno"),
      sorter: (a, b) => a.carno.length - b.carno.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      width: "15%",
      ...getColumnSearchProps("province"),
      sorter: (a, b) => a.province.length - b.province.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เจ้าของ",
      dataIndex: "cusno",
      key: "cusno",
      width: "20%",
      ...getColumnSearchProps("cusno"),
      sorter: (a, b) => a.cusno.length - b.cusno.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand",
      width: "10%",
      ...getColumnSearchProps("brand"),
      sorter: (a, b) => a.brand.length - b.brand.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "รุ่น/ปี",
      dataIndex: "car_model",
      key: "car_model",
      width: "10%",
      ...getColumnSearchProps("car_model"),
      sorter: (a, b) => a.car_model.length - b.car_model.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สี",
      dataIndex: "color",
      key: "color",
      width: "10%",
      ...getColumnSearchProps("color"),
      sorter: (a, b) => a.color.length - b.color.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: "5%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          style={{ cursor: "pointer" }}
          danger
          onClick={(e) => showEditModal(text.code)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetUser = () => {
    UserService.getUser()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    document.body.style = "overflow: hidden !important;";
    UserService.getSupUser(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          // setCardataDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขผู้ใช้งาน",
            confirmText: "แก้ใข",
          });
          setOpenModalManage(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    UserService.addUser(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetUser();
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
    // UserService.editUser({ ...CardataDetail, ...dataform })
    //   .then(async (res) => {
    //     let { status, data } = res;
    //     if (status === 200) {
    //       if (data.status) {
    //         await Swal.fire({
    //           title: "<strong>สำเร็จ</strong>",
    //           html: data.message,
    //           icon: "success",
    //         });
    //         GetUser();
    //         setOpenModalManage(false);
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
                <Form.Item name="businessno" label="ลักษณะรถ">
                  <Select size="large" allowClear>
                    <Option value="0">รถส่วนบุคคล</Option>
                    <Option value="1">รถบริษัท</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.businessno !== currentValues.businessno
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("businessno") === "0" ? (
                      <Form.Item name="cusno" label="รถส่วนบุคคล">
                        <Select
                          size="large"
                          placeholder="รถส่วนบุคคล"
                          showSearch
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={filterOption}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item name="business_car" label="รถบริษัท">
                        <Select
                          size="large"
                          placeholder="รถบริษัท"
                          showSearch
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={filterOption}
                        />
                      </Form.Item>
                    )
                  }
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
            <Divider />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ทะเบียนรถ
                <Form.Item
                  name="carno"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ทะเบียนรถ!",
                    },
                  ]}
                >
                  <Input placeholder="ทะเบียนรถ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ยี่ห้อ
                <Form.Item name="brand">
                  <Select
                    size="large"
                    placeholder="ยี่ห้อ"
                    showSearch
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: "BMW",
                        label: "BMW",
                      },
                      {
                        value: "HONDA",
                        label: "HONDA",
                      },
                      {
                        value: "MAZDA",
                        label: "MAZDA",
                      },
                      {
                        value: "TOYOTA",
                        label: "TOYOTA",
                      },
                      {
                        value: "NISSAN",
                        label: "NISSAN",
                      },
                      {
                        value: "ISUZU",
                        label: "ISUZU",
                      },
                      {
                        value: "MITSUBISHI",
                        label: "MITSUBISHI",
                      },
                      {
                        value: "ROVER",
                        label: "ROVER",
                      },
                      {
                        value: "AUDI",
                        label: "AUDI",
                      },
                      {
                        value: "BENZ",
                        label: "BENZ",
                      },
                      {
                        value: "VOLKSWAGEN",
                        label: "VOLKSWAGEN",
                      },
                      {
                        value: "OPEL",
                        label: "OPEL",
                      },
                      {
                        value: "HINO",
                        label: "HINO",
                      },
                      {
                        value: "FORD",
                        label: "FORD",
                      },
                      {
                        value: "KIA",
                        label: "KIA",
                      },
                      {
                        value: "SUZUKI",
                        label: "SUZUKI",
                      },
                      {
                        value: "SEAT",
                        label: "SEAT",
                      },
                      {
                        value: "VOLVO",
                        label: "VOLVO",
                      },
                      {
                        value: "HOLDEN",
                        label: "HOLDEN",
                      },
                      {
                        value: "HYUNDAI",
                        label: "HYUNDAI",
                      },
                      {
                        value: "DAEWOO",
                        label: "DAEWOO",
                      },
                      {
                        value: "DAIHATSU",
                        label: "DAIHATSU",
                      },
                      {
                        value: "PEUGEOT",
                        label: "PEUGEOT",
                      },
                      {
                        value: "LAND ROVER",
                        label: "LAND ROVER",
                      },
                      {
                        value: "CHEVROLET",
                        label: "CHEVROLET",
                      },
                      {
                        value: "DATSUN",
                        label: "DATSUN",
                      },
                      {
                        value: "FIAT",
                        label: "FIAT",
                      },
                      {
                        value: "CITROEN",
                        label: "CITROEN",
                      },
                      {
                        value: "JEEP",
                        label: "JEEP",
                      },
                      {
                        value: "SSAGYONG",
                        label: "SSAGYONG",
                      },
                      {
                        value: "LEXUS",
                        label: "LEXUS",
                      },
                      {
                        value: "SUBARU",
                        label: "SUBARU",
                      },
                      {
                        value: "RENAULT",
                        label: "RENAULT",
                      },
                      {
                        value: "SAAB",
                        label: "SAAB",
                      },
                      {
                        value: "MINI",
                        label: "MINI",
                      },
                      {
                        value: "PROTON",
                        label: "PROTON",
                      },
                      {
                        value: "SKODA",
                        label: "SKODA",
                      },
                      {
                        value: "CHRYSLER",
                        label: "CHRYSLER",
                      },
                      {
                        value: "WULING",
                        label: "WULING",
                      },
                      {
                        value: "HUMBER",
                        label: "HUMBER",
                      },
                      {
                        value: "TATA",
                        label: "TATA",
                      },
                      {
                        value: "ALFA ROMEO",
                        label: "ALFA ROMEO",
                      },
                      {
                        value: "DFM",
                        label: "DFM",
                      },
                      {
                        value: "PORSCHE",
                        label: "PORSCHE",
                      },
                      {
                        value: "THAIRUNG",
                        label: "THAIRUNG",
                      },
                      {
                        value: "VOLK",
                        label: "VOLK",
                      },
                      {
                        value: "NAZA",
                        label: "NAZA",
                      },
                      {
                        value: "JAGUAR",
                        label: "JAGUAR",
                      },
                      {
                        value: "สามล้อ",
                        label: "สามล้อ",
                      },
                      {
                        value: "BENTLEY",
                        label: "BENTLEY",
                      },
                      {
                        value: "RELY",
                        label: "RELY",
                      },
                      {
                        value: "CHERRY",
                        label: "CHERRY",
                      },
                      {
                        value: "MG",
                        label: "MG",
                      },
                      {
                        value: "MERCEDES-BENZ",
                        label: "MERCEDES-BENZ",
                      },
                      {
                        value: "HAMMER",
                        label: "HAMMER",
                      },
                      {
                        value: "HAVAL",
                        label: "HAVAL",
                      },
                      {
                        value: "NETA",
                        label: "NETA",
                      },
                      {
                        value: "ORA",
                        label: "ORA",
                      },
                      {
                        value: "BYD",
                        label: "BYD",
                      },
                      {
                        value: "TESIA",
                        label: "TESIA",
                      },
                      {
                        value: "BOMA",
                        label: "BOMA",
                      },
                      {
                        value: "YARIS",
                        label: "YARIS",
                      },
                      {
                        value: "TESLA",
                        label: "TESLA",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                รุ่น/ปี
                <Form.Item name="car_model">
                  <Select
                    size="large"
                    placeholder="รุ่น/ปี"
                    showSearch
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                สี
                <Form.Item name="color">
                  <Input placeholder="สี" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เลขตัวรถ
                <Form.Item name="modelcode">
                  <Input placeholder="เลขตัวรถ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เลขตัวถัง
                <Form.Item name="car_chassisno">
                  <Input placeholder="เลขตัวถัง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                เลขเครื่อง
                <Form.Item name="car_engineno">
                  <Input placeholder="เลขเครื่อง" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                จังหวัด
                <Form.Item name="province">
                  <Select
                    size="large"
                    placeholder="จังหวัด"
                    showSearch
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ลักษณะรถ
                <Form.Item name="car_type">
                  <Select
                    size="large"
                    placeholder="ประเภทรถ"
                    showSearch
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: "เก๋ง",
                        label: "เก๋ง",
                      },
                      {
                        value: "กระบะ",
                        label: "กระบะ",
                      },
                      {
                        value: "4WD",
                        label: "4WD",
                      },
                      {
                        value: "รถบรรทุก",
                        label: "รถบรรทุก",
                      },
                      {
                        value: "บรรทุกกลาง,ใหญ่",
                        label: "บรรทุกกลาง,ใหญ่",
                      },
                      {
                        value: "ตู้,แวน",
                        label: "ตู้,แวน",
                      },

                      {
                        value: "จักรยานยนต์",
                        label: "จักรยานยนต์",
                      },
                      {
                        value: "บัส",
                        label: "บัส",
                      },
                      {
                        value: "โดยสารประจำทาง(Taxi,สองแถว,สมล้อ)",
                        label: "โดยสารประจำทาง(Taxi,สองแถว,สมล้อ)",
                      },
                      {
                        value: "โดยสารไม่ประจำทาง(Taxi,สองแถว,สมล้อ)",
                        label: "โดยสารไม่ประจำทาง(Taxi,สองแถว,สมล้อ)",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ความจุกระบอกสูบ
                <Form.Item name="car_cc">
                  <Input placeholder="เลขความจุกระบอกสูบ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                วิ่งเฉลี่ยวันละ
                <Form.Item name="avg_daydistance">
                  <Input placeholder="วิ่งเฉลี่ยวันละ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                ความเร็วในการขับ
                <Form.Item name="car_speed">
                  <Select
                    size="large"
                    placeholder="ความเร็วในการขับ"
                    options={[
                      {
                        value: "ไม่เกิน 100 กม./ชม.",
                        label: "ไม่เกิน 100 กม./ชม.",
                      },
                      {
                        value: "ไม่เกิน 140 กม./ชม.",
                        label: "ไม่เกิน 140 กม./ชม.",
                      },
                      {
                        value: "เกิน 140 กม./ชม.",
                        label: "เกิน 140 กม./ชม.",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                การบรรทุก
                <Form.Item name="car_loading">
                  <Select
                    size="large"
                    placeholder="การบรรทุก"
                    options={[
                      {
                        value: "ไม่บรรทุก,โดยสารเท่านั้น",
                        label: "ไม่บรรทุก,โดยสารเท่านั้น",
                      },
                      {
                        value: "บรรทุกเป็นบางครั้ง,ไม่หนัก",
                        label: "บรรทุกเป็นบางครั้ง,ไม่หนัก",
                      },
                      {
                        value: "บรรทุกหนัก",
                        label: "บรรทุกหนัก",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={3}>
                ลมยางล้อหน้า
                <Form.Item name="front_tire">
                  <InputNumber
                    style={{
                      width: 117,
                    }}
                    size="large"
                    placeholder="ลมยางล้อหน้า"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={3}>
                ลมยางล้อหลัง
                <Form.Item name="back_tire">
                  <InputNumber
                    style={{
                      width: 117,
                    }}
                    size="large"
                    placeholder="ลมยางล้อหลัง"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                หมายเหตุ
                <Form.Item name="remark">
                  <TextArea rows={2} placeholder="หมายเหตุ" />
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
        <h1>รถ</h1>
        <Button
          type="primary"
          onClick={() => {
            setActionManage({
              action: "add",
              title: "เพิ่มข้อมูลรถ",
              confirmText: "เพิ่ม",
            });
            setOpenModalManage(true);
          }}
        >
          เพิ่มข้อมูลรถ
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

export default Car;

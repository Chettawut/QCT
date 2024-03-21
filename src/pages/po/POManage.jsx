/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  Row,
  Space,
  Table,
  message,
  Spin,
  Select,
} from "antd";
import { Form, DatePicker } from "antd";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalItem } from "../../components/modal/itemPO/modal-packaging";

import { SaveFilled, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import POService from "../../service/PO.service";
import UnitService from "../../service/Unit.service";
import { delay } from "../../utils/util";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPackageSearch } from "react-icons/lu";

import {
  columnsDetailsEditable,
  componentsEditable,
} from "./purchase-order.model";
import ModalPackingSetGroup from "../../components/modal/packing-set/ModalPackingSetGroup";
const POServices = POService();

function POManage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };

  const [form] = Form.useForm();

  const [formDetail, setFormDetail] = useState({});
  const [listDetail, setListDetail] = useState([]);
  const [listOption, setListOption] = useState([]);

  const [openModalPackaging, setOpenModalPackaging] = useState(false);
  const [openModalPackingSetGroup, setOpenModalPackingSetGroup] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const handleChoosePackaging = (value) => {
    //setItemsData(value);
    // console.log(value);
    const item = value.map((m) => ({
      ...m,
      stcode: m?.stcode || null,
      stname: m?.stname || null,
      amount: 1,
      unit: m?.unit || null,
      price: m?.price || null,
      discount: 0,
      totalprice: 1 * m?.price,
    }));

    // console.log(item);
    setListDetail(item);
  };

  const handleChooseSupplier = (v) => {
    const f = form.getFieldsValue();
    // console.log(v);
    const val = {
      ...formDetail,
      ...f,
      supcode: v.supcode,
      supname: v.supname,
      address: v.address,
    };

    setFormDetail(val);
    form.setFieldsValue(val);
  };

  const handleConfirm = () => {
    form.validateFields().then((v) => {
      const header = { ...formDetail, ...v };

      const detail = [...listDetail];

      const parm = { header, detail };
      const actions =
        config?.action !== "create"
          ? POServices.update(parm)
          : POServices.create(parm);

      actions
        .then(async (r) => {
          message.success("Request success.");

          handleClose();
        })
        .catch((err) => {
          console.warn(err);
          const data = err?.response?.data;
          message.error(data?.message || "error request");
        });
    });
  };

  const handleSave = (row) => {
    const newData = (r) => {
      const itemDetail = [...listDetail];
      const newData = [...itemDetail];

      const ind = newData.findIndex((item) => r?.stcode === item?.stcode);
      if (ind < 0) return itemDetail;
      const item = newData[ind];
      newData.splice(ind, 1, {
        ...item,
        ...{
          ...r,
          cost:
            (Number(r?.stcode || 0) + Number(r?.stname || 0)) /
              (1 - Number(r?.lost || 0) / 100) || 0,
        },
      });
      return newData;
    };
    setListDetail([...newData(row)]);
  };

  const handleDelete = (code) => {
    const itemDetail = [...listDetail];
    const newData = itemDetail.filter((item) => item?.stcode !== code);
    setListDetail([...newData]);
    //setItemsData([...newData]);
  };

  const handleAction = (record) => {
    const itemDetail = [...listDetail];
    return itemDetail.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={
          <RiDeleteBin5Line style={{ fontSize: "1rem", marginTop: "3px" }} />
        }
        onClick={() => handleDelete(record?.stcode)}
        disabled={!record?.stcode}
      />
    ) : null;
  };

  const getlistOption = () => {
    return UnitService.getAllUnit().then((res) => {
      let { status, data } = res;
      if (status === 200) {
        setListOption(
          data.map((item) => ({
            value: item.unitname,
            label: item.unitname,
          }))
        );
      } else return [];
    });
  };

  const handleSelectChange = (value, record) => {
    // console.log(value,' ',record)
    const updatedDataSource = listDetail.map((item) => {
      console.log(item  ,' /X ',record)
      if (item.stcode === record.stcode) {
        return { ...item, unit: value };
      }
      return item;
    });
    setListDetail(updatedDataSource);
  };

  const handleClose = async () => {
    navigate("/purchase-order", { replace: true });
    await delay(300);
    console.clear();
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getsupData = (v) => {
    POServices.get(v)
      .then(async (res) => {
        const {
          data: { header, detail },
        } = res.data;

        const init = {
          ...header,
          podate: dayjs(header.podate),
          deldate: dayjs(header.deldate),
        };

        setFormDetail(init);
        form.setFieldsValue({ ...init });

        setListDetail([
          ...detail.map((r) => {
            // console.log(r);
            return {
              ...r,
              totalprice:
                Number(r?.amount || 0) * Number(r?.price || 0) -
                  (1 - Number(r?.discount || 0) / 100) || 0,
            };
          }),
        ]);
      })
      .catch((err) => {
        console.log(err);
        message.error("Error getting infomation Purchase Order.");
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
  };

  useEffect(() => {
    getlistOption();
    if (!config) {
      handleClose();
      return;
    }
    setLoading(true);
    if (config?.action !== "create") {
      getsupData(config.code);
    } else {
      POServices.getPOcode()
        .then((res) => {
          let { status, data } = res;
          if (status === 200) {
            form.setFieldValue("pocode", data);
          }
        })
        .catch((err) => {
          console.log(err);
          message.error("Request error!");
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        });
    }

    return () => {
      form.resetFields();
    };
  }, []);

  const column = columnsDetailsEditable(handleSave, {
    handleAction,
    filterOption,
    listOption,
    handleSelectChange,
  });

  const SectionTop = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target="/purchase-order" />
        </Flex>
      </Col>
      {/* <Col span={12} style={{paddingInline:0}}>  
            <Flex gap={4} justify='end'>
                { !!code && <ButtonUpload code={code} refer='Packaging' /> }
  
            </Flex>  
        </Col> */}
    </Row>
  );

  const SectionBottom = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target="/purchase-order" />
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );

  const TitleTable = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          {/* <Typography.Title className='m-0 !text-zinc-800' level={3}></Typography.Title> */}
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            icon={<LuPackageSearch style={{ fontSize: "1.2rem" }} />}
            className="bn-center justify-center bn-primary-outline"
            onClick={() => setOpenModalPackaging(true)}
          >
            เพิ่มสินค้า
          </Button>
        </Flex>
      </Col>
    </Flex>
  );

  const FormCol50 = ({ children, label, name }) => (
    <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
      <Form.Item label={label} name={name}>
        {children}
      </Form.Item>
    </Col>
  );

  return (
    <Spin spinning={loading}>
      <div id="packing-set-manage" className="px-0 sm:px-0 md:px-8 lg:px-8" style={{paddingLeft: 100, paddingTop: 20}}>
        <Space direction="vertical" className="flex gap-4">
          {SectionTop}
          <Flex className="width-100" vertical gap={4}>
            <Divider orientation="left" className="!my-0">
              Purchase Order
            </Divider>
            <Card>
              <Form form={form} layout="vertical" autoComplete="off">
                <Row gutter={[8, 8]} className="px-4 sm:px-0 md:px-0 lg:px-0">
                  <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <Form.Item label="เลขที่ PO" name="pocode" required={false}>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <Form.Item
                      label="รหัสผู้ขาย"
                      name="supcode"
                      rules={[
                        { required: true, message: "Please enter data!" },
                      ]}
                    >
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          readOnly
                          placeholder="Choose รหัสผู้ขาย"
                          value={!!formDetail.supcode ? formDetail.supcode : ""}
                        />
                        <Button
                          type="primary"
                          className="bn-primary"
                          icon={<SearchOutlined />}
                          style={{ minWidth: 40 }}
                          onClick={() => setOpenModalPackingSetGroup(true)}
                        ></Button>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item label="ชื่อผู้ขาย" name="supname">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                      label="ที่อยู่ผู้ขาย"
                      name="address"
                      required={false}
                    >
                      <Input
                        disabled
                        controls={false}
                        className="width-100 input-40"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <Form.Item
                      label="วันที่สั่งซื้อ :"
                      name="podate"
                      rules={[
                        { required: true, message: "Please input your data!" },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        defaultValue={dayjs()}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <Form.Item
                      label="วันที่นัดส่งของ :"
                      name="deldate"
                      rules={[
                        { required: true, message: "Please input your data!" },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        defaultValue={dayjs()}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <Form.Item label="การชำระเงิน" name="payment">
                      <Select
                        size="large"
                        showSearch
                        defaultValue={"เงินสด"}
                        filterOption={filterOption}
                        options={[
                          {
                            value: "เงินสด",
                            label: "เงินสด",
                          },
                          {
                            value: "30 วัน",
                            label: "30 วัน",
                          },
                          {
                            value: "45 วัน",
                            label: "45 วัน",
                          },
                          {
                            value: "60 วัน",
                            label: "60 วัน",
                          },
                          {
                            value: "90 วัน",
                            label: "90 วัน",
                          },
                          {
                            value: "120 วัน",
                            label: "120 วัน",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <FormCol50 label="ใบเสนอราคา" name="poqua">
                    <Input />
                  </FormCol50>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item label="Remark" name="remark">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Flex>
          <Flex className="width-100" vertical gap={4}>
            <Divider orientation="left" className="!my-0">
              Purchase Order Detail
            </Divider>
            <Card style={{ backgroundColor: "#f0f0f0" }}>
              <Table
                title={() => TitleTable}
                components={componentsEditable}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={listDetail}
                columns={column}
                pagination={false}
                rowKey="stcode"
                scroll={{ x: "max-content" }}
                locale={{
                  emptyText: (
                    <span>No data available, please add some data.</span>
                  ),
                }}
              />
            </Card>
          </Flex>

          {SectionBottom}
        </Space>
        {openModalPackaging && (
          <ModalItem
            show={openModalPackaging}
            close={() => {
              setOpenModalPackaging(false);
            }}
            values={(v) => {
              handleChoosePackaging(v);
            }}
            selected={listDetail}
          ></ModalItem>
        )}
        {openModalPackingSetGroup && (
          <ModalPackingSetGroup
            show={openModalPackingSetGroup}
            close={() => {
              setOpenModalPackingSetGroup(false);
            }}
            values={(v) => {
              handleChooseSupplier(v);
            }}
          />
        )}
      </div>
    </Spin>
  );
}

export default POManage;

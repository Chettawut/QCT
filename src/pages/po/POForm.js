/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./purchase-order.css";
import { Card, Form, message } from "antd";
import { Row, Col, Space, Table } from "antd";
import { Input, DatePicker, Button } from "antd";

import {
  SearchOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  srmaster,
  columnDetailEditable,
  componentsEditable,
} from "./purchase-order.model";
// import { formatCommaNumber } from "../../utils/util";

import { ModalItem } from "../../components/modal/item/modal-item";

import POService from "../../service/PO.service";
import dayjs from "dayjs";

import { useLoadingContext } from "../../store/context/loading-context";

// const TextArea = Input.TextArea;
export default function POForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { startLoading, stopLoading } = useLoadingContext();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();

  const [details, setDetails] = useState([]);
  
  const [isShowModalItem, setIsShowModalItem] = useState(false);
  const [formDetail, setFormDetail] = useState(srmaster);

  const [submited, setSubmited] = useState(false);

  // const [isOpenModal, setOpenModal] = useState(show);

  const hendleClose = () => {
    setTimeout(() => navigate("/purchase-order", { replace: true }), 400);
  };

  const gettingPOCode = () => {
    startLoading();
    POService.getPOcode()
      .then(async (res) => {
        const code = res.data;
        const year = dayjs().format("YY");
        const initialValues = {
          ...srmaster,
          srcode: `PO${year}/${code}`,
          srdate: dayjs(),
        };

        setFormDetail(initialValues);
        form.setFieldsValue(initialValues);
        stopLoading();
      })
      .catch((err) => {
        console.warn(err);
        const { message } = err.response;
        message.error(message || "error request");
        stopLoading();
      });
  };

  const gettingPurchaseOrderData = () => {
    // startLoading();
    POService.getPO()
      .then(async (res) => {
        const { details, master } = res.data.data;
        const initialValues = { ...srmaster, ...master };
        initialValues.srdate = dayjs(initialValues.srdate);
        initialValues.duedate = dayjs(initialValues.duedate);

        setFormDetail(initialValues);
        form.setFieldsValue(initialValues);

        setDetails(details);
        stopLoading();
      })
      .catch((err) => {
        // console.warn(err);
        const { data } = err.response;
        message.error(data?.message || "error request");
        stopLoading();
      });
  };


  useEffect(async () => {
    if (!config) {
      hendleClose();
      return;
    }

    if (config?.action !== "create") {
      gettingPurchaseOrderData();
    } else {
      gettingPOCode();
    }

    return () => {};
  }, []);

  const handleConfirm = () => {
    setSubmited(true);
    const sampleValidate =
      submited && (details.length < 1 || !!details.find((d) => !d.spname));
    if (sampleValidate) {
      message.warning("Warning: Please Add Sample Name");
      return;
    }
    form.validateFields().then((value) => {
      startLoading();
      const master = value;
      // const details = details;
      master.srdate = dayjs(master.srdate).format("YYYY-MM-DD");
      master.duedate = dayjs(master.duedate).format("YYYY-MM-DD");
      if (config.action === "create") {
        // SRService.create( {master, details} ).then( res => {
        //     message.success("Success: Create sample requerest done.");
        //     stopLoading();
        //     hendleClose();
        // })
        // .catch( err =>  {
        //     message.error("Error: Create sample requerest fail.");
        //     stopLoading();
        // });
      } else {
        // SRService.update( {master, details} ).then( res => {
        //     message.success("Success: Update sample requerest done.");
        //     stopLoading();
        //     hendleClose();
        // })
        // .catch( err =>  {
        //     message.error("Error: Update sample requerest fail.");
        //     stopLoading();
        // });
      }
    });
  };

  const handleChoosedItem = (value) => {
    setDetails([
      ...details,
      {
        seq: details.length + 1,
        spname: null,
        pkname: null,
        amount: null,
      },
    ]);
  };

  const handleSave = (row) => {
    const newData = (r) => {
      const newData = [...details];

      const ind = newData.findIndex((item) => row.seq === item?.seq);
      const item = newData[ind];

      newData.splice(ind, 1, {
        ...item,
        ...row,
      });
      return newData;
    };
    setDetails([...newData()]);
  };

  const handleModalSelect = (e, row) => {
    // isShowModalItem(true);
    // setModalPackageValue(row);
  };

  const handleDelete = (code, seq) => {
    const newData = details
      .filter((val) => val?.seq !== seq)
      .map((m, i) => ({ ...m, seq: i + 1 }));
      setDetails([...newData]);
  };

  const handleAction = (record) => {
    return details.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record?.paraname, record.seq)}
      />
    ) : null;
  };

  const handleAddSample = () => {
    setDetails([
      ...details,
      {
        seq: details.length + 1,
        spname: null,
        pkname: null,
        amount: null,
      },
    ]);
  };

  const details_column = columnDetailEditable(handleSave, handleModalSelect, {
    handleAction,
  });  

  /** settimg child component */
  const ButtonActionSrDetailLeft = (
    <Space
      gap="small"
      align="center"
      style={{ display: "flex", justifyContent: "start" }}
    >
      <Button
        style={{ width: 120 }}
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          hendleClose();
        }}
      >
        กลับ
      </Button>
    </Space>
  );

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
          position: "relative",
          paddingInline: "1.34rem",
        }}
        className="sample-request-modal"
      >
        <Row
          gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
          className="m-0"
        >
          <Col span={12} style={{ paddingInline: "0px" }}>
            {ButtonActionSrDetailLeft}
          </Col>
        </Row>
        <Card>
          <Form form={form} layout="vertical" autoComplete="off">
            <Row
              gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
              className="m-0"
            >
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Sample Request No :"
                  name="srcode"
                  rules={[
                    { required: true, message: "Please input your data!" },
                  ]}
                >
                  <Input readOnly placeholder="Sample No" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Sample Request Date :"
                  name="srdate"
                  rules={[
                    { required: true, message: "Please input your data!" },
                  ]}
                >
                  <DatePicker size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={4} lg={4} xl={3}>
                <Form.Item
                  label="รหัสลูกค้า :"
                  name="cuscode"
                  rules={[{ required: true, message: "Please choose data!" }]}
                >
                  <Input readOnly placeholder="รหัสลูกค้า" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={20} lg={8} xl={9}>
                <Form.Item
                  label="ชื่อลูกค้า :"
                  name="cusname"
                  rules={[{ required: true, message: "Please choose data!" }]}
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      readOnly
                      placeholder="ชื่อลูกค้า"
                      value={formDetail.cusname}
                    />
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      // onClick={() => setIsOpenModalCustomer(true)}
                      style={{ minWidth: 40 }}
                    ></Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Due Date :"
                  name="duedate"
                  rules={[
                    { required: true, message: "Please input your data!" },
                  ]}
                >
                  <DatePicker size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item label="Description :" name="description">
                  <Input.TextArea placeholder="Description" rows={5} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Button
          type="primary"
            onClick={() => setIsShowModalItem(true)}
          style={{ marginBottom: 16, float: "right" }}
        >
          เพิ่มสินค้า
        </Button>
        <Card>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", position: "relative" }}
            className="sample-request-modal"
          >
            {submited && !!details.find((d) => !d.spname)}
            <Table
              className={`table-require ${
                submited &&
                (details.length < 1 || !!details.find((d) => !d.spname))
                  ? "table-invalid"
                  : ""
              }`}
              components={componentsEditable}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={details || []}
              columns={details_column}
              pagination={false}
              rowKey="seq"
              locale={{
                emptyText: (
                  <span>No data available, please add some data.</span>
                ),
              }}
              scroll={{ x: "100%" }}
              size="small"
              summary={(val) => (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={1} colSpan={5}>
                      <Row>
                        <Col
                          span={24}
                          style={{ display: "flex", justifyContent: "center" }}
                          className="width-100 append-step"
                        >
                          <Button
                            shape="circle"
                            icon={<PlusCircleOutlined />}
                            style={{
                              width: "2.5rem",
                              boxShadow: "none",
                              lineHeight: "2.5rem",
                            }}
                            onClick={() => {
                              handleAddSample();
                            }}
                          ></Button>
                        </Col>
                      </Row>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )}
            />
          </Space>
        </Card>

        <Row>
          <Col span={12} style={{ display: "flex", justifyContent: "start" }}>
            {ButtonActionSrDetailLeft}
          </Col>
          <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              icon={<SaveOutlined style={{ fontSize: "1rem" }} />}
              type="primary"
              style={{ width: "9.5rem" }}
              onClick={() => {
                handleConfirm();
              }}
            >
              ยืนยันบันทึก
            </Button>
          </Col>
        </Row>
      </Space>      
      
      {isShowModalItem && (
        <ModalItem
          show={isShowModalItem}
          close={() => {
            setIsShowModalItem(false);
          }}
          values={(v) => {
            handleChoosedItem(v);
          }}
          selected={(v) => {
            handleChoosedItem(v);
          }}
        ></ModalItem>
      )}

    </>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "antd";
import { Collapse, Form, Flex, Row, Col, Space } from "antd";
import { Input, Button, Table, message, DatePicker, Typography } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { LuPackagePlus } from "react-icons/lu";
import { accessColumn } from "./purchase-order.model";

import dayjs from "dayjs";
import POService from "../../service/PO.service";

import { delay } from "../../utils/util";
const POServices = POService();
const mngConfig = {
  title: "",
  textOk: null,
  textCancel: null,
  action: "create",
  code: null,
};

const RangePicker = DatePicker.RangePicker;
const POAccess = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [accessData, setAccessData] = useState([]);
  const [activeSearch, setActiveSearch] = useState([]);

  const CollapseItemSearch = () => {
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Packing Set" name="packingset_name">
              <Input placeholder="Enter Packing Set Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Request Date." name="created_date">
              <RangePicker
                placeholder={["From Date", "To date"]}
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Request By." name="created_by">
              <Input placeholder="Enter First Name or Last Name." />
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
                Search
              </Button>
              <Button
                type="primary"
                size="small"
                className="bn-action"
                danger
                icon={<ClearOutlined />}
                onClick={() => handleClear()}
              >
                Clear
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
              <span> Search</span>
            </>
          ),
          children: CollapseItemSearch(),
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  const handleSearch = () => {
    form
      .validateFields()
      .then((v) => {
        const data = { ...v };
        if (!!data?.created_date) {
          const arr = data?.created_date.map((m) =>
            dayjs(m).format("YYYY-MM-DD")
          );
          const [created_form, created_to] = arr;
          //data.created_date = arr
          Object.assign(data, { created_form, created_to });
        }

        getData(data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };
  // console.log(form);
  const hangleAdd = () => {
    navigate("manage/create", {
      state: {
        config: { ...mngConfig, title: "Create Packing Set", action: "create" },
      },
    });
  };

  const handleEdit = (data) => {
    console.log(data)
    navigate("manage/edit", {
      state: {
        config: {
          ...mngConfig,
          title: "แก้ไข Purchase Order",
          action: "edit",
          code: data?.pocode,
        },
      },
      replace: true,
    });
  };

  const handleDelete = (data) => {
    // startLoading();
    POServices.deleted(data?.id)
      .then((_) => {
        const tmp = accessData.filter((d) => d.id !== data?.id);

        setAccessData([...tmp]);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const column = accessColumn({ handleEdit, handleDelete });

  const getData = (data) => {
    POServices.search(data)
      .then((res) => {
        const { data } = res.data;

        setAccessData(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const init = async () => {};

  useEffect(() => {
    init();

    getData({});
    return async () => {
      await delay(400);
      // console.clear();
    };
  }, []);
  const TitleTable = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={3}>
            ใบสั่งซื้อสินค้า (Purchase Order)
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            size="small"
            className="bn-action bn-center bn-primary-outline justify-center"
            icon={<LuPackagePlus style={{ fontSize: ".9rem" }} />}
            onClick={() => {
              hangleAdd();
            }}
          >
            เพิ่ม Purchase Order
          </Button>
        </Flex>
      </Col>
    </Flex>
  );
  return (
    <div className="pilot-scale-access" id="area">
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", position: "relative" }}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          {FormSearch}
        </Form>
        <Card>
          <Row gutter={[8, 8]} className="m-0">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Table
                title={() => TitleTable}
                size="small"
                rowKey="pocode"
                columns={column}
                dataSource={accessData}
                scroll={{ x: "max-content" }}
              />
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default POAccess;

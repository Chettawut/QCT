/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

import { Modal, Card, Table, message, Form, Button } from "antd";
import { Row, Col, Space, Spin, Flex } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

import { columns } from "./modal-packaging.model";
// import OptionService from '../../../service/Options.service';
import ItemService from "../../../service/Item.service";
import { BsUiChecks } from "react-icons/bs";

export default function ModalItem({ show, close, values, selected = [] }) {
  // const optionService = OptionService();
  const [form] = useForm();
  const inputRef = useRef(null);
  const [modalData, setModalData] = useState([]);
  const [modalDataWrap, setModalDataWrap] = useState([]);

  const [openModal, setOpenModel] = useState(show);
  const [loading, setLoading] = useState(true);

  const [rowKeySelect, setRowKeySelect] = useState([]);

  // console.log( itemsTypeData )

  /** handle logic component */
  const handleClose = () => {
    setTimeout(() => {
      close(false);
    }, 140);
  };

  const handleSearch = (value) => {
    if (!!value) {
      const f = modalData.filter((d) => {
        const text =
          d.stcode?.includes(value) ||
          d.pkname?.includes(value) ||
          d.expsname?.includes(value);
        return text;
      });
      setModalDataWrap(f);
    } else {
      setModalDataWrap(modalData);
    }
  };
  // }

  const handleChoose = () => {
    const choosed = selected.map((m) => m.stcode);
    const itemsChoose = modalData.filter(
      (f) => rowKeySelect.includes(f.stcode) && !choosed.includes(f.stcode)
    );

    // const trans = selected.filter( (item) =>  item?.id === "" );
    // const rawdt = selected.filter( (item) =>  item?.id !== "" );
    // console.log(itemsChoose, rawdt, trans);
    values([...selected, ...itemsChoose]);

    setOpenModel(false);
  };

  /** setting initial component */
  const column = columns();

  useEffect(async () => {
    const onload = () => {
      setLoading(true);

      ItemService.getAllItems().then(async (res) => {
          let { data } = res;
          setModalData(data);
          setModalDataWrap(data);
          // console.log(modalData, data)
          const keySeleted = selected.map( m => m.stcode );

          setRowKeySelect([...keySeleted]);
      })
      .catch((err) => {
          message.error("Request error!");

          // setLoading(false);
      })
      .finally( () => setTimeout( () => { setLoading(false); }, 400));
    };
    if (!!openModal) {
      onload();

      // console.log("modal-packages")
    }
  }, [openModal]);

  const handleCheckDuplicate = (itemCode) =>
    !!selected.find((item) => item?.stcode === itemCode);

  const itemSelection = {
    selectedRowKeys: rowKeySelect,
    type: "checkbox",
    fixed: true,
    hideSelectAll: true,
    onChange: (selectedRowKeys, selectedRows) => {
      // setRowKeySelect([...new Set([...selectedRowKeys, ...rowKeySelect])]);
      // setItemsList(selectedRows);
      //setRowKeySelect(selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      return {
        disabled: handleCheckDuplicate(record.stcode),
        name: record.stcode,
      };
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      //console.log(record, selected, selectedRows, nativeEvent);
      if (selected) {
        setRowKeySelect([...new Set([...rowKeySelect, record.stcode])]);
      } else {
        const ind = rowKeySelect.findIndex((d) => d === record.stcode);
        const tval = [...rowKeySelect];
        tval.splice(ind, 1);
        setRowKeySelect([...tval]);
        //console.log(ind, rowKeySelect);
      }
    },
  };
  /** setting child component */
  // const ButtonModal = (
  //     <Space direction="horizontal" size="middle" >
  //         <Button type='primary' onClick={() => handleConfirm() }>ยืนยันการเลือกสินค้า</Button>
  //         <Button onClick={() => setOpenModel(false) }>ปิด</Button>
  //     </Space>
  // )
  /** */
  return (
    <>
      <Modal
        open={openModal}
        title="เลือก Package"
        afterClose={() => handleClose()}
        onCancel={() => setOpenModel(false)}
        maskClosable={false}
        style={{ top: 20 }}
        width={1500}
        className="modal-packaging"
        footer={
          <Row>
            <Col span={24}>{/* Ignore */}</Col>
            <Col span={24}>
              <Flex justify="flex-end">
                <Button
                  className="bn-center bn-primary"
                  icon={<BsUiChecks />}
                  onClick={() => handleChoose()}
                >
                  {" "}
                  Confirm{" "}
                </Button>
              </Flex>
            </Col>
          </Row>
        }
      >
        <Spin spinning={loading}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", position: "relative" }}
          >
            <Card style={{ backgroundColor: "#f0f0f0" }}>
              <Form form={form} layout="vertical" autoComplete="off">
                <Row
                  gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
                  className="m-0"
                >
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item label="Search">
                      <Input
                        ref={inputRef}
                        suffix={<SearchOutlined />}
                        onChange={(e) => {
                          handleSearch(e.target.value);
                        }}
                        placeholder="Name or Code"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card style={{ minHeight: "45vh" }}>
              <Table
                bordered
                dataSource={modalDataWrap}
                rowSelection={itemSelection}
                columns={column}
                rowKey="stcode"
                pagination={{
                  total: modalDataWrap?.length || 0,
                  showTotal: (_, range) =>
                    `${range[0]}-${range[1]} of ${
                      modalDataWrap?.length || 0
                    } items`,
                  defaultPageSize: 25,
                  pageSizeOptions: [25, 35, 50, 100],
                }}
                size="small"
              />
            </Card>
          </Space>
        </Spin>
      </Modal>
    </>
  );
}

import React, { useState } from "react";
import { ConfigProvider, Menu } from "antd";
const PublicHeader = () => {
  const items = [
    {
      label: "ระบบงานขาย",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ใบรายการซ่อม
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  การวางบิล
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ข้อมูลการเก็บเงิน
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ประวัติลูกค้า
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ใบเสนอราคา
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  รายจ่าย
                </a>
              ),
            },
          ],
        },
      ],
    },
    {
      label: "คลังสินค้า",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ใบสั่งซื้อ
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  รับสินค้า
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  สั่งซื้ออัตโนมัติ
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ตัวแทนจำหน่าย
                </a>
              ),
            },
          ],
        },
      ],
    },
    {
      label: "สินค้า",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  สินค้า
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  แพ็คเก็จ
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  สิทธิ์แลกซื้อ
                </a>
              ),
            },
          ],
        },
      ],
    },
    {
      label: "ข้อมูล",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  รถ
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ลูกค้าบุคคล
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ลูกค้าบริษัท
                </a>
              ),
            },
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  พนักงาน
                </a>
              ),
            },
          ],
        },
      ],
    },
    {
      label: "จัดการระบบ",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/"  rel="noopener noreferrer">
                  ผู้ใช้ระบบ
                </a>
              ),
            },
          ],
        },
      ],
    },
  ];
  const [current, setCurrent] = useState("Mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#143574",
            colorBgContainer: "#FDFEFE",
          },
        }}
      ></ConfigProvider>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </>
  );
};
export default PublicHeader;

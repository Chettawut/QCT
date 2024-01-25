import React, { useState } from "react";
import { ConfigProvider, Menu } from "antd";
const PublicHeader = () => {
  const items = [
    {
      label: "ระบบงานขาย",
      key: 'menu1',
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/RB"  rel="noopener noreferrer">
                  ใบรายการซ่อม
                </a>
              ),
              key: 'menu1_1',
            },
            {
              label: (
                <a href="/Billing"  rel="noopener noreferrer">
                  การวางบิล
                </a>
              ),
              key: 'menu1_2',
            },
            {
              label: (
                <a href="/Billinginformation"  rel="noopener noreferrer">
                  ข้อมูลการเก็บเงิน
                </a>
              ),
              key: 'menu1_3',
            },
            {
              label: (
                <a href="/History"  rel="noopener noreferrer">
                  ประวัติลูกค้า
                </a>
              ),
              key: 'menu1_4',
            },
            {
              label: (
                <a href="/Quotation"  rel="noopener noreferrer">
                  ใบเสนอราคา
                </a>
              ),
              key: 'menu1_5',
            },
          ],
        },
      ],
    },
    {
      label: "คลังสินค้า",
      key: 'menu2',
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/PO"  rel="noopener noreferrer">
                  ใบสั่งซื้อ
                </a>
              ),
              key: 'menu2_1',
            },
            {
              label: (
                <a href="/Receivinggoods"  rel="noopener noreferrer">
                  รับสินค้า
                </a>
              ),
              key: 'menu2_2',
            },
          ],
        },
      ],
    },
    {
      label: "สินค้า",
      key: 'menu3',
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/Item"  rel="noopener noreferrer">
                  สินค้า
                </a>
              ),
              key: 'menu3_1',
            },
          ],
        },
      ],
    },
    {
      label: "ข้อมูล",
      key: 'menu4',
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/Car"  rel="noopener noreferrer">
                  รถ
                </a>
              ),
              key: 'menu4_1',
            },
            {
              label: (
                <a href="/Individualcustomers"  rel="noopener noreferrer">
                  ลูกค้าบุคคล
                </a>
              ),
              key: 'menu4_2',
            },
            {
              label: (
                <a href="/Companycustomers"  rel="noopener noreferrer">
                  ลูกค้าบริษัท
                </a>
              ),
              key: 'menu4_3',
            },
            {
              label: (
                <a href="/Employee"  rel="noopener noreferrer">
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
      key: 'menu5',
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/user"  rel="noopener noreferrer">
                  ผู้ใช้ระบบ
                </a>
              ),
              key: 'menu5_1',
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

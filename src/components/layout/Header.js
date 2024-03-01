import React, { useState } from "react";
import { Modal } from "antd";
import { ConfigProvider, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../service/Authenticate.service";
import {
  SettingOutlined,
  ApartmentOutlined,
  DatabaseOutlined,
  ShopOutlined,
  TagOutlined,
  AuditOutlined,
} from "@ant-design/icons";
const authService = Authenticate();
const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  const onLogout = () => {
    authService.removeToken();

    navigate("/", { replace: true });
  };
  const items = [
    {
      label: "ระบบงานขาย",
      key: "menu1",
      icon: <AuditOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/RB" rel="noopener noreferrer">
                  ใบรายการซ่อม
                </a>
              ),
              key: "menu1_1",
            },
            {
              label: (
                <a href="/Billing" rel="noopener noreferrer">
                  การวางบิล
                </a>
              ),
              key: "menu1_2",
            },
            {
              label: (
                <a href="/Billinginformation" rel="noopener noreferrer">
                  ข้อมูลการเก็บเงิน
                </a>
              ),
              key: "menu1_3",
            },
            {
              label: (
                <a href="/Quotation" rel="noopener noreferrer">
                  ใบเสนอราคา
                </a>
              ),
              key: "menu1_4",
            },
          ],
        },
      ],
    },
    {
      label: "คลังสินค้า",
      key: "menu2",
      icon: <ShopOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/purchase-order/" rel="noopener noreferrer">
                  ใบสั่งซื้อ 
                </a>
              ),
              key: "menu2_1",
            },        
            {
              label: (
                <a href="/Receivinggoods" rel="noopener noreferrer">
                  รับสินค้า
                </a>
              ),
              key: "menu2_2",
            },
          ],
        },
      ],
    },
    {
      label: "สินค้า",
      key: "menu3",
      icon: <TagOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/Items" rel="noopener noreferrer">
                  สินค้า
                </a>
              ),
              key: "menu3_1",
            },
          ],
        },
      ],
    },
    {
      label: "ข้อมูล",
      key: "menu4",
      icon: <DatabaseOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/Car" rel="noopener noreferrer">
                  รถ
                </a>
              ),
              key: "menu4_1",
            },
            {
              label: (
                <a href="/customer" rel="noopener noreferrer">
                  ลูกค้าบุคคล
                </a>
              ),
              key: "menu4_2",
            },
            {
              label: (
                <a href="/Business" rel="noopener noreferrer">
                  ลูกค้าบริษัท
                </a>
              ),
              key: "menu4_3",
            },
            {
              label: (
                <a href="/Employee" rel="noopener noreferrer">
                  พนักงาน
                </a>
              ),
              key: "menu4_4",
            },
            {
              label: (
                <a href="/cardata" rel="noopener noreferrer">
                  รุ่น / ปี
                </a>
              ),
              key: "menu4_5",
            },
            {
              label: (
                <a href="/Unit" rel="noopener noreferrer">
                  หน่วยสินค้า
                </a>
              ),
              key: "menu4_6",
            },
            {
              label: (
                <a href="/itemtype" rel="noopener noreferrer">
                  ประเภทสินค้า
                </a>
              ),
              key: "menu4_7",
            },
          ],
        },
      ],
    },
    {
      label: "จัดการระบบ",
      key: "menu5",
      icon: <ApartmentOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/user" rel="noopener noreferrer">
                  ผู้ใช้ระบบ
                </a>
              ),

              key: "menu5_1",
            },
          ],
        },
      ],
    },
    {
      label: "การตั้งค่า",
      key: "การตั้งค่า",
      icon: <SettingOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <p onClick={showModal} rel="noopener noreferrer">
                  ออกจากระบบ
                </p>
              ),
              key: "ออกจากระบบ",
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
            // colorPrimary: "#FDFEFE",
            // colorBgContainer: "#FDFEFE",
            // colorText: "#FDFEFE",
            // colorBgBase: "#FDFEFE",
          },
        }}
      >
        <Menu
          style={{ padding: 7, paddingLeft: 10 }}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
        <Modal
          title="แจ้งเตือน"
          open={isModalOpen}
          onOk={onLogout}
          onCancel={handleCancel}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ</p>
        </Modal>
      </ConfigProvider>
    </>
  );
};
export default Header;

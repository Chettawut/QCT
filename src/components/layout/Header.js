import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import {  Row, Col,ConfigProvider, Menu, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../service/Authenticate.service";
import {
  SettingOutlined,
  ApartmentOutlined,
  DatabaseOutlined,
  ShopOutlined,
  TagOutlined,
  AuditOutlined,
  UserOutlined,
} from "@ant-design/icons";
const authService = Authenticate();
const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const users = authService.getUserInfo();
    setUserInfo(users);

    return () => {};
  }, []);

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
                <a href="/billing" rel="noopener noreferrer">
                  การวางบิล
                </a>
              ),
              key: "menu1_2",
            },
            {
              label: (
                <a href="/billinginformation" rel="noopener noreferrer">
                  ข้อมูลการเก็บเงิน
                </a>
              ),
              key: "menu1_3",
            },
            {
              label: (
                <a href="/quotation" rel="noopener noreferrer">
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
                <a href="/good-receive" rel="noopener noreferrer">
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
                <a href="/items" rel="noopener noreferrer">
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
                <a href="/car" rel="noopener noreferrer">
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
                <a href="/business" rel="noopener noreferrer">
                  ลูกค้าบริษัท
                </a>
              ),
              key: "menu4_3",
            },
            {
              label: (
                <a href="/supplier" rel="noopener noreferrer">
                  ผู้ขาย
                </a>
              ),
              key: "menu4_8",
            },
            {
              label: (
                <a href="/employee" rel="noopener noreferrer">
                  พนักงาน
                </a>
              ),
              key: "menu4_4",
            },
            {
              label: (
                <a href="/model" rel="noopener noreferrer">
                  รุ่นรถ
                </a>
              ),
              key: "menu4_5",
            },
            {
              label: (
                <a href="/unit" rel="noopener noreferrer">
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
        <Row gutter={[24, 0]}>
          <Col span={24} className="header-control">
            <Menu
              style={{ padding: 7, paddingLeft: 10 }}
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </Col>
          <Col span={24} md={18} className="header-control">
            <Space className="gap-2">
              <UserOutlined />
              <span
                style={{
                  letterSpacing: 0.7,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                <Typography.Text style={{ color: "#5e5f61" }}>
                  {userInfo?.firstname} {userInfo?.lastname}
                </Typography.Text>
              </span>
            </Space>
          </Col>
        </Row>
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

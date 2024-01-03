import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Menu } from "antd";
const PublicHeader = () => {
  const items = [
    {
      label: "Navigation One",
      key: "mail",
      icon: <MailOutlined />,
    },
    {
      label: "Navigation Two",
      key: "app",
      icon: <AppstoreOutlined />,
      disabled: true,
    },
    {
      label: "ระบบงานขาย",
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <a href="/" rel="noopener ">
                  ใบรายการซ่อม
                </a>
              ),
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
      ],
    },
  ];
  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FFAD00",
            colorBgContainer: "#14357A",
          },
        }}
      >
        <div>
          <nav>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#14357A",
                  colorBgContainer: "#FDFEFE",
                },
              }}
            >
              <Menu mode="horizontal">
                &nbsp;&nbsp;&nbsp;
                <Link to="/">หน้าหลัก</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/HTP">วิธีการสั่งซื้อ</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/Allitems">สินค้าทั้งหมด</Link>
              </Menu>
            </ConfigProvider>
          </nav>
        </div>
      </ConfigProvider>
      {/* Modal เข้าสู่ระบบ */}
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

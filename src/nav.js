import {
  // AppstoreOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  HddOutlined,
  InboxOutlined,
  TeamOutlined,
  UserOutlined,
  ApartmentOutlined,
  CarOutlined,
  ShopOutlined,
  GiftOutlined,
  DropboxOutlined,
  TagOutlined,
  FileAddOutlined,
  BarcodeOutlined,
  IdcardOutlined,
  ShoppingCartOutlined,
  DownloadOutlined,
  DesktopOutlined,
  DollarOutlined,
} from "@ant-design/icons";

let _nav = [
  // {
  //   title: "DATA",
  //   type: "group",
  // },
  // {
  //   title: "Dashboard",
  //   icon: <AppstoreOutlined className="nav-ico" />,
  //   to: "/dashboard",
  // },
  {
    title: "ระบบงานขาย",
    type: "group",
  },
  {
    title: "ใบรายการซ่อม",
    icon: <FileAddOutlined className="nav-ico" />,
    to: "/sr",
  },
  {
    title: "การวางบิล",
    icon: <BarcodeOutlined className="nav-ico" />,
    to: "/bom",
  }, 
  {
    title: "ข้อมูลการเก็บเงิน",
    icon: <DollarOutlined className="nav-ico" />,
    to: "/items",
  },

  {
    title: "ประวัติลูกค้า",
    icon: <IdcardOutlined className="nav-ico" />,
    to: "/unit",
  },
  {
    title: "ใบเสนอราคา",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/itemtype",
  },
  {
    title: "รายจ่าย",
    icon: <UserOutlined className="nav-ico" />,
    to: "/customer",
  },
  {
    title: "คลังสินค้า",
    type: "group",
  },
  {
    title: "ใบสั่งซื้อสินค้า",
    icon: <ShoppingCartOutlined className="nav-ico" />,
    // to: "/sr",
  },
  {
    title: "รับสินค้า",
    icon: <DownloadOutlined className="nav-ico" />,
    // to: "/bom",
  }, 
  {
    title: "สั่งซื้ออันโนมัติ",
    icon: <DesktopOutlined className="nav-ico" />,
    // to: "/items",
  },
  {
    title: "สินค้า",
    type: "group",
  },
  {
    title: "สินค้า",
    icon: <TagOutlined  className="nav-ico" />,
    // to: "/sr",
  },
  {
    title: "ข้อมูล",
    type: "group",
  },
  {
    title: "รถ",
    icon: <CarOutlined className="nav-ico" />,
    // to: "/sr",
  },
  {
    title: "ลูกค้าบุคคล",
    icon: <UserOutlined className="nav-ico" />,
    // to: "/sr",
  },
  {
    title: "ลูกค้าบริษัท",
    icon: <ShopOutlined className="nav-ico" />,
    // to: "/bom",
  }, 
  {
    title: "พนักงาน",
    icon: <TeamOutlined className="nav-ico" />,
    // to: "/items",
  },
  {
    title: "จัดการระบบ",
    type: "group",
  },
  {
    title: "ผู้ใช้ระบบ",
    icon: <TeamOutlined className="nav-ico" />,
    to: "/user",
  },
  
];

export default _nav;

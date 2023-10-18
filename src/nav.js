import {
  AppstoreOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  HddOutlined,
  InboxOutlined,
  TeamOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

let _nav = [
  {
    title: "DATA",
    type: "group",
  },
  {
    title: "Dashboard",
    icon: <AppstoreOutlined className="nav-ico" />,
    to: "/dashboard",
  },
  {
    title: "MASTER",
    type: "group",
  },
  {
    title: "Sample Request",
    icon: <CreditCardOutlined className="nav-ico" />,
    to: "/sr",
  },
  {
    title: "Bom",
    icon: <ApartmentOutlined className="nav-ico" />,
    to: "/bom",
  }, 
  {
    title: "Items",
    icon: <FileDoneOutlined className="nav-ico" />,
    to: "/items",
  },

  {
    title: "Unit",
    icon: <HddOutlined className="nav-ico" />,
    to: "/unit",
  },
  {
    title: "Product Type",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/itemtype",
  },
  {
    title: "Customer",
    icon: <UserOutlined className="nav-ico" />,
    to: "/customer",
  },
  {
    title: "SYSTEM",
    type: "group",
  },
  {
    title: "User",
    icon: <TeamOutlined className="nav-ico" />,
    to: "/user",
  },
];

export default _nav;

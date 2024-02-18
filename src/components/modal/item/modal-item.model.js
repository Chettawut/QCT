import { Button } from "antd";
import {
  PlusOutlined  
} from "@ant-design/icons";
/** get items column */
export const itemscolumns = ({handleSelectedItem,checkDupItem})=>{
    return [      
      {
        title: "รหัสสินค้า",
        key: "stcode",
        dataIndex: "stcode",
        width: "100px",
      },
      {
        title: "ชื่อสินค้า",
        dataIndex: "stname",
        key: "stname",
        width: "50%",
      },
      {
        title: "ราคาต่อหน่วย",
        key: "price",
        dataIndex: "price",
        align: "right",
        render: (price) => {
          let nextPrice = parseFloat(price).toFixed(2);
          return nextPrice?.toLocaleString();
        },
      },
      {
        title: "",
        key: "tools",
        align: "center",
        render: (record) => (
          <Button
            type="primary"
            className="bt-icon"
            icon={<PlusOutlined />}
            disabled={checkDupItem(record?.stcode)}
            onClick={() => handleSelectedItem(record)}
          />
        ),
      },
    ]
  };
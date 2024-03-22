import { Button, Flex, Popconfirm, Tooltip, Typography } from "antd";
import { TagActiveStatus } from "../../badge-and-tag";
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";

/** get items column */
export const columnsPkType = ({handleChoose, handleEdit, handleDeleted})=>{
    const Link = Typography.Link;
    const LChoose = ({children, record}) => (
      <Link 
      className="text-select" 
      onClick={()=>handleChoose(record)} 
      disabled={record.status?.toLowerCase() === 'n'} >{children}</Link>
    );
    return [
      {
        title: "Packaging Type",
        key: "pktype",
        dataIndex: "pktype", 
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 84,
        render: (v, record) => <LChoose record={record}><TagActiveStatus result={v} /></LChoose>
      },
      {
        title: "Updated By",
        dataIndex: "updated_name",
        key: "updated_name",
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
      {
        title: "Updated Date",
        dataIndex: "updated_date",
        key: "updated_date",
        render: (v, record) => <LChoose record={record}>{dayjs(v).format("DD/MM/YYYY")}</LChoose>
      },
      {
        title: "",
        width: 50,
        render: (v, record) => (
          <Flex gap={3}>
            <Button
              icon={<EditOutlined />} 
              className='bn-primary-outline'
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={(e) => handleEdit(record) }
              size="small"
            />
            <Popconfirm 
              placement="topRight"
              title="Sure to delete?"  
              description="Are you sure to delete this sample preparation?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDeleted(record)}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                size="small"
              />
            </Popconfirm>
          </Flex>
        )
      },
    ]
};

const ellipsis = () => {
  return {  
    ellipsis: {
      showTitle: false,
    },
    render: (v) => (
      <Tooltip placement="topLeft" title={v}>
        {v}
      </Tooltip>
    ),  
  }
}

export const columns = ()=>{
  return [
    {
      title: "เลขที่ใบสั่งซื้อ",
      key: "pocode",
      dataIndex: "pocode",
      width:150,
      ...ellipsis()
    },
    {
      title: "รหัสพัสดุ",
      key: "grcode",
      dataIndex: "grcode",
      width:150,
      ...ellipsis()
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname", 
      width:300,
      ...ellipsis()
    },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit", 
      width:150,
      ...ellipsis()
    },
    {
      title: "จำนวนสั่งซื้อ",
      dataIndex: "2",
      key: "2", 
      width:100,
      ...ellipsis()
    },
    {
      title: "จำนวนที่รับแล้ว",
      dataIndex: "0",
      key: "0", 
      width:100,
      ...ellipsis()
    },
    {
      title: "สถานะ",
      dataIndex: "grstatus",
      key: "grstatus", 
      width:200,
      ...ellipsis()
    },
  ]
};
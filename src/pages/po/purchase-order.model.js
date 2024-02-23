import { Space, Typography } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Popconfirm } from "antd";
import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
// import dayjs from 'dayjs';
import { EditableCell, EditableRow } from "../../components/table/TableEditAble";
// import { formatCommaNumber } from '../../utils/util';
/** get sample column */
export const accessColumn = ({handleEdit, handleDelete}) => [
  {
    title: "เลขที่ PO",
    key: "pocode",
    dataIndex: "pocode",
    align: "left",  
    width: 210,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "วันที่ออก PO",
    dataIndex: "podate",
    key: "podate",   
    align: 'right',
    className:'!pe-5',
  },
  {
    title: "รหัสพัสดุ",
    dataIndex: "stcode",
    key: "stcode",   
    align: 'right',
    className:'!pe-5',
  },
  {
    title: "รายการสินค้า",
    dataIndex: "stname",
    key: "stname",   
    align: 'right',
    className:'!pe-5',
  },
  {
    title: "ผู้ขาย",
    dataIndex: "supname",
    key: "supname", 
    width: 160,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "สถานะ",
    dataIndex: "active_status",
    key: "active_status", 
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    width: 90,
    render: (text, record) => (
      <Space >
        <Button
          icon={<EditOutlined />} 
          className='bn-primary-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handleEdit(record) }
          size="small"
        />
        {/* <Button
          icon={<PrinterOutlined />} 
          className='bn-warning-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handleView(record) }
          size="small"
        /> */}
        <Popconfirm 
          placement="topRight"
          title="Sure to delete?"  
          description="Are you sure to delete this packaging?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete(record)}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            size="small"
          />
        </Popconfirm>
        {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
      </Space>
    ),
  }, 
]

export const pkmaster = {
  pkcode : null,
  pkname : null,
  pknameTH : null,
  pktypeid : null,
  expscode : null,
  expsname : null,
  price : 0,
  transport : 0,
  lost : 0,
  cost : 0,
  unitid : null,
  supcode : null,
  remark : null,
}

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get column for edit table parameter */
export const editColumns = ({ handleAction }) => {
  return [
    {
      title: "ลำดับ",
      ellipsis: true,
      className:'max-w-52',
      key: "index",
      dataIndex: "index",
      align: "left",
      render:(item, record, index)=>(<>{index+1}</>)
    },
    {
      title: "รหัสสินค้า",
      ellipsis: true,
      className:'max-w-52',
      key: "stcode",
      dataIndex: "stcode",
      align: "center",
      width:100
    },
    {
      title: "ชื่อสินค้า",
      key: "stname",
      dataIndex: "stname",
      align: "left",       
      width:300
    },
    {
      title: "จำนวน",
      editable: true,
      align: 'right',
      key: "amount",
      dataIndex: "amount",
      render: (v) => v || 1 
    },
    {
      title: "หน่วย",
      align: "center",
      editable: false,
      required: true,
      key: "unit",
      dataIndex: "unit",  
    },
    {
      title: "ราคาซื้อ",
      align: "right",
      editable: true,
      required: true,
      key: "price",
      dataIndex: "price",
    },
    {
      title: (<>ส่วนลด (%)</>),
      align: "right",
      width: 160, 
      editable: true,
      key: "discount",
      dataIndex: "discount",
      render: (v) => v||0
    },
    {
      title: "จำนวนเงิน",
      align: "right",
      width: 160,
      editable: false,
      key: "totalprice",
      dataIndex: "totalprice",
      render: (v, row) => {
      return (
        <Typography>{(row.amount*row.price)}</Typography>||row.price
      );
    }
    },
    {
      title: "ตัวเลือก",
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record, idx) => handleAction(record),
      width: '90px',
      fixed: 'right',
    },
  ]
};

export const columnsDetailsEditable = (handleSave, {handleAction, nameOption} ) =>{
  const col = editColumns({handleAction, nameOption});
  return col.map((col, ind) => {
      if (!col.editable) { return col; }
      return {
          ...col,
          onCell: (record) => {
            // console.log(record);
            return {
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave,
              fieldType: !!col?.textArea,
              required: !!col?.required,
              type: col?.type || 'input',
              autocompleteOption: col.autocompleteOption
            }
          },
      };
  }); 
}

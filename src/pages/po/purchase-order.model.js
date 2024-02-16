import { Space } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Popconfirm} from "antd";
import { EditOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 

import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
// import { columnSearchProp } from "../../components/table/Searchtable";
import { BadgeSampleRequestStatus } from "../../components/badge-and-tag";
import { ButtonAttachFiles } from "../../components/button";

// import { formatCommaNumber } from "../../utils/util";

// const { Paragraph } = Typography; 

/** get column for show data SR Sample request */
export const columns = (imputRef, columnSearchAction, { handleAction, handleView, handleDelete }) => [
    {
      title: "PO Code",
      dataIndex: "pocode",
      key: "pocode", 
      sorter: (a, b) => a.pocode.length - b.pocode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "PO Date",
      dataIndex: "podate",
      key: "podate",       
      sorter: (a, b) => a.podate.length - b.podate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "รหัสผู้ขาย",
      dataIndex: "supcode",
      key: "supcode",
      render: (_, record) => `${record.supcode}`,
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อผู้ขาย",
      dataIndex: "supname",
      key: "supname",
      render: (_, record) => `${record.supname}`,
      sorter: (a, b) => a.supname.length - b.supname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "active_status",
      key: "active_status", 
      sorter: (a, b) => a.active_status.length - b.active_status.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => <BadgeSampleRequestStatus data={data} />,
    },
    {
      title: "Action",
      key: "operation",
      width: '180px',
      fixed: 'right',
      render: (text, record) => (
        <Space >
          <Button
            icon={<EditOutlined />} 
            className='bn-primary-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleAction(record) }
            size="small"
          />
          <Button
            icon={<ExclamationCircleOutlined />} 
            className='bn-success-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleView(record) }
            size="small"
          />
          <Popconfirm 
            placement="topRight"
            title="Sure to delete?"  
            description="Are you sure to delete this sample preparation?"
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
          <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} />
        </Space>
      ),
    },
].filter((item) => !item.hidden);

/** get column for show data SR Sample request Detail */
export const sampleColumn = ({ handleAction }) => {
    return [
    {
      title: "No",
      key: "index",
      align: "left",
      width: 80,
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Sample Name",
      key: "spname",
      dataIndex: "spname",
      editable: true,
      required: true,
      type:'input',
      width: '50%',
      align: "left",
      className:"field-edit pe-2"
    },
    {
      title: "Packing",
      key: "pkname",
      dataIndex: "pkname",
      editable: true,
      required: false,
      width: 240,
      type: 'modal-select',
      align: "left",
      className:"field-edit pe-2"
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      type:'input',
      editable: true,
      required: false,
      align: "left",
      width: 240,
      className:"field-edit pe-2", 
    },
    {
        title: "",
        align: "center",
        key: "operation",
        dataIndex: "operation",
        render: (_, record, idx) => handleAction(record),
        width: '90px',
        fixed: 'right',
    },
  ]
};

/** get column for edit table working in modal manage sr */
export const columnSampleEditable = (handleSave, handleModalSelect, {handleAction} ) =>{
    const col = sampleColumn({handleAction});
    return col.map((col) => {
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
                modalSelect: handleModalSelect
              }
            },
        };
    }); 
}  

/** export component for edit table */
export const componentsEditable = {
    body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const samplecolumnView = [
  {
    title: "No",
    key: "index",
    align: "left",
    width: 80,
    render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
  },
  {
    title: "Sampl Name",
    dataIndex: "spname",
    key: "spname",  
  },
  {
    title: "Packing",
    dataIndex: "pkname",
    key: "pkname"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount", 
  } 
]


export const srmaster = {
  srcode : null,
  srdate : null,
  duedate : null,
  cuscode : null,
  cusname : null,
  description : null
}
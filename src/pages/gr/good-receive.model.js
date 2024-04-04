import { Space } from "antd";
// import { Typography } from "antd";
import { Button, Select } from "antd";
import { Popconfirm } from "antd";
import {
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
// import dayjs from 'dayjs';
import {
  EditableCell,
  EditableRow,
} from "../../components/table/TableEditAble";
// import { formatCommaNumber } from '../../utils/util';

/** get sample column */
export const accessColumn = ({ handleEdit, handleDelete }) => [
  {
    title: "เลขที่ใบรับสินค้า",
    key: "pocode",
    dataIndex: "pocode",
    align: "left",
    width: 210,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "วันที่ออกใบรับสินค้า",
    dataIndex: "podate",
    key: "podate",
    align: "right",
    className: "!pe-5",
  },
  {
    title: "รหัสพัสดุ",
    dataIndex: "stcode",
    key: "stcode",
    align: "right",
    className: "!pe-5",
  },
  {
    title: "รายการสินค้า",
    dataIndex: "stname",
    key: "stname",
    align: "right",
    className: "!pe-5",
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
    fixed: "right",
    width: 90,
    render: (text, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          className="bn-primary-outline"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => handleEdit(record)}
          size="small"
        />
        <Popconfirm
          placement="topRight"
          title="Sure to delete?"
          description="Are you sure to delete this packaging?"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={() => handleDelete(record)}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            size="small"
          />
        </Popconfirm>
        {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
      </Space>
    ),
  },
];

export const pkmaster = {
  pkcode: null,
  pkname: null,
  pknameTH: null,
  pktypeid: null,
  expscode: null,
  expsname: null,
  price: 0,
  transport: 0,
  lost: 0,
  cost: 0,
  unitid: null,
  supcode: null,
  remark: null,
};

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get column for edit table parameter */
export const editColumns = ({ handleAction, filterOption, listOption,handleSelectChange }) => {
  return [
    {
      title: "ลำดับ",
      ellipsis: true,
      className: "max-w-52",
      key: "index",
      dataIndex: "index",
      align: "left",
      render: (item, record, index) => <>{index + 1}</>,
      width: 100,
    },
    {
      title: "ใบสั่งซื้อ",
      ellipsis: true,
      className: "max-w-52",
      key: "supcode",
      dataIndex: "supcode",
      align: "center",
      width: 150,
    },
    {
      title: "รหัสสินค้า",
      key: "stname",
      dataIndex: "stname",
      align: "left",
      width: 150,
    },  {
      title: "รายการสินค้า",
      key: "stname",
      dataIndex: "stname",
      align: "left",
      width: 400,
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
      key: 'unit',
      width: 200,
      render: (text, record) => (
          <Select
            showSearch
            style={{ height: 40,width: 130 }}
            placeholder="เลือกขนาดสินค้า"
            filterOption={filterOption}
            options={listOption}
            value={record.unit} 
            onChange={(value) => handleSelectChange(value, record)}
          >
          </Select>
      ),
    },
    // {
    //   title: "หน่วย",
    //   align: "center",
    //   required: true,
    //   key: "unit",
    //   dataIndex: "unit",
    //   width: 200,
    //   render: (_, record) => (
        
    //       <Select
    //       name="unit"
    //         size="large"
    //         placeholder="หน่วย"
    //         showSearch
    //         filterOption={filterOption}
    //         options={listOption}
    //         onChange={(...record) => record.unitcode}
    //         // options={

    //         // })}
    //       />
        
    //   ),
    // },
    {
      title: "จำนวนรับแล้ว",
      editable: true,
      align: "right",
      key: "recamount",
      dataIndex: "recamount",
      width: 200,
    },
    
    {
      title: "จำนวนนับ",
      align: "right",
      editable: true,
      required: true,
      key: "amount",
      dataIndex: "amount",
      width: 200,
    },
    {
      title: "สถานะ",
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record, idx) => handleAction(record),
      width: "90px",
      fixed: "right",
    },
  ];
};

export const columnsDetailsEditable = (
  handleSave,
  { handleAction, nameOption, listOption,handleSelectChange }
) => {
  const col = editColumns({ handleAction, nameOption, listOption,handleSelectChange });
  return col.map((col, ind) => {
    if (!col.editable) {
      return col;
    }
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
          type: col?.type || "input",
          autocompleteOption: col.autocompleteOption,
        };
      },
    };
  });
};

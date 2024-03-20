import { Tag, Tooltip, Typography } from 'antd';

import { capitalized } from '../../../utils/util';

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

export const columnPackingSet = ()=>{
  return [
    {
      title: "Packing Set Name",
      key: "packingset_name",
      dataIndex: "packingset_name",
      width:200,
      ...ellipsis()
    }, 
    {
      title: "supcode",
      dataIndex: "supcode",
      key: "supcode",
      render: (h)=>!!h && <Tag color="#3b5999" >{capitalized(h || "")}</Tag>,
    },
    {
      title: "Unit Per Cost",
      dataIndex: "unit_cost",
      key: "unit_cost", 
      width:'12%',
      align: "right",
      className:'!pe-3',
    },
    {
      title: "Fill Volume",
      dataIndex: "fill_volume",
      key: "fill_volume",
      width:'12%',
      align: "right",
      className:'!pe-3', 
    },
    {
      title: "Request By",
      dataIndex: "updated_name",
      key: "updated_name", 
    },
  ]
};

export const columnPackingsetGroup = ({handleChoose, handleEdit, handleDeleted})=>{
    const Link = Typography.Link;
    const LChoose = ({children, record}) => (
      <Link 
      className="text-select" 
      onClick={()=>handleChoose(record)} 
      disabled={record.status?.toLowerCase() === 'n'} >{children}</Link>
    );
    return [
      {
        title: "รหัสผู้ขาย",
        key: "supcode",
        dataIndex: "supcode", 
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
       {
        title: "ลำดับ",
        key: "",
        dataIndex: "", 
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      }, 
      {
        title: "ชื่อผู้ขาย",
        dataIndex: "supname",
        key: "supname",
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
    ]
};
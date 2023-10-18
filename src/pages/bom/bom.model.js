import { Tag } from 'antd'; 

export const columns = [
    {
      title: 'Bom Name',
      // width: 250,
      minWidth: 250,
      dataIndex: 'name',
      key: 'name',
      // fixed: 'left',
    },
    {
      title: 'Create Date',
      width: "10%",
      dataIndex: 'created_date',
      key: 'created_date',
      textWrap: 'word-break',
      minWidth: 150,
      // fixed: 'left',
    },
    {
      title: 'Create By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: "15%",
      textWrap: 'word-break',
      minWidth: 150,
    },
    {
      title: 'Update Date',
      dataIndex: 'updated_date',
      key: 'updated_date',
      width: "10%",
      minWidth: 150,
    },
    {
      title: 'Update By',
      dataIndex: 'updated_by',
      key: 'updated_by',
      width: "15%",
      minWidth: 150,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a href="#/" >action</a>
    },
];

export const columnsBomDetail = [
  {
    title: 'Item Code',
    dataIndex: 'itemid',
    key:"itemid"
  },
  {
    title: 'Item Name',
    className: 'item_name',
    dataIndex: 'item_name',
    key:"item_name"
  },
  {
    title: 'Item Amount',
    dataIndex: 'item_amount',
    width:150, 
    align:'right',
    key:"item_amount",
    editable: true,
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key:"unit"
  },
  {
    title: 'Remark',
    dataIndex: 'remarks',
    key:"remarks",
    editable: true,
    textArea: true,
    width:240, 
  },
];

export const columnsBomItems =  [
// {
//   stcode : null,
//   stname : null,
//   stnameEN : null,
//   stnamedisplay : null,
//   unit : null,
//   price : null,
//   feature : null,
//   typecode : null,
// },
{
  title: 'Item Code',
  dataIndex: 'stcode', 
  key:"1",
  width: "20%",
  minWidth: 200,
  fixed:"left"
},
{
  title: 'Item Name',
  dataIndex: 'stname', 
  key:"2",
  width: "15%",
  minWidth: 180,
},
{
  title: 'Item Name En',
  dataIndex: 'stnameEN', 
  key:"3",
  width: "15%",
  minWidth: 180,
},
{
  title: 'Item Unit',
  dataIndex: 'unit', 
  key: '4',
  textWrap: 'word-break',
  width: 150,
},
{
  title: 'Item Price',
  dataIndex: 'price', 
  key: '5',
  textWrap: 'word-break',
  width: 150,
},
{
  title: 'Item Type',
  dataIndex: 'typecode', 
  key: '6',
  textWrap: 'word-break',
  width: 180, 
  render:(text, record, index)=>{
    const c_tag = {
      "1":"#87d068", //Finish Goods
      "2":"#2db7f5", //Semi Finish Goods
      "3":"#f50", //Material
    }
    return <Tag color={c_tag[text]}>{record.typename}</Tag>
  }
},
];

export const bomRequestViewModel = {
  bom_name : null,
  status : null,
  parent_itemid: null,
}
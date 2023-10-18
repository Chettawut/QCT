import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input } from 'antd';
import { columnsBomDetail } from "../bom.model"
const EditableContext = React.createContext(null);
const defaultColumns = [...columnsBomDetail];
const { TextArea } = Input;
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    fieldType,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const textAreaRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus(); 

        inputRef.current?.select();
        console.log( inputRef.current );
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();


        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
          <Form.Item
            style={{ margin: 0, }}
            name={dataIndex}
            rules={[ { required: !fieldType, message: `${title} is required.`,  }, ]}
          >
            {
                (!!fieldType) 
                ? <TextArea rows={3} ref={textAreaRef} onBlur={save} style={{width:"100%"}} />
                : <Input ref={inputRef} onPressEnter={save} onBlur={save} style={{height:32}} />
            }
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{ paddingRight: 8, height: !!fieldType ? 75.6 : 32, border:"1px solid #eee", borderRadius:6, lineHeight: '1.4rem' }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

export const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};

export const getColumns = (handleSave) => {
    return defaultColumns?.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                fieldType: !!col?.textArea,
            }),
        };
    });
}

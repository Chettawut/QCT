import React, {useState} from 'react';
import { Button } from "antd";
import { Drawer } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
import { FaPaperclip  } from "react-icons/fa6";
import { FileControl } from '../../../pages/file-control/file-control';



const ButtonAttachFiles = ( {code, refs, showExpire} ) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                icon={<FaPaperclip  />} 
                className='bn-info-outline'
                style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={(e) => setOpen(true) }
                size="small"
            />
            <Drawer title="Upload" placement="right" size="large" open={open} onClose={()=>{ setOpen(false) }} > 
                { open && (<FileControl title={`แนบไฟล์ สำหรับ item code : test`} refcode = {code} refs={refs} noExpire={showExpire ||  true} />)} 
            </Drawer>
        </>
    );
}

export default ButtonAttachFiles;



import { useState } from "react"
import BABox from "./BABox"
import BAPera from "./BAPera"
import {
    RightOutlined,
    DownOutlined
} from "@ant-design/icons";

export default function BACollapse(props: { label: string, children: any, icon?: any, shrink?: boolean, labelClick?: any }) {
    const { label, children, icon, shrink, labelClick } = props
    const [open, setOpen] = useState(true)
    const handleOpen = () => {
        setOpen(!open)
        if (labelClick) {
            labelClick()
        }
    }
    return <>
        <BABox className="mb-2" >
            <BAPera onClick={handleOpen} className={`p-2 text-drawer font-bold text-lg border-b hover:bg-[rgba(0,0,0,.1)] hover:rounded-md border-b-[drawer] cursor-pointer flex justify-${shrink ? 'center' : 'between'} items-center`}><span>{icon && <span className="me-3 inline-block">{icon}</span>}{!shrink && label}</span>{!shrink && <span style={{ fontSize: "1rem" }}>{open ? <DownOutlined /> : <RightOutlined />}</span>}</BAPera>
            {open && !shrink && <BABox>
                {children}
            </BABox>}
        </BABox>
    </>
}
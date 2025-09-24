

import { Button } from "antd"


type propsType = {
    type?: "primary" | "default" | "dashed" | "link" | "text" | undefined,
    htmlType?: "submit" | "button" | "reset" | undefined,
    onClick?: any,
    label?: React.ReactNode,
    className?: string,
    sx?: any,
    icon?: any,
    loading?: boolean,
    disabled?: boolean,
}
export default function BAButton(props: propsType) {
    const { htmlType, onClick, label, className, sx, loading, icon, disabled, type } = props;
    return <>
        <Button
            disabled={disabled}
            htmlType={htmlType}
            icon={icon}
            loading={loading}
            onClick={onClick}
            className={`${className}`}
            style={{ ...sx, borderRadius: "100px", padding: '20px' }}
            type={type || "primary"}
        >{label}</Button>
    </>
}
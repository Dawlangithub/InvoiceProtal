

import { Button } from "antd";

type propsType = {
    onClick?: any,
    icon: any,
    loading?: boolean,
    className?: string,
    disabled?: any,
    toolTip?: string,
    danger?: boolean,
    shape?: "circle" | "round" | "default" | undefined,
    type?: "link" | "text" | "primary" | "default" | "dashed" | undefined
}
export default function BAIconButton(props: propsType) {
    const { onClick, loading, icon, className, disabled, danger, type, shape, toolTip } = props;
    return <>
        <Button
            danger={danger}
            type={type ?? "primary"}
            disabled={disabled}
            className={className}
            shape={shape || "circle"}
            icon={icon}
            size="middle"
            loading={loading}
            onClick={onClick}
            title={toolTip}
        ></Button>
    </>
}
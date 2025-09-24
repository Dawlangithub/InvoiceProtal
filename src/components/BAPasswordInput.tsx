

import { Input } from "antd";
import BABox from "./BABox";
type propsType = {
    label: string,
    placeholder?: string,
    disabled?: boolean,
    required?: boolean,
    className?: string,
    onChange?: any,
    value?: string,
    variant?: any
}
export default function BAPasswordInput(props: propsType) {
    const { label, disabled, required, className, onChange, value, variant } = props;
    return <>
        <BABox className={`${className}`}>
            {label && <div className="text-xs text-black mb-1">{label}<span className="text-red-500 ml-1">{required && "*"}</span></div>}
            <BABox>
                <Input.Password
                    value={value}
                    // placeholder={placeholder}
                    style={{ padding: "10px" }}
                    disabled={disabled}
                    required={required}
                    className={className}
                    onChange={onChange}
                    variant={variant}
                />
            </BABox>
        </BABox>
    </>
}



import { Input } from "antd";
type propsType = {
    label: string,
    placeholder?: string,
    disabled?: boolean,
    required?: boolean,
    className?: string,
    onChange?: any,
    value?: string,
    type?: any,
    onBlur?: any
}
export default function BATextarea(props: propsType) {
    const { label, disabled, required, onChange, value, onBlur } = props;

    const { TextArea } = Input;

    return <>
        {label && <div className="text-xs font-medium text-gray-700">{label}<span className="text-red-500 ml-1">{required && "*"}</span></div>}
        <TextArea
            onBlur={onBlur}
            rows={1}
            value={value}
            // placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            variant="underlined"
        />
    </>
}

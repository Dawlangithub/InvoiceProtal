


import { useState } from "react";
import { Input } from "antd";
import { PatternFormat } from 'react-number-format';
import BABox from "./BABox";

type propsType = {
    label: string,
    placeholder?: string,
    disabled?: boolean,
    required?: boolean,
    className?: string,
    onChange?: any,
    onKeyDown?: any,
    onBlur?: any,
    value?: string,
    type?: any
    mask?: string,
    textAlign?: "left" | "right" | "center" | undefined,
    validationType?: "email" | "contactNumber",
    isValidate?: any,
    onFocus?: any,
    maxlength?: any,
    variant?: any
}
export default function BAinput(props: propsType) {
    const { label, disabled, required, className, onChange, value, type, onBlur, onKeyDown, validationType, isValidate, mask, onFocus, textAlign, maxlength, variant } = props;
    console.log("🚀  ~ BAInput.tsx ~ BAinput ~ isValidate: ", isValidate);
    console.log("🚀  ~ BAInput.tsx ~ BAinput ~ validationType: ", validationType);
    const [isError, setIsError] = useState(false);
    console.log("🚀  ~ BAInput.tsx ~ BAinput ~ setIsError: ", setIsError);
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return <BABox className={`${className}`}>
        {label && <div className="text-xs text-black mb-1">{label}<span className="text-red-500 ml-1">{required && "*"}</span></div>}
        <BABox>
            {mask ? <PatternFormat
                value={value}
                onChange={(e) => {
                    const rawNumber = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
                    onChange(rawNumber || null)
                }}
                customInput={Input}
                format={mask?.replace(/\*/g, '#')}
                disabled={disabled}
                style={{ height: '44px' }}
                allowEmptyFormatting
                variant={variant}
                mask="_"
            /> : <Input
                maxLength={maxlength}
                onKeyDown={onKeyDown}
                style={{ textAlign: textAlign || "left", padding: "10px" }}
                onBlur={onBlur}
                status={isError ? "error" : ""}
                type={type === 'number' ? 'Number' : 'text'}
                value={value}
                // placeholder={placeholder}
                disabled={disabled}
                required={required}
                variant={variant}
                onChange={(e) => {
                    onChange(e)
                    // if (validationType || isValidate) {
                    // if (emailRegex.test(e.target.value)) {
                    // isValidate(true);
                    // setIsError(true);
                    // } else {
                    // isValidate(false);
                    // setIsError(true);
                    // }
                    // }
                }}
                onFocus={onFocus}
            />}
        </BABox>
    </BABox>
}

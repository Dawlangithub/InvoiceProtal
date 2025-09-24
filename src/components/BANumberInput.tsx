import { NumericFormat } from "react-number-format";
import BABox from "./BABox";

interface BANumberInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  value?: string | number;
  decimalScale?: number;
  allowNegative?: boolean;
  onKeyDown?: any;
  prefix?: string;
  suffix?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function BANumberInput({
  label,
  disabled,
  required,
  className,
  onChange,
  value,
  decimalScale = 2,
  allowNegative = false,
  onKeyDown,
  prefix,
  suffix,
  onBlur,
  onFocus,
}: BANumberInputProps) {
  const handleValueChange = (values: any) => {
    if (onChange) {
      onChange(values.value);
    }
  };

  return (
    <BABox className={className}>
      {label && (
        <div className="text-xs mb-1 font-medium text-gray-700 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      <NumericFormat
        onKeyDown={onKeyDown}
        className={`
          ant-input w-full
          border-0 border-b border-gray-300
          focus:border-none focus:shadow-none focus:ring-0
          px-0 pb-1 bg-transparent
        `}
        value={value}
        thousandSeparator=","
        decimalScale={decimalScale}
        fixedDecimalScale
        allowNegative={allowNegative}
        prefix={prefix ? `${prefix} ` : ""}
        suffix={suffix ? ` ${suffix}` : ""}
        // placeholder={placeholder}
        disabled={disabled}
        onValueChange={handleValueChange}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{ textAlign: "right", }}
      />
    </BABox>
  );
}

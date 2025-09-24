import React from "react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import BABox from "./BABox";
import BAPera from "./BAPera";

const { RangePicker } = DatePicker;

interface BADateRangeProps {
  label?: string;
  value?: [Dayjs, Dayjs] | null;
  onChange?: (dates: [Dayjs, Dayjs] | null) => void;
  placeholder?: [string, string];
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  format?: string;
  maxDate?: Dayjs;
  minDate?: Dayjs;
  showTime?: boolean;
  size?: "small" | "middle" | "large";
}

const BADateRange: React.FC<BADateRangeProps> = ({
  label,
  value,
  onChange,
  placeholder = ["Start Date", "End Date"],
  disabled = false,
  className = "",
  allowClear = true,
  format = "DD/MM/YYYY",
  maxDate,
  minDate,
  showTime = false,
  size = "middle",
}) => {
  const handleChange = (dates: any) => {
    if (onChange) {
      onChange(dates);
    }
  };

  return (
    <BABox className={`flex flex-col ${className}`}>
      {label && (
        <BAPera className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </BAPera>
      )}
      <RangePicker
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        format={format}
        maxDate={maxDate}
        minDate={minDate}
        showTime={showTime}
        size={size}
        className="w-full"
        style={{
          borderRadius: "6px",
          borderColor: "#d9d9d9",
        }}
      />
    </BABox>
  );
};

export default BADateRange; 
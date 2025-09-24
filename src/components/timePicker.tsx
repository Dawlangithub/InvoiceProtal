import { TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BABox from "./BABox";

dayjs.extend(customParseFormat);

interface BATimePickerProps {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  format?: string;
  use12Hours?: boolean;
  minuteStep?: number;
  secondStep?: number;
  allowClear?: boolean;
  placeholder?: string;
  onBlur?: any;
  onFocus?: any;
}

export default function BATimePicker(props: BATimePickerProps) {
  const {
    label,
    disabled,
    required,
    className,
    value,
    onChange,
    format = "h:mm A",
    use12Hours = true,
    minuteStep,
    secondStep,
    allowClear = true,
    placeholder = "",
    onBlur,
    onFocus,
  } = props;

  const handleChange = (time: Dayjs | null, timeString: string) => {
    if (onChange) {
      onChange(time ? timeString : null);
    }
  };

  const timeValue = value
    ? dayjs(value, ["h:mm A", "h:mm a", "HH:mm", "HH:mm:ss"])
    : null;

  const tpProps: any = {
    style: { width: "100%", padding: "10px" },
    value: timeValue,
    format,
    use12Hours,
    disabled,
    allowClear,
    placeholder,
    onChange: handleChange as any,
    onBlur,
    onFocus,
  };
  if (minuteStep !== undefined) tpProps.minuteStep = minuteStep;
  if (secondStep !== undefined) tpProps.secondStep = secondStep;

  return (
    <BABox className={className}>
      {label && (
        <div className="text-xs font-medium text-gray-700 mb-1">
          {label}
          <span className="text-red-500 ml-1">{required && "*"}</span>
        </div>
      )}
      <BABox>
        <TimePicker {...tpProps} />
      </BABox>
    </BABox>
  );
}

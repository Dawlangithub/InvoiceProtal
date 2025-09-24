import { Switch } from 'antd';
import BABox from "./BABox";

type propsType = {
    label: string,
    value: boolean,
    onChange: any,
    disabled?: boolean,
    required?: boolean,
    className?: string,
    labelClass?: string,
    size?: 'small' | 'default'
}

export default function BASwitch(props: propsType) {
    const { label, value, onChange, disabled, required, className, labelClass, size } = props;

    return (
        <BABox className={`${className}`}>
            <div className="flex items-center justify-left">
                {label && (
                    <div className={`text-xs font-medium text-gray-700 mr-20 ${labelClass}`}>
                        {label}
                        {required && <span className="text-red-500 mr-3">*</span>}
                        <span className='ml-2'>{value ? "" : ""}</span>
                    </div>
                )}
                <Switch
                    size={size} 
                    checked={value} 
                    onChange={onChange} 
                    disabled={disabled} 
                />
            </div>
        </BABox>
    );
}

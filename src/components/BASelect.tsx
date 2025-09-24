

import { message, Select } from "antd"
import BABox from "./BABox";
import { useState } from "react";
import { Get } from "../config/apimethods";
type propsType = {
    onChange: any,
    options: {
        value: any,
        label: string,
        disabled?: boolean,
    }[],
    value: any,
    label: string,
    disabled?: boolean,
    multiple?: boolean,
    required?: boolean,
    width?: any,
    onFocus?: any,
    loading?: any,
    showSearch?: boolean
    api?: string,
    apiParams?: any
    valueField?: string
    displayField?: string
}
export default function BASelect(props: propsType) {
    const { onChange, options, value, label, disabled, multiple, width, required, onFocus, loading, showSearch, api, apiParams, valueField, displayField } = props;
    const [listData, setListData] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);

    const handleChange = (ev: any, option: any) => {
        onChange(ev, option);
    }

    const getApiData = async () => {
        if (!api) return;
        setLoader(true);
        Get(api, null, apiParams).then((res: any) => {
            console.log(res, valueField, displayField);
            let arr = res.map((item: any) => ({
                value: item[valueField || ''],
                label: item[displayField || ''],
                ...item,
            }))
            setListData([...arr]);
        }).catch((err: any) => {
            message.error(err.message);
        }).finally(() => {
            setLoader(false);
        });
    }

    return <>
        <BABox className="">
            {label && <div className="text-xs text-black mb-1">{label}<span className="text-red-500 ml-1">{required && "*"}</span></div>}
            <BABox >
                <Select
                    showSearch={showSearch}
                    loading={loading || loader}
                    onFocus={(ev: any) => {
                        if (api) {
                            getApiData();
                        }
                        onFocus(ev);
                    }}
                    mode={multiple ? "multiple" : undefined}
                    variant='outlined'
                    disabled={disabled}
                    value={value}
                    style={{ width: width ? width : '100%', height: '40px' }}
                    onChange={handleChange}
                    options={api ? listData : options}
                />
            </BABox>
        </BABox>
    </>
}
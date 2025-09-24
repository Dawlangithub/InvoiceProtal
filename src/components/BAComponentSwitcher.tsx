

import BAButton from "./BAButton";
import BAinput from "./BAInput";
import BAPasswordInput from "./BAPasswordInput";
import BASearchLookup from "./BASearchLookup";
import BASelect from "./BASelect";
import BASwitch from "./BASwitch";
import BADate from "./BADate";
import BABox from "./BABox";
import BAPera from "./BAPera";
import BAFieldset from "./BAFieldset";
import { BAUpload } from "./index";
import BADragDropFile from "./BADragDrop";
import BATextarea from "./BATextarea";
import { formatDateDMY } from "../config/helpers";
import BANumberInput from "./BANumberInput";
import BAImagePicker from "./BAImagePicker";


type propsType = {
    model: any,
    setModel: any,
    element: formElement,
    disabledForm?: boolean,
    rowChangeEv?: any,
    rowIndex?: number,
}

export default function BAComponentSwitcher(props: propsType) {
    const { model, setModel, element, disabledForm, rowChangeEv, rowIndex } = props;
    const fillModel = (key: any, val: any) => {
        model[key] = val;
        setModel({ ...model });
    };

    const handleLookupBlur = (key: string, value: string, controller: string, element: formElement) => {
        // Get the current value from model[controller] for the specified key
        const currentValue = model[controller]?.[key];
        // Only proceed if the value does not match the current value
        if (currentValue !== value && currentValue) {
            const lookupData = Object.keys(model[controller] || {}).reduce((acc, objKey) => {
                acc[objKey] = objKey === key ? value : '';
                return acc;
            }, {} as Record<string, string>);
            if (element.reqFields?.length) {
                Object.keys(lookupData).forEach(key => {
                    if (!element.reqFields?.includes(key)) delete lookupData[key]
                })
            }
            if (element.fieldAlias) lookupData[key] = lookupData[element.fieldAlias]
            // Update the model with the modified lookupData
            setModel({ ...model, ...lookupData, [element.controller]: undefined });
            if (rowChangeEv) {
                rowChangeEv(null, lookupData, element, rowIndex)
            }
            return;
        } setModel({ ...model, [element.controller]: undefined })
    };


    const handleMultiSelect = (element: formElement, selectedRows: any[], isMultiple?: boolean, arrKey?: string) => {
        if (isMultiple && arrKey) {
            const modifiedData = [];
            for (var i = 0; i < selectedRows.length; i++) {
                const lookupData = { ...selectedRows[i] }
                if (element.fieldAlias) lookupData[element.key] = lookupData[element.fieldAlias];
                if (element.reqFields?.length) Object.keys(lookupData).forEach(key => {
                    if (!element.reqFields?.includes(key)) delete lookupData[key]
                })
                modifiedData.push({ ...lookupData })
            }
            setModel({ ...model, [arrKey]: modifiedData })
        }
    }

    const uploadFile = (blob: Blob, key: string) => {
        setModel({ ...model, [key]: blob })
    }

    switch (element.elementType) {
        case "input":
            return <BAinput
                maxlength={element.maxlength}
                mask={element.mask}
                type={element.type}
                value={model[element.key]}
                textAlign={element.textAlign}
                onBlur={() => {
                    if (element.blurEv) element.blurEv(model[element.key], rowIndex, element)
                }}
                onChange={(ev: any) => {
                    setModel({
                        ...model,
                        [element.key]: element.mask ? ev : (element.type == 'number' ? Number(ev.target.value) : ev.target.value)
                    })
                    if (rowChangeEv) {
                        rowChangeEv(ev, (element.type == 'number' ? Number(ev.target.value) : ev.target.value), element, rowIndex)
                    }
                    if (element.ChangeEv) {
                        element.ChangeEv(rowIndex, element.key, (element.type == 'number' ? Number(ev.target.value) : ev.target.value), element, rowIndex);
                    }
                }}
                placeholder={element.placeholder}
                disabled={disabledForm || element.disabled}
                required={element.required}
                label={element.label}
                onFocus={() => element.focusEv ? element.focusEv(model[element.key]) : {}}
            />
        case "number":
            return <BANumberInput
                decimalScale={element.removeDecimals ? 0 : 2}
                value={model[element.key]}
                onBlur={() => {
                    if (element.blurEv) element.blurEv(model[element.key], rowIndex, element)
                }}
                onChange={(ev: any) => {
                    setModel({
                        ...model,
                        [element.key]: element.mask ? ev : (element.type == 'number' ? Number(ev) : ev)
                    });
                    if (rowChangeEv) {
                        rowChangeEv(ev, (element.type == 'number' ? Number(ev) : ev), element, rowIndex)
                    }
                    if (element.ChangeEv) {
                        element.ChangeEv(rowIndex, element.key, (element.type == 'number' ? Number(ev) : ev), element, rowIndex);
                    }
                }}
                placeholder={element.placeholder}
                disabled={disabledForm || element.disabled}
                required={element.required}
                label={element.label}
                onFocus={() => element.focusEv ? element.focusEv(model[element.key]) : {}}
            />
        case "textarea":
            return <BATextarea
                value={model[element.key]}
                onBlur={() => {
                    if (element.blurEv) element.blurEv(model[element.key], rowIndex, element)
                }}
                onChange={(ev: any) => {
                    setModel({
                        ...model,
                        [element.key]: ev.target.value
                    })
                    if (rowChangeEv) {
                        rowChangeEv(ev, ev.target.value, element, rowIndex)
                    }
                    if (element.ChangeEv) {
                        element.ChangeEv(rowIndex, element.key, ev.target.value, element, rowIndex);
                    }
                }}
                placeholder={element.placeholder}
                disabled={disabledForm || element.disabled}
                required={element.required}
                label={element.label}
            />
        case "passwordinput":
            return <BAPasswordInput
                value={model[element.key]}
                onChange={(e: any) => {
                    setModel({ ...model, [element.key]: e.target.value })
                    if (rowChangeEv) {
                        rowChangeEv(e, (element.type == 'number' ? Number(e.target.value) : e.target.value), element, rowIndex)
                    }
                }}
                placeholder={element.placeholder}
                disabled={disabledForm || element.disabled}
                required={element.required}
                label={element.label}
            />
        case "button":
            return <BAButton
                onClick={element.onClick}
                disabled={disabledForm || element.disabled}
                label={element.label}
                loading={element.loading}
            />
        case "select":
            return <BASelect
                api={element.api}
                apiParams={typeof element.apiParams === 'object' ? element.apiParams : typeof element.apiParams === "function" ? element.apiParams(rowIndex) : null}
                loading={element.loading}
                onFocus={() => element.focusEv ? element.focusEv(model[element.key], rowIndex) : {}}
                multiple={element.multiple}
                disabled={disabledForm || element.disabled}
                label={element.label}
                valueField={element.valueField}
                displayField={element.displayField}
                showSearch={element.showSearch}
                onChange={(e: any, obj: any) => {
                    setModel({ ...model, [element.key]: e });
                    if (rowChangeEv) {
                        rowChangeEv(e, (element.type == 'number' ? Number(e) : e), element, rowIndex)
                    }
                    if (element.ChangeEv) {
                        element.ChangeEv(rowIndex, element.key, e, element, rowIndex, obj);
                    }
                }}
                options={element.options ?? []}
                required={element.required}
                value={model[element.key]}
            />
        case "lookup":
            return <BASearchLookup
                label={element.label}
                controller={element.controller}
                data={element.data}
                params={element.params}
                config={element.config}
                displayField={element.displayField || ""}
                searchBy={element.searchBy}
                value={model && model[element.key]}
                multiple={element.multiple}
                required={element.required}
                allowMultiple={element.multiSelect}
                disabled={disabledForm || element.disabled}
                type={element.type}
                onSelectMultiple={(data: any[]) => handleMultiSelect(element, data, element.multiSelect, element.arrKey)}
                onCancel={() => {
                    if (element.onCancel) {
                        element.onCancel(rowIndex);
                    }
                }}
                onRowClick={async (i: number, data: any, list: any[]) => {
                    console.log(i)
                    const lookupData = { ...data };
                    setModel({ ...model, [element.key]: lookupData[element.valueField || ""] });
                    if (element.ChangeEv) {
                        element.ChangeEv(rowIndex, lookupData[element.key], lookupData, element, list);
                    }
                    if (rowChangeEv) {
                        rowChangeEv(null, lookupData, element, rowIndex)
                    }
                }}
                useLookup={element.useLookup}
                onBlur={() => handleLookupBlur(element.fieldAlias || element.key, model[element.key], element.controller, element)}
                onChange={(e: any, val: any, obj: any) => {
                    if (val) {
                        fillModel(element.key, val)
                        if (element.ChangeEv) {
                            element.ChangeEv(e, val, obj, element, rowIndex);
                        }
                    }
                    else if (!element.multiple) {
                        const lookupData: any = {};
                        if (element.reqFields?.length) {
                            for (var i = 0; i < element.reqFields.length; i++) {
                                lookupData[element.reqFields[i]] = ""
                            }
                        }
                        (element.arrKey && (!val || !obj)) ? setModel({ ...model, [element.arrKey]: [], ...lookupData }) : setModel({ ...model, [element.key]: e ? e.target.value : "", ...lookupData })
                        if (rowChangeEv) {
                            rowChangeEv(e, (element.type == 'number' ? Number(val) : val), element, rowIndex)
                        }
                    } else {
                        if (element.arrKey && (!val || !obj)) setModel({ ...model, [element.arrKey]: [], [element.key]: "" })
                    }
                }}
            />
        case "datepicker":
            return (
                <BADate
                    required={element.required}
                    disabled={disabledForm || element.disabled}
                    label={element.label}
                    value={model[element.key]}
                    onChange={(date: any, dateString: any) => {
                        if (element.ChangeEv) {
                            element.ChangeEv(element.key, date, dateString);
                        } else setModel({ ...model, [element.key]: (dateString) });
                        if (rowChangeEv) {
                            rowChangeEv(date, dateString, element, rowIndex)
                        }
                    }}
                />
            )
        case "boolean":
            return (
                <BASwitch
                    required={element.required}
                    disabled={element.disabled}
                    label={element.label}
                    value={model && model[element.key] ? model[element.key] : null}
                    onChange={(e: any) => {
                        setModel({ ...model, [element.key]: e });
                        if (element.ChangeEv) {
                            element.ChangeEv(null, e);
                        }
                        if (rowChangeEv) {
                            rowChangeEv(e, e, element, rowIndex)
                        }
                    }
                    }
                    className="mt-2"
                />
            );
        case "custombody":
            return (
                <BABox className={element.className}>
                    {element.body}
                </BABox>
            );
        case "heading":
            return (
                <BABox>
                    <BAPera className="text-xl font-bold border-b">{element.label}</BAPera>
                </BABox>
            );
        case "text":
            return (
                <BABox>
                    <BAPera className="font-bold">{element.label}</BAPera>
                    <BAPera className="">{element.key.toLowerCase().includes("date")
                        ? formatDateDMY(model[element.key])
                        : model[element.key]}</BAPera>
                </BABox>
            );
        case "fieldset":
            return (
                <>
                    <BAFieldset title={element.label} body={element.body} />
                </>
            );
        case "upload":
            return (
                <>
                    <BAUpload onFileUpload={(file) => uploadFile(file, element.key)} uploadText={element.label} listType={element.listType} getUrl={model[element.key]} />
                </>
            );
        case "imageupload":
            return (
                <>
                    <BAImagePicker
                        onChange={(file) => fillModel(element.key, file)}
                        uploadText={element.label}
                        value={model[element.key]}
                    />
                </>
            );
        case "dragfile":
            return (
                <>
                    <BADragDropFile onFileUpload={(file) => uploadFile(file, element.key)} uploadText={element.label} />
                </>
            )
        case 'spacer':
            return <div className={`element.className border-[4px] border-gray-200 rounded-2xl`} />

        default:
            return null;
    }

}

export type formElement = {
    col: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10 | 10.5 | 11 | 11.5 | 12,
    elementType: "number" | "input" | "currency" | "datepicker" | "select" | "radio" | "date" | "lookup" | "checkbox" | "boolean" | "textarea" | "passwordinput" | "button" | "imagepicker" | "custombody" | "heading" | "fieldset" | "upload" | "text" | "dragfile" | "imageupload" | "spacer",
    key: string,
    label: string,
    placeholder?: string,
    textAlign?: "left" | "right" | "center" | undefined,
    mask?: string,
    fillObjName?: string,
    api?: string,
    fillObj?: any,
    valueField?: string | undefined,
    options?: any,
    ChangeEv?: any,
    onCancel?: any,
    blurEv?: any,
    focusEv?: any,
    required?: boolean,
    removeDecimals?: boolean,
    isHide?: boolean,
    multiple?: boolean,
    maxlength?: number,
    disabled?: any,
    loading?: boolean,
    showSearch?: boolean,
    onClick?: any,
    body?: any,
    controller?: any,
    type?: any,
    apiParams?: any,
    config?: any,
    displayField?: any,
    singleValue?: any,
    className?: string
    multiSelect?: boolean,
    arrKey?: string,
    validatePeriod?: boolean,
    data?: any,
    showTime?: boolean,
    validateCodeKey?: string,
    validateController?: string,
    fieldAlias?: string;
    reqFields?: string[];
    useLookup?: boolean;
    aliasModel?: { actualKey: String; modelKey: String }[];
    params?: any,
    searchBy?: any,
    listType?: string
}
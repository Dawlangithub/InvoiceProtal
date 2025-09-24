;

import BABox from "./BABox";
import BAComponentSwitcher, { formElement } from "./BAComponentSwitcher";
import React, { useState } from "react";
import BAButton from "./BAButton";
import BAIconButton from "./BAIconButton";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Empty } from "antd";

type actionType = {
  icon: React.ReactNode;
  onClick: (row?: any, index?: number) => void;
  disabled?: boolean | ((row: any) => boolean);
};

type propsType = {
  datasourse: any[];
  cols: {
    key: string;
    label: string;
    displayField?: (data: any, index: number) => any;
    className?: string;
    HeaderField?: any;
    width?: any;
    element: formElement;
  }[];
  loading?: boolean;
  onChange?: any;
  closeModal?: any;
  setDatasourse?: any;
  onAddRow?: any;
  onDeleteRow?: any;
  action?: actionType[];
  disableAction?: boolean;
  updatedArr?: any[];
  setUpdatedArr?: any;
  pageSize?: string | number;
  page?: string | number;
  disableAdd?: boolean;
  disableForm?: boolean;
  disabled?: (row: any) => void | boolean;
};

export default function BAFormGrid(props: propsType) {
  const {
    datasourse,
    cols,
    loading,
    setDatasourse,
    onAddRow,
    onDeleteRow,
    action,
    disableAction,
    updatedArr,
    setUpdatedArr,
    disableForm,
    disableAdd
  } = props;
  const [rowObj, setRowObj] = useState({});
  console.log(rowObj)

  const addRow = () => {
    let obj = {};
    if (onAddRow) {
      obj = onAddRow() || {};
    }
    setDatasourse([...datasourse, obj]);
  };

  const deleteRow = (index: number) => {
    datasourse.splice(index, 1);
    if (onDeleteRow) {
      onDeleteRow();
    }
    setDatasourse([...datasourse]);
  };

  return (
    <BABox className={"overflow-x-auto"}>
      {datasourse && datasourse.length > 0 ? (
        <>
          <table
            className={
              loading
                ? "blur-background min-w-full divide-y rounded-lg overflow-hidden divide-gray-200 border"
                : "min-w-full divide-y rounded-lg overflow-hidden divide-gray-200 border"
            }
          >
            <thead className="bg-[##242b64]">
              <tr>
                {!disableAction && <th className="w-[50px]"></th>}
                {cols.map((col: any, index: number) => (
                  <th
                    key={index}
                    className={`p-2 text-center text-xs font-medium text-white tracking-wider ${col.className ? col.className : ""
                      }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {datasourse.map((row: any, rowIndex: number) => (
                <React.Fragment key={rowIndex}>
                  <tr
                  // style={{height:'12px'}}
                  >
                    {!disableAction && (
                      <td className="text-center ">
                        <DeleteOutlined style={{ color: `${disableForm ? "lightgray" : ""}` }} className={`text-xl m-1 hover:text-red-600`} onClick={() => !disableForm && deleteRow(rowIndex)} />
                        {action &&
                          action?.map((item: actionType, key) => (
                            <BAIconButton
                              key={key}
                              className="m-1"
                              icon={item.icon}
                              disabled={
                                typeof item.disabled === "function"
                                  ? item.disabled(row)
                                  : item.disabled
                              }
                              onClick={() => item.onClick(row, rowIndex)}
                            />
                          ))}
                      </td>
                    )}
                    {cols.map((col: any, colIndex: number) => (
                      <td
                        key={colIndex}
                        className={`whitespace-nowrap gap-4 p-1 text-sm text-gray-900 w-[${col.width ? col.width : 'full'}] ${col.className ? col.className : ""
                          }`}
                      >
                        {col.displayField ? (
                          col.displayField(row, rowIndex)
                        ) : col.element ? (
                          <BAComponentSwitcher
                            disabledForm={disableForm}
                            model={datasourse[rowIndex]}
                            setModel={setRowObj}
                            element={{
                              ...col.element,
                              disabled: typeof col.element.disabled === "function" ? col.element.disabled(row) : col.element.disabled,
                              options: typeof col.element.options === "function" ? col.element.options(row, rowIndex) : col.element.options,
                              fillObj: row[col.element.fillObjName]
                            }}
                            rowChangeEv={(
                              ev: any,
                              val: any,
                              element: any,
                              index: number
                            ) => {
                              console.log("rowChangeEv", ev, val, element, index);

                              datasourse[rowIndex] = {
                                ...datasourse[rowIndex],
                                [element.key]: val ? val : ""
                              };

                              setDatasourse([...datasourse]);
                              if (updatedArr) {
                                const existingIndex = updatedArr.findIndex(
                                  (item) =>
                                    item.Seq_No === datasourse[rowIndex].Seq_No
                                );
                                if (existingIndex === -1)
                                  updatedArr.push({ ...datasourse[rowIndex] });
                                else
                                  updatedArr[existingIndex] =
                                    datasourse[rowIndex];
                                setUpdatedArr([...updatedArr]);
                              }
                            }}
                            rowIndex={rowIndex}
                          />
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.expanded && (
                    <tr className="border-x border-b">
                      <td className="text-center">
                        {/* <EnterOutlined className="-scale-x-100 text-lg" /> */}
                      </td>
                      <td colSpan={cols.length}>{row.expanded}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!disableAdd && !disableAction && <tr>
                <td onClick={disableForm ? undefined : addRow} className="text-center cursor-pointer p-2 hover:bg-gray-400">
                  <PlusOutlined style={{ color: `${disableForm ? "lightgray" : ""}` }} className="text-xl" />
                </td>
              </tr>}
            </tbody>
          </table>
        </>
      ) : (
        <BABox className="flex justify-center flex-col items-center p-2 gap-4">
          <Empty/>
          <BABox>
            <BAButton disabled={disableAdd || disableForm} onClick={addRow} label={"Add Row"} />
          </BABox>
        </BABox>
      )}
    </BABox>
  );
}

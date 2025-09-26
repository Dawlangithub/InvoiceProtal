import BABox from "./BABox";
import { BACheckbox, BAIconButton, BAinput, BALoader, BAPera } from ".";
import { SearchOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import classNames from "classnames";
import { formatDateDMY } from "../config/helpers";
import { primary } from "../config/theme/variable";

type propsType = {
  datasourse: any[];
  cols: {
    key: string;
    label: string;
    displayField?: (data: any, i: number) => any;
    className?: string;
    HeaderField?: any;
  }[];
  loading?: boolean;
  onChange?: any;
  displayField?: any;
  closeModal?: any;
  onRowClick?: any;
  allowMultiple?: boolean;
  setDataSource?: any;
  className?: string;
  allowSearch?: boolean;
  allowDelete?: boolean;
  onDelete?: (index: number) => void;
  colSearchObj?: any,
  handleSearch?: (pgObj?: any, SearchObj?: any) => void;
};

export default function BAGrid(props: propsType) {
  const {
    datasourse,
    cols,
    loading,
    displayField,
    onRowClick,
    allowMultiple,
    setDataSource,
    className,
    allowSearch,
    handleSearch,
    colSearchObj = {},
    allowDelete,
    onDelete
  } = props;
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [gridSearchObj, setGridSearchObj] = useState<any>(colSearchObj);

  const onRowSelect = (data: any, i: number, checked: boolean) => {
    if (datasourse.length) {
      const listData = [...datasourse];
      listData[i] = { ...data, isSelected: checked };
      const selectionRemaining = listData.find((el) => !el.isSelected);
      if (!selectionRemaining) setIsAllSelected(true);
      else setIsAllSelected(false);
      setDataSource(listData);
    }
  };

  const onSelectAll = (checked: boolean) => {
    setIsAllSelected(checked);
    const listData = [...datasourse];
    listData.map((item) => ({ ...item, isSelected: checked }));
    setDataSource(listData.map((item) => ({ ...item, isSelected: checked })));
  };

  const indeterminate =
    !isAllSelected && datasourse?.find((el) => el.isSelected);

  return (
    <BABox
      className={classNames("overflow-x-auto h-[calc(100vh-16rem)]", className)}
    >
      <table
        style={{ tableLayout: "auto" }}
        className={
          loading
            ? "blur-background min-w-full divide-y overflow-hidden divide-gray-200"
            : "min-w-full divide-y  overflow-hidden divide-gray-200"
        }
      >
        <thead style={{ backgroundColor: primary, color: "white" }}>
          <tr>
            {allowSearch && <th></th>}
            {allowMultiple && (
              <th>
                <BACheckbox
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={isAllSelected || false}
                  isMultiple={indeterminate}
                />
              </th>
            )}
            {allowDelete && <th
              className={`p-1 text-left text-xs font-medium text-plain tracking-wider`}
            >Action</th>}
            {cols && Array.isArray(cols) && cols.map((col: any, index: number) => (
              <th
                key={index}
                className={`p-1 text-center text-xs font-medium tracking-wider ${col.className ? col.className : ""
                  }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {allowSearch && (
            <tr>
              {allowMultiple && <td></td>}
              {allowDelete && <td></td>}
              <td>
                <BABox className="text-center flex">
                  <BAIconButton
                    type="primary"
                    className="bg-transparent shadow-none"
                    onClick={() =>
                      handleSearch ? handleSearch(null, gridSearchObj) : {}
                    }
                    icon={
                      <SearchOutlined className="text-black hover:text-white" />
                    }
                  />
                  {Object.entries(gridSearchObj).length > 0 && (
                    <BAIconButton
                      onClick={() => {
                        setGridSearchObj({});
                        let entries = Object.entries(gridSearchObj).filter(
                          (c) => c[0] && c[1]
                        );
                        if (entries.length > 0 && handleSearch) {
                          handleSearch(null, {});
                        }
                      }}
                      icon={<CloseOutlined />}
                    />
                  )}
                </BABox>
              </td>

              {cols && Array.isArray(cols) && cols.map((col: any, index: number) => (
                <td
                  key={index}
                  className={classNames(
                    `text-left p-2 text-xs font-medium text-plain tracking-wider ${col.className ? col.className : ""
                    }`,
                  )}
                >
                  <BAinput
                    onKeyDown={(event: any) => {
                      if (event.key === "Enter" && handleSearch) {
                        handleSearch(null, gridSearchObj);
                      }
                    }}
                    value={gridSearchObj[col.key]}
                    onChange={(ev: any) => {
                      gridSearchObj[col.key] = ev.target.value;
                      setGridSearchObj({ ...gridSearchObj });
                    }}
                    label={""}
                  />
                </td>
              ))}
            </tr>
          )}
          {datasourse && Array.isArray(datasourse) && datasourse.length > 0 ? (
            datasourse.map((row: any, rowIndex: number) => (
              <tr
                key={rowIndex}
                className={displayField ? " cursor-pointer transition " : row.rowClass && typeof row.rowClass === "function" ? row.rowClass(row) : ""}
                // style={{height:'12px'}}
                style={{ backgroundColor: row.rowColor && typeof row.rowColor === "function" ? row.rowColor(row) : rowIndex % 2 === 1 ? "" : "#edf0f4" }}
                onClick={() => (onRowClick ? onRowClick(rowIndex, row) : {})}
              >
                {allowSearch && <td></td>}
                {allowMultiple && (
                  <td className="pl-1">
                    <BACheckbox
                      checked={row.isSelected || false}
                      onChange={(e) =>
                        onRowSelect(row, rowIndex, e.target.checked)
                      }
                    />
                  </td>
                )}
                {allowDelete && onDelete && <td
                  className={`p-1 whitespace-nowrap text-sm text-gray-900 h-0.5`}
                ><DeleteOutlined className="text-xl m-1 hover:text-red-600" onClick={() => onDelete(rowIndex)} /></td>}
                {cols && Array.isArray(cols) && cols.map((col: any, colIndex: number) => (
                  <td
                    key={colIndex}
                    className={`p-1 whitespace-nowrap text-sm text-gray-900 ${col.className ? col.className : ""
                      }`}
                  >
                    {col.displayField
                      ? col.displayField(row, rowIndex)
                      : col.key.toLowerCase().includes("date")
                        ? formatDateDMY(row[col.key])
                        : row[col.key]}
                    {col.HeaderField ? col.HeaderField(rowIndex) : ""}
                  </td>
                ))}
              </tr>
            ))
          ) : loading ? (
            <tr>
              <td colSpan={(cols && Array.isArray(cols) ? cols.length : 0) + 1} className="text-center py-4"><BALoader /></td></tr>
          ) : (
            <tr>
              <td colSpan={(cols && Array.isArray(cols) ? cols.length : 0) + 1} className="text-center py-4">
                <BABox className="flex justify-center w-full">
                  <BAPera>No Data Found</BAPera>
                </BABox>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </BABox>
  );
}

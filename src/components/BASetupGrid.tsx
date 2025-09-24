;
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import BAIconButton from "./BAIconButton";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  FileExcelOutlined,
  QrcodeOutlined,
  SettingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import BABox from "./BABox";
import BAButton from "./BAButton";
import BAPagination from "./BAPagination";
import BAModal from "./BAModal";
import BAFormElement from "./BAFormElement";
import { formElement } from "./BAComponentSwitcher";
import { DatePicker, message, Popconfirm, QRCode } from "antd";
import BALoader from "./BALoader";
import BAinput from "./BAInput";
import classNames from "classnames";
import { GeneralCoreService } from "../config/GeneralCoreService";
import nodata from "../assets/nodatafound.png";
import BAScreenWrapper from "../reuseableLayout/BAScreenWrapper";
import { primary } from "../config/theme/variable";
import { formatDateDMY, formattedNumber } from "../config/helpers";
import BASelect from "./BASelect";
import BABackdropLoader from "./BABackdropLoader";
import BADate from "./BADate";
import BANumberInput from "./BANumberInput";
import BAPera from "./BAPera";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { invoiceRunService, invoiceExecuteService } from "../config/apiservices";
import { LuFilterX } from "react-icons/lu";
import CardView from "./CardView";
import { IoMdDownload } from "react-icons/io";
import instance from "../config/apimethods";
import BACheckbox from "./BACheckbox";
dayjs.extend(isSameOrBefore);

type propsType = {
  cols: any[];
  controller: string;
  apiName?: string;
  exportUrl?: string;
  onAddEdit?: any;
  onView?: any;
  title: string;
  sortColumn?: string;
  sortDirection?: string;
  formElement?: formElement[];
  extraActions?: {
    displayField: any;
    isHide: boolean;
  }[];
  disableAdd?: boolean;
  disableEdit?: boolean;
  disablePost?: boolean;
  disableView?: boolean;
  disableDelete?: boolean;
  disableExport?: boolean;
  extraParams?: any;
  exportParams?: any;
  extraHeaders?: any;
  getDataTrigger?: any;
  modelGetter?: any;
  rec_id?: any;
  conditionalColumns?: { label: string; displayField: any }[];
  getByRequest?: boolean;
  modelAlias?: any;
  customButton?: React.ReactNode[];
  fieldsToDelete?: string[];
  convertToNumber?: string[];
  disableCompId?: boolean;
  reqFields?: string[];
  isUpdateReq?: boolean;
  extraBody?: any;
  searchParams?: any;
  showDateRangePicker?: boolean;
};

export default forwardRef(function BASetupGrid(props: propsType, ref: any) {
  const {
    cols,
    controller,
    extraParams = {},
    onAddEdit,
    title,
    formElement,
    disableAdd,
    disableEdit,
    disableDelete,
    extraActions,
    extraHeaders = [],
    conditionalColumns,
    modelGetter,
    rec_id,
    sortColumn,
    sortDirection,
    getByRequest,
    modelAlias,
    customButton,
    fieldsToDelete,
    convertToNumber,
    reqFields,
    extraBody,
    searchParams,
    showDateRangePicker,
    disableExport,
  } = props;
    console.log("🚀  ~ BASetupGrid.tsx ~ BASetupGrid ~ controller: ", controller);
  const [listData, setListData] = useState<any>([]);
  const [openModal, setOpenModal] = useState(false);
  const [model, setModel] = useState<any>({});
  const [saveLoader, setSaveLoader] = useState(false);
  const [view, setView] = useState<boolean>(false)
  const [singleRecordLoader, setSingleRecordLoader] = useState(false);
  const [printLoader, setPrintLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [gridSearchObj, setGridSearchObj] = useState<any>({});
  const [infoModal, setInfoModal] = useState(false);
  const [infoRow, setInfoRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationConfig, setPaginationConfig] = useState({
    pageSize: 10,
    page: 1,
    totalRecords: 0,
  });
  const [dateRange, setDateRange] = useState<[any, any] | null>(
    showDateRangePicker ? [dayjs().startOf("month"), dayjs()] : null
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addNewClick = () => {
    setView(false);
    if (formElement) {
      setModel({});
      if (modelGetter) modelGetter({});
      setOpenModal(true);
    } else {
      if (onAddEdit) {
        onAddEdit();
      }
    }
  };

  const editClick = (row: any) => {
    setView(false)
    if (row?.Posted || row?.Status === 1 || row?.Submit)
      return message.error(
        "Can't edit the selected transaction as it is submitted."
      );
    else if (formElement) {
      if (getByRequest) getRecordById(row[rec_id]);
      else {
        setOpenModal(true);
        if (reqFields?.length) {
          const fieldsToAdd = Object.fromEntries(
            Object.entries(row).filter(([key]) => reqFields.includes(key))
          );
          return setModel({
            ...fieldsToAdd,
          });
        }
        setModel({
          ...row,
        });
      }
    } else {
      if (onAddEdit) {
        onAddEdit(row);
      }
    }
  };

  const getData = (pgObj?: any, SearchObj?: any, updatedDateRange?: [any, any] | null) => {
    setLoader(true);
    const updatedSearchObj = Object.fromEntries(
      Object.entries(SearchObj ? SearchObj : gridSearchObj).filter(([_, value]) => value !== undefined && value !== null)
    );

    const searchBy = Object.entries({ ...updatedSearchObj, ...extraParams }).map(([Key, Value]) => ({ Key, Value }));

    const currentDateRange = updatedDateRange !== undefined ? updatedDateRange : dateRange;

    const dateRangeParams =
      currentDateRange && showDateRangePicker
        ? {
          Start: currentDateRange[0]
            ? dayjs(currentDateRange[0]).format("YYYY-MM-DD")
            : null,
          End: currentDateRange[1]
            ? dayjs(currentDateRange[1]).format("YYYY-MM-DD")
            : null,
        }
        : {};

    GeneralCoreService(`${controller}`)
      .Register(
        {
          pageNo: pgObj ? pgObj.page : paginationConfig.page,
          pageSize: pgObj ? pgObj.pageSize : paginationConfig.pageSize,
          select: cols.map((col) => col.key).filter(Boolean).join(",") + ",id,createdAt",
          searchBy: JSON.stringify(searchBy),
          order: JSON.stringify({ [sortColumn ? sortColumn : "createdAt"]: sortDirection || "DESC" }),
          ...extraParams,
          ...searchParams ? { ...searchParams } : {},
          ...dateRangeParams,
        }
      )
      .then((res: any) => {
        if (res?.Data?.List) {
          setListData([...res.Data.List]);
          setPaginationConfig({
            ...paginationConfig, totalRecords: res.Data.Count
          });
        } else {

          message.error(res.message || "An error occurred.");
        }
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        message.error("Failed to fetch data. Please try again.");
      });
  };

  useImperativeHandle(ref, () => ({
    invokeChildFunction: getData,
  }));

  const selectRow = (row: any, isChecked: boolean) => {
    const updatedList = listData.map((item: any) =>
      item === row ? { ...item, isSelected: isChecked } : item
    );
    setListData(updatedList);
    setSelectedRows(updatedList.filter((x: any) => x.isSelected));
  };

  const allSelected = listData.length > 0 && listData.every((x: any) => x.isSelected);
  const toggleSelectAll = (isChecked: boolean) => {
    const updatedList = listData.map((item: any) => ({ ...item, isSelected: isChecked }));
    setListData(updatedList);
    setSelectedRows(updatedList.filter((x: any) => x.isSelected));
  };

  const hasCheckboxColumn = cols?.some((c: any) => c?.type === "checkbox");
  const colsWithoutCheckbox = hasCheckboxColumn ? cols.filter((c: any) => c?.type !== "checkbox") : cols;


  const deleteRecord = (id: any) => {
    setPrintLoader(true);
    GeneralCoreService(controller)
      .DeleteOne(id.toString())
      .then(() => {
        message.success("Record Deleted Successfully");
        getData();
      })
      .catch((err: any) => {
        message.error(err?.error);
      }).finally(() => {
        setPrintLoader(false);
      });
  };

  const getRecordById = (id: any) => {
    setOpenModal(true);
    setSingleRecordLoader(true);
    GeneralCoreService(controller)
      .GetOne(id)
      .then((res: any) => {
        setModel({ ...res.data });
        if (modelGetter) modelGetter({ ...res.data });
        setSingleRecordLoader(false);
        setOpenModal(true);
      })
      .catch((err: any) => {
        message.error(err?.error);
        setSingleRecordLoader(false);
      });
  };

  const transformedModel = (aliasObj: any) => {
    return Object.keys(aliasObj).reduce((acc: any, aliasKey) => {
      const originalKey = aliasObj[aliasKey];

      // Check if the originalKey exists in model
      if (model.hasOwnProperty(originalKey)) {
        acc[aliasKey] = model[originalKey]; // Add the alias key and its value
      }

      return acc;
    }, {});
  };

  const save = () => {
    setSaveLoader(true);
    const data = modelAlias
      ? { ...model, ...transformedModel(modelAlias), InActive: model.InActive ? 1 : 0 }
      : { ...model, InActive: model.InActive ? 1 : 0 };

    if (fieldsToDelete)
      fieldsToDelete.forEach((field) => {
        // @ts-ignore
        delete data[field];
      });
    if (convertToNumber && Array.isArray(convertToNumber)) {
      convertToNumber.forEach((field) => {
        if (data[field] !== undefined) {
          data[field] = Number(data[field]) || 0; // Convert to number or default to 0
        }
      });
    }
    GeneralCoreService(controller)
      .Save({ ...data }, model[rec_id])
      .then(() => {
        message.success("Record Saved Successfully");
        setSaveLoader(false);
        setOpenModal(false);
        getData();
      })
      .catch((err: any) => {
        message.error(err?.error);
        setSaveLoader(false);
      });
  };

  const exportToExcel = (controller?: string) => {
    const url = `${instance.defaults.baseURL}${controller}/export?type=xlsx&Start=${dateRange?.[0]}&End=${dateRange?.[1]}`
    window.open(url, '_blank');
  }

  const downloadSelectedRows = (row: any) => {
    const invoiceNos = row.map((r: any) => r.InvoiceNo).join(",");
    const url = `${instance.defaults.baseURL}${controller}/download-zip?invoiceNo=${invoiceNos}`;
    window.open(url, '_blank');
  }

  const executeSelectedRows = (row: any) => {
    const invoiceNo = row.map((r: any) => r.InvoiceNo).join(",");
    invoiceExecuteService.GetAll({ invoiceNo }).then((res: any) => {
      message.success(res.Message);
    }).catch((err: any) => {
      message.error(err?.error);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (extraParams?.length) getData()
  }, [extraParams])

  return (
    <>
      <BABackdropLoader loading={printLoader} />
      <BAModal
        width={400}
        title={""}
        open={infoModal}
        close={setInfoModal}
        content={
          <>
            {infoRow && (
              <BABox>
                {(() => {
                  const toBool = (v: any) => v === true || v === 1 || String(v).toLowerCase() === "true";
                  const isFbr = infoRow?.isFbr ?? toBool(infoRow?.FBR);
                  const isProcessed = infoRow?.isProcessed ?? toBool(infoRow?.IsProcessed);
                  return (
                    <>
                      {isFbr && isProcessed && (
                        <>
                          <BABox className="flex justify-center mb-2">
                            <QRCode value={infoRow?.FBR_INV_NO} size={150} />
                          </BABox>
                          <BABox className="bg-gray-50 p-1 rounded mb-4 break-words">
                            <BAPera className="text-xs text-center">{infoRow?.FBR_INV_NO}</BAPera>
                          </BABox>
                        </>
                      )}
                      {!isFbr && isProcessed && (
                        <BABox className="bg-gray-50 p-1 rounded mb-4 mt-5 break-words">
                          <BAPera className="text-xs">{infoRow?.VRError || infoRow?.PRError || "--"}</BAPera>
                        </BABox>
                      )}
                    </>
                  );
                })()}
                <BABox className="max-h-[300px] overflow-auto mt-3">
                  {[
                    { key: "InvoiceType", label: "Invoice Type" },
                    { key: "InvoiceNo", label: "Invoice No" },
                    { key: "InvoiceDate", label: "Invoice Date", type: "date" },
                    { key: "BuyerBusinessName", label: "Buyer Business Name" },
                    { key: "SellerProvince", label: "Seller Province" },
                    { key: "SellerAddress", label: "Seller Address" },
                    { key: "BuyerNTNCNIC", label: "Buyer NTN CNIC" },
                    { key: "ScenarioID", label: "Scenario ID" },
                    { key: "FBR", label: "FBR", type: "fbr" },
                  ].map((field: any, idx: number) => {
                    const value = infoRow?.[field.key];
                    let displayValue: any = "--";
                    if (field.type === "date") {
                      displayValue = value ? formatDateDMY(value) : "--";
                    } else if (field.type === "fbr") {
                      const toBool = (v: any) => v === true || v === 1 || String(v).toLowerCase() === "true";
                      const isFbr = toBool(infoRow?.["FBR"]);
                      const isProcessed = toBool(infoRow?.["IsProcessed"]);
                      let text = "--"; let cls = "bg-gray-100 text-gray-600";
                      if (isProcessed && isFbr) { text = "Success"; cls = "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"; }
                      else if (isProcessed && !isFbr) { text = "Failed"; cls = "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"; }
                      else { text = "Pending"; cls = "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white"; }
                      displayValue = (
                        <span className={cls + " px-2 py-0.5 rounded-full text-xs"}>{text}</span>
                      );
                    } else if (value !== null && value !== undefined) {
                      if (typeof value === "boolean") displayValue = value ? "Yes" : "No";
                      else if (typeof value === "object") displayValue = JSON.stringify(value);
                      else displayValue = String(value);
                    }
                    return (
                      <BABox key={idx} className="flex justify-between items-start py-1">
                        <BAPera className="text-gray-500 text-xs mr-2">{field.label}</BAPera>
                        <BAPera className="text-sm text-right break-words">{displayValue}</BAPera>
                      </BABox>
                    );
                  })}
                </BABox>
              </BABox>
            )}
          </>
        }
      />
      <BAModal
        width={600}
        title={title}
        open={openModal}
        close={setOpenModal}
        content={
          <>
            <BAFormElement
              loading={singleRecordLoader}
              model={model}
              setModel={(mod: any) => {
                if (modelGetter) {
                  modelGetter(mod);
                }
                setModel(mod);
              }}
              formElement={formElement ?? []}
              onSaveClick={save}
              saveLoader={saveLoader}
              disabledForm={view}
              hideButton={view}
            />
          </>
        }
      />
      <BAScreenWrapper
        list="type"
        title={title}
        actions={[
          ...extraHeaders,
          ...(customButton?.map((item: React.ReactNode) => ({
            displayField: () => item,
          })) || []),
          {
            displayField: () => (
              <DatePicker.RangePicker
                placeholder={["Start Date", "End Date"]}
                value={dateRange}
                onChange={(dates: any) => {
                  setDateRange(dates);
                  getData(null, null, dates);
                }}
                style={{
                  width: isMobile ? 200 : 220,
                  marginRight: isMobile ? 1 : 5,
                  marginTop: isMobile ? 1 : 5,
                }}
              />
            ),
            isHide: !showDateRangePicker,
          },
          {
            displayField: () => isMobile ? <BAIconButton
              type="default"
              icon={<FileExcelOutlined />}
              onClick={() => {
                exportToExcel(controller)
              }}
            /> : <BAButton
              icon={<FileExcelOutlined />}
              label="Export as Excel"
              onClick={() => {
                exportToExcel(controller)
              }}
            />,
            isHide: disableExport,
          },
          {
            displayField: () => selectedRows.length > 0 && controller === 'transaction' && (
              <BAButton
                icon={<DownloadOutlined />}
                onClick={() => {
                  downloadSelectedRows(selectedRows)
                }}
                label="Download"
              />
            )
          },
          {
            displayField: () => selectedRows.length > 0 && controller === 'transaction/preview' && (
              <BAButton
                icon={<SettingOutlined />}
                onClick={() => {
                  executeSelectedRows(selectedRows)
                }}
                label="Execute"
              />
            )
          },
          {
            displayField: () => isMobile ? <BAIconButton
              type="default"
              icon={<PlusOutlined />}
              onClick={addNewClick}
            /> : <BAButton
              className="bg-secondary"
              icon={<PlusOutlined />}
              label="Add"
              onClick={addNewClick}
            />,
            isHide: disableAdd,
          },
        ]}
        disableNav
      >
        <BABox className="mt-3">
          <BABox className={"h-[calc(100vh-13rem)] overflow-auto"}>
            {extraBody}
            {loader ? (
              <BALoader />
            ) : (<>
              {isMobile ? <CardView cols={cols} listData={listData} /> : (
                <BABox className="hidden md:block">
                  <table className="min-w-full divide-y rounded-lg overflow-hidden divide-gray-200">
                    <thead style={{ backgroundColor: primary, color: 'white' }} className="bg-primary">
                      <tr className="relative">
                        {hasCheckboxColumn && (
                          <th className="px-3 text-center">
                            <BACheckbox
                              onChange={(e: any) => toggleSelectAll(e.target.checked)}
                              checked={allSelected}
                              isMultiple={selectedRows.length > 0 && !allSelected}
                            />
                          </th>
                        )}
                        <th className="px-3 text-center"></th>
                        {conditionalColumns && conditionalColumns.length > 0
                          ? conditionalColumns.map((col: any, index: number) => (
                            <th
                              className={`px-6 py-3 text-center text-xs font-medium text-plain  tracking-wider ${col.className ? col.className : ""
                                }`}
                              key={index}
                            >
                              {col.label}
                            </th>
                          ))
                          : null}
                        {colsWithoutCheckbox.map((col: any, index: number) => (
                          <th
                            key={index}
                            className={classNames(`px-6 py-3 transform text-center text-xs font-medium text-plain tracking-wider relative z-0 ${col.className ? col.className : ""}
                              }`)}
                          >
                            {col.label}
                            {col.HeaderField ? col.HeaderField() : ""}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 h-full">
                      <tr>
                        {hasCheckboxColumn && <td className="px-3"></td>}
                        <td className="px-3">
                          <BABox className="text-center">

                            {Object.entries(gridSearchObj).length > 0 && (
                              <BAIconButton
                                onClick={() => {
                                  setGridSearchObj({});
                                  getData(null, {});
                                }}
                                icon={<LuFilterX />}
                              />
                            )}
                          </BABox>
                        </td>

                        {colsWithoutCheckbox.map((col: any, index: number) => (
                          <td
                            key={index}
                            className={classNames(`text-left  p-1 text-xs font-medium text-plain tracking-wider ${col.className ? col.className : ""}
                              }`)}
                          >
                            {col.type === "boolean" ?
                              <BASelect
                                onChange={(e: any) => {
                                  gridSearchObj[col.key] = e;
                                  setGridSearchObj({ ...gridSearchObj });
                                  let obj = { ...gridSearchObj }
                                  obj[col.key] = e
                                  getData(null, { ...obj });
                                }}
                                options={[
                                  { value: '1', label: 'Success' },
                                  { value: '0', label: 'Failed' },
                                  { value: '2', label: 'Pending' }
                                ]}
                                label=""
                                value={gridSearchObj[col.key]}
                              /> : col.type === "date" ?

                                <>
                                  {!col.hideFilter && <BADate onChange={(e: any) => {
                                    const formatted = formatDateDMY(e);
                                    gridSearchObj[col.key] = formatted;
                                    setGridSearchObj({ ...gridSearchObj });
                                    let obj = { ...gridSearchObj }
                                    obj[col.key] = formatted;
                                    getData(null, { ...obj });
                                  }} label={""} />}
                                </>
                                : col.type === "number" ? <BANumberInput
                                  onKeyDown={(event: any) => {
                                    if (event.key === "Enter") {
                                      getData();
                                    }
                                  }}
                                  value={gridSearchObj[col.key]}
                                  onChange={(ev: any) => {
                                    gridSearchObj[col.key] = ev.target.value;
                                    setGridSearchObj({ ...gridSearchObj });
                                  }}
                                  label={""}
                                /> :
                                  <BAinput
                                    onKeyDown={(event: any) => {
                                      if (event.key === "Enter") {
                                        getData();
                                      }
                                    }}
                                    value={gridSearchObj[col.key]}
                                    onChange={(ev: any) => {
                                      gridSearchObj[col.key] = ev.target.value;
                                      setGridSearchObj({ ...gridSearchObj });
                                    }}
                                    label={""}
                                  />}
                          </td>
                        ))}
                      </tr>
                      {listData.length > 0 ? (
                        listData.map((row: any, rowIndex: number) => (
                          <tr
                            key={rowIndex}
                            className={"transition relative"}
                            // style={{height:'12px'}}
                            style={{
                              backgroundColor: rowIndex % 2 === 1 ? "" : "#edf0f4",
                            }}
                          >
                            {hasCheckboxColumn && (
                              <td className="p-3">
                                <BACheckbox
                                  checked={row.isSelected || false}
                                  onChange={(e: any) => selectRow(row, e.target.checked)}
                                />
                              </td>
                            )}
                            <td className="px-1 whitespace-nowrap  text-sm text-gray-900">
                              <BABox className="flex items-center">
                                {!disableEdit && (
                                  <EditOutlined onClick={() => {
                                    editClick(row);
                                    if (modelGetter) modelGetter({ ...row })
                                  }} className="text-black hover:text-[#DB052C] m-1 text-lg hover:scale-125" />

                                )}
                                {!disableDelete && (<Popconfirm
                                  title="Delete the task"
                                  description="Are you sure to delete this task?"
                                  onConfirm={() => deleteRecord(row.Id)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <DeleteOutlined onClick={() => {
                                  }} className="text-black hover:text-[#DB052C] m-1 text-lg hover:scale-125" />
                                </Popconfirm>
                                )}
                                {controller === 'transaction' && (
                                  <div className="flex gap-1">
                                    <BAIconButton onClick={() => {
                                      setInfoRow(row);
                                      setInfoModal(true);
                                    }} icon={<QrcodeOutlined style={{ fontSize: '13px' }} />} />
                                    <BAIconButton onClick={() => {
                                      let ReportUrl = `${instance.defaults.baseURL}transaction/download?invoiceNo=${row.InvoiceNo}`;
                                      window.open(ReportUrl, '_blank');
                                    }} icon={<IoMdDownload style={{ fontSize: '13px' }} />} />
                                  </div>
                                )}
                                {
                                  controller === 'setup' && (
                                    <Popconfirm
                                      title="Are you sure to run invoice?"
                                      description=""
                                      onConfirm={() => {
                                        invoiceRunService.GetAll().then((res: any) => {
                                          message.success(res.Message);
                                        }).catch((err: any) => {
                                          message.error(err?.error);
                                        });
                                      }}
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <SettingOutlined className="text-black m-1 text-lg hover:scale-125" />
                                    </Popconfirm>
                                  )
                                }
                              </BABox>
                            </td>
                            {colsWithoutCheckbox.map((col: any, colIndex: number) => (
                              <td
                                key={colIndex}
                                style={{ lineHeight: "0.8" }}
                                className={classNames(
                                  `p-3  whitespace-nowrap text-xs text-gray-900 relative ${col.className ? col.className : ""}`,
                                )}
                              >
                                {col.displayField ? (
                                  col.displayField(row)
                                ) : col.type === "status" ? (
                                  row[col.key] ? <CheckOutlined className="text-lg text-[#DB052C]" /> : <CloseOutlined className="text-lg text-[grey]" />
                                ) : col.type === "number" ? (
                                  <BABox className="text-end">{formattedNumber(row[col.key])}</BABox>
                                )
                                  : col.type === "date" ? (
                                    <span className="text-center block" >{formatDateDMY(row[col.key])}</span>
                                  ) : col.type === "checkbox" ? (
                                    null
                                  ) : (
                                    (() => {
                                      const isFbrKey = String(col.key).toLowerCase() === "fbr";
                                      if (isFbrKey) {
                                        const toBool = (v: any) => v === true || v === 1 || String(v).toLowerCase() === "true";
                                        const isFbr = toBool(row["FBR"]);
                                        const isProcessed = toBool(row["IsProcessed"]);
                                        let text = "--"; let cls = "bg-gray-100 text-gray-600";
                                        if (isProcessed && isFbr) { text = "Success"; cls = "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"; }
                                        else if (isProcessed && !isFbr) { text = "Failed"; cls = "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"; }
                                        else { text = "Pending"; cls = "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white"; }
                                        return (<span className={cls + " px-2 py-0.5 rounded-full text-xs"}>{text}</span>);
                                      }
                                      return row[col.key];
                                    })()
                                  )}
                              </td>
                            ))}
                            {conditionalColumns && conditionalColumns.length > 0
                              ? conditionalColumns.map((col: any, index: number) => (
                                <td
                                  className="px-5 whitespace-nowrap text-sm text-gray-900"
                                  key={index}
                                >
                                  {col.displayField(row)}
                                </td>
                              ))
                              : null}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={cols.length + (conditionalColumns?.length || 0) + 1} className="text-center py-4">
                            <BABox className="flex justify-center w-full">
                              <img src={nodata} width={250} alt="" />
                            </BABox>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </BABox>
              )}

              <BABox className="md:hidden block">
                <BABox className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory h-full">
                  {listData.length > 0 &&
                    listData.map((row: any, rowIndex: number) => (
                      <BABox
                        key={rowIndex}
                        className="snap-start shrink-0 w-[300px] h-[450px] p-2 overflow-y-auto"
                      >
                        <BABox className="rounded-lg shadow h-full w-full overflow-y-auto flex flex-col justify-between">
                          <BABox className="p-2">
                            {cols.map((col: any, colIndex: number) => (
                              <BABox key={colIndex} className="mb-4">
                                <BAPera className="font-semibold text-gray-500">{col.label}</BAPera>
                                <BAPera className="text-xl">
                                  {col.displayField ? (
                                    col.displayField(row)
                                  ) : col.type === "status" ? (
                                    row[col.key] ? (
                                      <CheckOutlined className="text-lg text-[#DB052C]" />
                                    ) : (
                                      <CloseOutlined className="text-lg text-[grey]" />
                                    )
                                  ) : col.type === "number" ? (
                                    <BABox>
                                      {formattedNumber(row[col.key])}
                                    </BABox>
                                  ) : col.type === "date" ? (
                                    <span className="block">
                                      {formatDateDMY(row[col.key])}
                                    </span>
                                  ) : (
                                    (() => {
                                      const isFbrKey = String(col.key).toLowerCase() === "fbr";
                                      if (isFbrKey) {
                                        const toBool = (v: any) => v === true || v === 1 || String(v).toLowerCase() === "true";
                                        const isFbr = toBool(row["FBR"]);
                                        const isProcessed = toBool(row["IsProcessed"]);
                                        let text = "--"; let cls = "bg-gray-100 text-gray-600";
                                        if (isProcessed && isFbr) { text = "Success"; cls = "bg-green-100 text-green-700"; }
                                        else if (isProcessed && !isFbr) { text = "Failed"; cls = "bg-red-100 text-red-700"; }
                                        else { text = "Pending"; cls = "bg-yellow-100 text-yellow-700"; }
                                        return (<span className={cls + " px-2 py-0.5 rounded-full text-xs"}>{text}</span>);
                                      }
                                      return row[col.key] || "--";
                                    })()
                                  )}
                                </BAPera>
                              </BABox>
                            ))}
                          </BABox>
                          <BABox className="bg-gray-100 flex items-center justify-end p-2 rounded-b-lg mt-4">
                            {extraActions &&
                              extraActions.map(
                                (exAction: any, exIndex: number) => (
                                  <BABox key={exIndex}>
                                    {exAction.isHide
                                      ? null
                                      : exAction.displayField(row, getData)}
                                  </BABox>
                                )
                              )}
                            <BABox className="flex items-center">
                              {!disableEdit && (
                                <EditOutlined onClick={() => {
                                  editClick(row);
                                  if (modelGetter) modelGetter({ ...row })
                                }} className="text-black hover:text-[#DB052C] m-1 text-lg hover:scale-125" />

                              )}
                              {!disableDelete && (<Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                onConfirm={() => deleteRecord(row.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined onClick={() => {
                                }} className="text-black hover:text-[#DB052C] m-1 text-lg hover:scale-125" />
                              </Popconfirm>
                              )}
                            </BABox>
                            {conditionalColumns && conditionalColumns.length > 0
                              ? conditionalColumns.map((col: any, index: number) => (
                                <td
                                  className="px-5 whitespace-nowrap text-sm text-gray-900"
                                  key={index}
                                >
                                  {col.displayField(row)}
                                </td>
                              ))
                              : null}
                          </BABox>
                        </BABox>
                      </BABox>
                    ))}
                </BABox>

              </BABox>
            </>
            )}
          </BABox>
          <BAPagination
            totalRecords={paginationConfig.totalRecords}
            onPageChange={(page: any, pageSize: any) => {
              getData({
                page: page,
                pageSize: pageSize,
              });
            }}
          />
        </BABox>
      </BAScreenWrapper>
    </>
  );
});
import { Input, message, Grid } from "antd";
import { useEffect, useState } from "react";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import BAModal from "./BAModal";
import BAGrid from "./BAGrid";
import BAPagination from "./BAPagination";
import BAButton from "./BAButton";
import BABox from "./BABox";
import { GeneralCoreService } from "../config/GeneralCoreService";

const { useBreakpoint } = Grid;

type propsType = {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: any;
  onCancel?: any;
  value?: any;
  type?: any;
  controller?: any;
  apiName?: string;
  config?: any;
  displayField?: any;
  multiple?: any;
  onRowClick?: any;
  onBlur?: any;
  allowMultiple?: boolean;
  onSelectMultiple?: any;
  isRowSelected?: boolean;
  isAllSelected?: boolean;
  data?: any;
  useLookup?: boolean;
  fillObj?: any;
  params?: any;
  searchBy?: any;
};

export default function BASearchLookup(props: propsType) {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md = 768px breakpoint

  const {
    label,
    placeholder,
    disabled,
    required,
    className,
    onChange,
    value,
    type,
    controller,
    config,
    displayField,
    onRowClick,
    onBlur,
    allowMultiple,
    onSelectMultiple,
    fillObj,
    onCancel,
    searchBy,
  } = props;

  const [listData, setListData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState<any>(false);
  const [paginationConfig, setPaginationConfig] = useState({
    pageSize: 10,
    page: 1,
    totalRecords: 0,
  });
  const [inpValue, setInpValue] = useState<any>(value);

  const getData = (pgObj?: any, SearchObj?: any) => {
    console.log(pgObj);
    setLoading(true);

    // Add null checks for config
    if (!config || !Array.isArray(config)) {
      console.error("Config is undefined or not an array");
      setLoading(false);
      setListData([]);
      return;
    }

    const updatedSearchObj = Object.fromEntries(
      Object.entries(SearchObj || {}).filter(([_, value]) => value)
    );

    GeneralCoreService(controller)
      .Register({
        page: pgObj?.page || paginationConfig.page,
        limit: pgObj?.pageSize || paginationConfig.pageSize,
        selector: config
          .map((col: any) => col.key)
          .filter(Boolean)
          .join(","),
        search: updatedSearchObj,
        filter: JSON.stringify({ ...SearchObj }),
        ...searchBy,
      })
      .then((res: any) => {
        // Handle different response formats
        const items = res?.items || res?.data || res?.Data?.List || [];
        const totalItems = res?.meta?.totalItems || res?.Data?.Count || 0;

        if (items && Array.isArray(items)) {
          setListData([...items]);
          setPaginationConfig({
            ...paginationConfig,
            totalRecords: totalItems,
          });
        } else {
          console.warn("Invalid response format:", res);
          setListData([]);
          setPaginationConfig({ ...paginationConfig, totalRecords: 0 });
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("API Error:", err);
        setLoading(false);
        setListData([]);
        setPaginationConfig({ ...paginationConfig, totalRecords: 0 });
        message.error(
          err?.error || err?.message || "An error occurred while fetching data"
        );
      });
  };
  const handleOpen = () => {
    setOpenModal(true);
    getData();
  };

  const handleCancel = () => {
    onChange(null, null, {});
    setInpValue("");
    onCancel && onCancel();
  };

  const onInputChange = (e: any) => {
    setInpValue(e.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleOpen();
    }
  };
  const onOK = () => setOpenModal(false);

  const pageChange = async (page: any, pageSize: any) => {
    paginationConfig.pageSize = pageSize;
    paginationConfig.page = page;
    setPaginationConfig({ ...paginationConfig });
    getData({ ...paginationConfig, page, pageSize });
  };

  const setSelectedRows = () => {
    const selectedRows = listData.filter((el: any) => el.isSelected);
    onSelectMultiple(selectedRows);
    onOK();
  };

  useEffect(() => {
    if (fillObj && value) {
      setInpValue(fillObj[displayField]);
    }
  }, []);

  // Add useEffect to handle value changes (for clearing)
  useEffect(() => {
    if (!value) {
      setInpValue("");
    } else if (fillObj && value) {
      setInpValue(fillObj[displayField]);
    }
  }, [value, fillObj, displayField]);

  return (
    <>
      <BAModal
        title={label ? label : "Search Lookup"}
        open={openModal}
        handleOK={onOK}
        close={setOpenModal}
        width={isMobile ? "95%" : "70%"}
        content={
          <>
            <BAGrid
              closeModal={onOK}
              displayField={displayField}
              onChange={onChange}
              datasourse={listData}
              cols={config}
              loading={loading}
              onRowClick={(i: number, data: any) => {
                if (!allowMultiple) onOK();
                onRowClick(i, data, listData);
                setInpValue(data[displayField]);
              }}
              allowMultiple={allowMultiple}
              setDataSource={setListData}
              allowSearch
              handleSearch={getData}
            />
            <BAPagination
              pageSize={paginationConfig.pageSize}
              totalRecords={paginationConfig.totalRecords}
              onPageChange={pageChange}
              multiSelect={allowMultiple}
              onOk={() => (allowMultiple ? setSelectedRows() : {})}
            />
          </>
        }
      />
      {type === "button" ? (
        <BAButton label={label} disabled={disabled} onClick={handleOpen} />
      ) : (
        <BABox className={`${className}`}>
          {label && (
            <div className="text-xs text-black mb-1">
              {label}
              <span className="text-red-500 ml-1">{required && "*"}</span>
            </div>
          )}
          <BABox>
            <Input
              value={inpValue}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              style={{ padding: "10px" }}
              variant="outlined"
              suffix={
                <>
                  {inpValue ? (
                    <CloseOutlined
                      disabled={disabled}
                      onClick={() => (disabled ? {} : handleCancel())}
                    />
                  ) : (
                    <SearchOutlined
                      disabled={disabled}
                      onClick={() => (disabled ? {} : handleOpen())}
                    />
                  )}
                  {/* <BAIconButton
                  className="bg-primary"

                  icon={<SearchOutlined />}

                /> */}
                </>
              }
              className={className}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                if (value === "") {
                  onChange(e, "", {});
                }
                if (onBlur) {
                  onBlur(e);
                }
              }}
            />
          </BABox>
        </BABox>
      )}
    </>
  );
}

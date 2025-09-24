;

import { Pagination } from "antd";
import BABox from "./BABox";
import { useState } from "react";
import BASelect from "./BASelect";

type propsType = {
  totalRecords: number;
  onPageChange: any;
  onOk?: any;
  multiSelect?: boolean;
  content?: React.ReactNode;
  pageSize?: number;
};
export default function BAPagination(props: propsType) {
  const { totalRecords, onPageChange, pageSize } = props;
  const [pageConfig, setPageConfig] = useState({
    current: 1,
    pageSize: pageSize || 10,
  });

  const handlePageChange = (page: number, pageSize: number) => {
    if (onPageChange) onPageChange(page, pageSize);
    setPageConfig({ ...pageConfig, current: page, pageSize: pageSize });
  };

  const pageSizeChange = (value: any) => {
    setPageConfig({ ...pageConfig, pageSize: value });
    handlePageChange(1, value);
  };

  return (
    <>
      <BABox className="p-2 rounded-lg bg-white shadow mt-1 md:mt-2">
        <BABox className="hidden md:flex justify-between items-center">
          <BABox>
            <BASelect
              width={100}
              onChange={pageSizeChange}
              options={[
                {
                  value: 10,
                  label: "10",
                },
                {
                  value: 20,
                  label: "20",
                },
                {
                  value: 30,
                  label: "30",
                },
                {
                  value: 40,
                  label: "40",
                },

              ]}
              value={pageConfig.pageSize}
              label={""}
            />
          </BABox>
          <BABox>
            <style>
              {`
                .ant-pagination-item-active {
                  border-color: textPrimary !important;
                }
                .ant-pagination-item-active a {
                  color: textPrimary !important;
                }
              `}
            </style>
            <Pagination
              defaultCurrent={1}
              total={totalRecords}
              // pageSize={pageConfig.pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </BABox>
          <BABox className="ms-2">Total Records: {totalRecords}</BABox>
        </BABox>

      </BABox>
    </>
  );
}

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { BABox, } from "../../components";
import BAScreenWrapper from "../../reuseableLayout/BAScreenWrapper";
import { Avatar, Button, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Get } from "../../config/apimethods";
import NumberFlow from '@number-flow/react'
import { invoiceRunService } from "../../config/apiservices";

export default function MainDashboard() {
  const [user, setUser] = useState<any>({});
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [pending, setPending] = useState(0);
  const [users, setUsers] = useState(0);
  const [executeLoading, setExecuteLoading] = useState(false);
  
  const getDashboardData = () => {
    const params = (value: string) => ({
      pageNo: 1,
      pageSize: 1,
      SearchBy: JSON.stringify([{ Key: "FBR", Value: value }]),
      start: dayjs().startOf("month").format("YYYY-MM-DD"),
      end: dayjs().endOf("month").format("YYYY-MM-DD"),
    });

    Promise.all([
      Get("/transaction", null, params("1")), // success
      Get("/transaction", null, params("0")), // failed
      Get("/transaction", null, params("2")), // pending
      Get("/user"), // users
    ])
      .then(([successRes, failedRes, pendingRes, usersRes]: any) => {
        setSuccess(successRes.Data.Count);
        setFailed(failedRes.Data.Count);
        setPending(pendingRes.Data.Count);
        setUsers(usersRes.Data.Count);
      })
      .catch(() => {
        message.error("Failed to fetch dashboard data");
      });
  };

  const executeInvoice = () => {
    setExecuteLoading(true);
    invoiceRunService.GetAll().then((res: any) => {
      message.success(res.Message);
      setExecuteLoading(false);
    }).catch((err: any) => {
      message.error(err?.error);
      setExecuteLoading(false);
    });
  };

  useEffect(() => {
    let u: any = localStorage.getItem("User");
    try { u = JSON.parse(u || "{}"); } catch { u = {}; }
    if (u) { setUser(u); }
    getDashboardData();
  }, []);

  return (
    <BAScreenWrapper hideHeader={false} title="Dashboard" list="type">
      <BABox className="rounded-xl p-4 md:p-6 flex items-center justify-between bg-white">
        <BABox className="flex items-center gap-4">
          <Avatar
            size={56}
            src={user?.Image}
          />
          <BABox>
            <div className="text-2xl md:text-3xl font-semibold text-slate-800">
              {`Hello  ${(user?.Name || user?.userName || "User").toString().split(" ")[0]}!`}
            </div>
            {/* <div className="text-slate-500 text-sm md:text-base">
              You have 2 new messages and 15 new tasks
            </div> */}
          </BABox>
        </BABox>

        <BABox className="flex items-center gap-3">
          {
            user?.IsExcute && (
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={executeInvoice}
                style={{ borderRadius: 9999 }}
                loading={executeLoading}
              >
                Execute
              </Button>
            )
          }
        </BABox>
      </BABox>

      {/* Stats grid */}
      <BABox className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Success */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-slate-700 font-medium">Success</div>
          </div>
          <div className="mt-2 text-center">
            <div className="text-6xl leading-none font-bold text-emerald-500"><NumberFlow value={success} isolate={true} animated={true} /></div>
            <div className="mt-2 font-medium text-emerald-500">Successfully processed invoices</div>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-slate-700 font-medium">Failed</div>
          </div>
          <div className="mt-2 text-center">
            <div className="text-6xl leading-none font-bold text-red-500"><NumberFlow value={failed} isolate={true} animated={true} /></div>
            <div className="mt-2 font-medium text-red-500">Invoices with processing failure</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-slate-700 font-medium">Pending</div>
          </div>
          <div className="mt-2 text-center">
            <div className="text-6xl leading-none font-bold text-amber-500"><NumberFlow value={pending} isolate={true} animated={true} /></div>
            <div className="mt-2 font-medium text-amber-500">Invoices awaiting processing</div>
          </div>
        </div>

        {/* Users*/}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-slate-700 font-medium">Users</div>
          </div>
          <div className="mt-2 text-center">
            <div className="text-6xl leading-none font-bold text-sky-600"><NumberFlow value={users} isolate={true} animated={true} /></div>
            <div className="mt-2 font-medium text-sky-600">Total registered users</div>
          </div>
        </div>
      </BABox>
    </BAScreenWrapper>
  );
}

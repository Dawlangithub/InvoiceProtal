import { BASetupGrid } from "../../../../components";
import { LogsConfig } from "../../../../config/setupconfig";

export default function Logs() {
    return (
        <>
            <BASetupGrid cols={LogsConfig} controller={"inquiries"} title={"Invoice Logs"} disableDelete={true} disableEdit={true} disableAdd={true} showDateRangePicker={true} />
        </>
    )
}
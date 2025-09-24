import { BASetupGrid } from "../../../../components";
import { TransactionConfig } from "../../../../config/setupconfig";

export default function Invoice() {
    return (
        <>
            <BASetupGrid cols={TransactionConfig} controller={"transaction"} title={"Invoice"} disableAdd={true} disableEdit={true} disableDelete={true} showDateRangePicker={true}/>
        </>
    )
}
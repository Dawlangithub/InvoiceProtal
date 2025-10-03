import { BASetupGrid } from "../../../../components";
import { InvoiceConfig } from "../../../../config/setupconfig";

export default function Invoice() {
    return (
        <>
            <BASetupGrid disableExport={true} cols={InvoiceConfig} controller={"invoices"} title={"Invoice"} disableAdd={true} disableEdit={true} disableDelete={true} showDateRangePicker={true}/>
        </>
    )
}
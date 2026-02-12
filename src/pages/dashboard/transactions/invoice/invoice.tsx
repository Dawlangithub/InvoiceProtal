import { BASetupGrid } from "../../../../components";
import { InvoiceConfig } from "../../../../config/setupconfig";

export default function Invoice() {
    return (
        <>
            <BASetupGrid cols={InvoiceConfig} controller={"invoices"} title={"Print Invoice"} disableAdd={true} disableEdit={true} disableDelete={true} showDateRangePicker={true}/>
        </>
    )
}
const CreateConfig = (
    key: string,
    searchable: boolean,
    show: boolean,
    title: string,
    type: 'boolean' | 'date' | 'number' | 'percentage' | 'text' | 'time' | 'datetime' | 'filterList' | 'phone' | 'enum' | 'link' | 'checkbox',
    searchField?: string | null,
    width?: any,
    controller?: string,
    displayField?: any,
    filterEnums?: { value: any, label: string, key: string }[],
    hideFilter?: boolean,
) => {
    return {
        key,
        searchField: searchField ? searchField : key,
        searchable: searchable,
        show: show,
        label: title,
        type: type,
        width: width,
        controller: controller,
        displayField: displayField,
        filterEnums: filterEnums,
        hideFilter: hideFilter,
    }
}

export const UserConfig = [
    CreateConfig('Name', true, true, "Name", "text"),
    CreateConfig('UserName', true, true, "Username", "text"),
    CreateConfig('Email', true, true, "Email", "text"),
    CreateConfig('PhoneNumber', true, true, "Contact No", "text"),
    CreateConfig('UserType', true, true, "User Type", "text"),
    // CreateConfig('IsActive', true, true, "Is Active", "boolean"),
]

export const RoleConfig = [
    CreateConfig('Name', true, true, "Name", "text"),
    CreateConfig('Id', true, true, "Id", "text"),
    // CreateConfig('IsActive', true, true, "Is Active", "boolean"),
]

export const setupConfigConfig = [
    CreateConfig('UserName', true, true, "User Name", "text"),
    CreateConfig('DatabaseName', true, true, "Database Name", "text"),
    CreateConfig('ServerName', true, true, "Server Name", "text"),
    CreateConfig('FBRToken', true, true, "FBR Token", "text"),
    CreateConfig('PostEndPoint', true, true, "PostEndPoint", "text"),
    CreateConfig('ScheduleInterval', true, true, "ScheduleInterval", "text"),
]

export const TransactionConfig = [
    CreateConfig('IsSelected', false, true, "Select", "checkbox"),
    CreateConfig('InvoiceNo', true, true, "Invoice No", "text"),
    CreateConfig('InvoiceDate', true, true, "Invoice Date", "date"),
    CreateConfig('InvoiceType', true, true, "Invoice Type", "text"),
    CreateConfig('BUCode', true, true, "BU Code", "text"),
    CreateConfig('BuyerBusinessName', true, true, "Buyer Name", "text"),
    CreateConfig('BuyerRegistrationType', true, true, "Buyer Type", "text"),
    CreateConfig('FBR', true, true, "FBR", "boolean"),
    CreateConfig('FBR_INV_NO', true, true, "FBR_INV_NO", "text"),
    CreateConfig('Total', true, true, "Total", "text"),

]
export const PreviewConfig = [
    CreateConfig('IsSelected', false, true, "Select", "checkbox"),
    CreateConfig('InvoiceNo', true, true, "Invoice No", "text"),
    CreateConfig('InvoiceDate', true, true, "Invoice Date", "date"),
    CreateConfig('InvoiceType', true, true, "Invoice Type", "text"),
    CreateConfig('BUCode', true, true, "BU Code", "text"),
    CreateConfig('BuyerBusinessName', true, true, "Buyer Name", "text"),
    CreateConfig('BuyerRegistrationType', true, true, "Buyer Type", "text"),

]

export const LogsConfig = [
    CreateConfig('Module', true, true, "Module", "text", null, null, "", (row: any) => { row.Module }),
    CreateConfig('Message', true, true, "Message", "text"),
    CreateConfig('Action', true, true, "Action", "text"),
    CreateConfig('CreatedOn', true, true, "Created On", "date"),
    CreateConfig('CreatedBy', true, true, "Created By", "text"),
]

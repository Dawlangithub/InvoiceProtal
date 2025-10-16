const CreateConfig = (
    key: string,
    searchable: boolean,
    show: boolean,
    title: string,
    type: 'boolean' | 'date' | 'number' | 'percentage' | 'text' | 'time' | 'datetime' | 'filterList' | 'phone' | 'enum' | 'link' | 'checkbox' | 'tag',
    searchField?: string | null,
    width?: any,
    controller?: string,
    displayField?: any,
    filterEnums?: { value: any, label: string, key: string }[],
    hideFilter?: boolean,
    className?: string,
    truncate?: boolean,
    truncateWidth?: number,
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
        className,
        truncate,
        truncateWidth,
    }
}

export const UserConfig = [
    CreateConfig('username', true, true, "Username", "text"),
    CreateConfig('email', true, true, "Email", "text"),
    // CreateConfig('createdAt', true, true, "Created At", "date"),
]

export const InvoiceConfig = [
    CreateConfig('Company', true, true, "Company", "text"),
    CreateConfig('InvoiceNo', true, true, "Invoice No", "text"),
    CreateConfig('InvoiceDate', true, true, "Invoice Date", "date"),
    CreateConfig('CustomerCode', true, true, "Customer Code", "text"),
    CreateConfig('CustomerName', true, true, "Customer", "text"),
    CreateConfig('CNIC', true, true, "CNIC", "text"),
    CreateConfig('NTN', true, true, "NTN", "text"),
    CreateConfig('Province', true, true, "Province", "text"),
    CreateConfig('Status', true, true, "Status", "tag"),
    CreateConfig('FBRPostDate', true, true, "FBR Post Date", "datetime"),
    CreateConfig('FBRNo', true, true, "FBR No", "text"),
]

export const LogsConfig = [
    CreateConfig('Company', true, true, "Company", "text"),
    CreateConfig('InvoiceNo', true, true, "Invoice No", "text"),
    CreateConfig('InvoiceDate', true, true, "Invoice Date", "date"),
    CreateConfig('Customer', true, true, "Customer", "text"),
    CreateConfig('CNIC', true, true, "CNIC", "text"),
    CreateConfig('NTN', true, true, "NTN", "text"),
    CreateConfig('Status', true, true, "Status", "tag"),
    CreateConfig('LogDateTime', true, true, "Log DateTime", "datetime"),
    CreateConfig('HaballMsg', true, true, "LogMessage", "text", undefined, undefined, undefined, undefined, undefined, undefined, 'max-w-[240px]', true, 240),
    CreateConfig('FBRMsg', true, true, "FBR Message", "text", undefined, undefined, undefined, undefined, undefined, undefined, 'max-w-[240px]', true, 240),
]

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
    CreateConfig('username', true, true, "Username", "text"),
    CreateConfig('email', true, true, "Email", "text"),
    // CreateConfig('createdAt', true, true, "Created At", "date"),
]

export const InvoiceConfig = [
    CreateConfig('BUKRS', true, true, "Company", "text"),
    CreateConfig('VBELN', true, true, "Invoice No", "text"),
    CreateConfig('FKDAT', true, true, "Invoice Date", "date"),
    CreateConfig('KunrgName1', true, true, "Customer", "text"),
    CreateConfig('STCD1', true, true, "CNIC", "text"),
    CreateConfig('STCD2', true, true, "NTN", "text"),
]

export const LogsConfig = [
    CreateConfig('BUKRS', true, true, "Company", "text"),
    CreateConfig('VBELN', true, true, "Invoice No", "text"),
    CreateConfig('FKDAT', true, true, "Invoice Date", "date"),
    CreateConfig('KunrgName1', true, true, "Customer", "text"),
    CreateConfig('STCD1', true, true, "CNIC", "text"),
    CreateConfig('STCD2', true, true, "NTN", "text"),
    CreateConfig('TXTFIELD', true, true, "Status", "tag"),
    CreateConfig('FNS_Status', true, true, "StatusCode", "text"),
    CreateConfig('LogStatus', true, true, "LogStatus", "text"),
    CreateConfig('MSGTXT', true, true, "LogMessage", "text"),
]

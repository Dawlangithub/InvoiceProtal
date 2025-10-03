import { GeneralCoreService } from "./GeneralCoreService";

export const UserService = GeneralCoreService('users')
export const RoleService = GeneralCoreService('role')
export const SetupConfigService = GeneralCoreService('setup')
export const LogsService = GeneralCoreService('Logs')
export const invoiceRunService = GeneralCoreService('invoice/run')
export const invoiceExecuteService = GeneralCoreService('invoice/process')
// export const logsExportService = GeneralCoreService('logs/export')
// export const transactionExportService = GeneralCoreService('transaction/export')



import { Delete, Get, Post, Put } from "./apimethods"

export const GeneralCoreService = (controller: string, apiName?: string) => {
    return {
        Save: (body: any, id?: any) => {
            if (id) {
                return Put(`${controller}${apiName ? '/' + apiName : ''}`, body, id)
            } else {
                return Post(`${controller}${apiName ? '/' + apiName : ''}`, body)
            }
        },
        GetOne: (id: any) => {
            return Get(`${controller}${apiName ? '/' + apiName : ''}`, id)
        },
        GetAll: (params?: any) => {
            return Get(`${controller}${apiName ? '/' + apiName : ''}`, null, params)
        },
        DeleteOne: (id: any) => {
            return Delete(`${controller}${apiName ? '/' + apiName : ''}`, id)
        },
        BulkDelete: (idList: [any]) => {
            return Post(`${controller}${apiName ? '/' + apiName : '/bulkdelete'}`, {
                idList: idList
            })
        },
        Register: (params: any) => {
            return Get(`${controller}${apiName ? '/' + apiName : ''}`, null, params)
        },
        Lookup: (params: any) => {
            return Get(`lookup/${controller}${apiName ? '/' + apiName : ''}`, null, params)
        },
        PostRec: (id: any) => {
            return Get(`${controller}${apiName ? '/' + apiName : ''}`, id)
        },
    }
}
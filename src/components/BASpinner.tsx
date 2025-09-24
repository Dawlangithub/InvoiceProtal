


import { Spin } from "antd"

export default function BASpinner(props: any) {
    return <>
        <Spin spinning={props.loader ? true : false} size="large" tip="Loading..." style={{ fontSize: '20px' }}>
            {props.children}
        </Spin>
    </>
}
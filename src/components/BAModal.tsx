

import { Modal } from "antd"

type propsType = {
    title: string,
    open: boolean,
    close: any,
    content: any,
    style?: any,
    footer?: any,
    width?: any,
    handleOK?: any,
    className?: string
}

export default function BAModal(props: propsType) {
    const { title, open, close, content, style, footer, width, handleOK, className } = props;
    const handleClose = () => {
        if (close) close()
    }

    return <>
        <Modal
            width={width}
            style={style}
            title={title}
            open={open}
            onCancel={handleClose}
            footer={footer ? footer : null}
            onOk={handleOK}
            className={className}
        >
            {content}
        </Modal>
    </>
}
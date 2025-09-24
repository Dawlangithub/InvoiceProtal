

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from "antd";
import type { MenuProps } from 'antd';

type propsType = {
    options: {
        label: string,
        onClick: any,
        icon?: React.ReactNode
    }[],
    children?: React.ReactNode,
}

export default function BAMenu(props: propsType) {
    const { options, children } = props;

    const items: MenuProps['items'] = [
        ...options.map((option, index) => ({
            label: option.label,
            key: index.toString(),
            onClick: option.onClick,
            icon: option.icon
        }))
    ];

    return <>
        <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
                {children ? children : <DownOutlined />}
            </a>
        </Dropdown>
    </>
}
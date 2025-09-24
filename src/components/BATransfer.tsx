import React, { useState } from 'react';
import { Transfer } from 'antd';
import type { TransferProps } from 'antd';
import BABox from './BABox';

interface RecordType {
    key: string;
    title: string;
    description: string;
}

interface BATransferProps {
    dataSource: RecordType[];
    titles?: [string, string];
    initialTargetKeys?: Array<string | number>;
    onTransferChange?: any;
    onSelectionChange?: any;
    className: string;
}

const BATransfer: React.FC<BATransferProps> = ({
    dataSource,
    titles = ['Source', 'Target'],
    initialTargetKeys = [],
    onTransferChange,
    onSelectionChange,
    className,
}) => {
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState<TransferProps['selectedKeys']>([]);

    const handleTransferChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        onTransferChange?.(nextTargetKeys, direction, moveKeys);
    };

    const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        onSelectionChange?.(sourceSelectedKeys, targetSelectedKeys);
    };

    return (
        <BABox>
            <Transfer
                dataSource={dataSource}
                titles={titles}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={handleTransferChange}
                onSelectChange={handleSelectChange}
                render={(item) => item.title}
                className={className}
                locale={{
                    itemUnit: '',
                    itemsUnit: '',
                }}
            />
        </BABox>

    );
};

export default BATransfer;


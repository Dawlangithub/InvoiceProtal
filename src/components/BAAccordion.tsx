import React, { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';

interface BAAccordionProps {
  items: CollapseProps['items'];
}

const BAAccordion: React.FC<BAAccordionProps> = ({ items }) => {
  const { token } = theme.useToken();
  const [activeKey, setActiveKey] = useState<string | string[]>(items?.[0]?.key ? items[0].key.toString() : '');

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: '#C5C5C5',
    borderRadius: token.borderRadiusLG,
    // border: 'none',
  };

  const onChange = (newActiveKey: string | string[]) => {
    setActiveKey(newActiveKey);
  };

  return (
    <Collapse
    //   bordered={false}
      activeKey={activeKey}
      defaultActiveKey={activeKey}
      accordion
      onChange={onChange}
      expandIcon={(panelProps) => {
        const isActive = activeKey.includes(panelProps.header as string);
        return <CaretRightOutlined rotate={isActive ? 90 : 0} />;
      }}
      className="mt-3"
      style={{ background: "none", border: "none" }}
      items={(items as CollapseProps['items'])?.map((item) => ({
        ...item,
        style: panelStyle,
        header: item.key && item.key.toString()
      }))}
    />
  );
};

export default BAAccordion;
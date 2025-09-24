import React from 'react';
import { Tabs } from 'antd';

interface TabData {
  label: string;
  key: string;
  content: React.ReactNode;
}

interface TabProps {
  tabsData: TabData[];
  className?: string
}

const BATabs: React.FC<TabProps> = ({ tabsData, className }) => (
  <Tabs
    type="card"
    items={tabsData.map((tab) => ({
      label: tab.label,
      key: tab.key,
      children: tab.content,
    }))}
    className={className}
  />
);

export default BATabs;

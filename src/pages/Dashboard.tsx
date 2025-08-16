import React, { Suspense } from 'react';
import { Card, Statistic, Row, Col } from 'antd';

// Lazy-load heavy Recharts usage into a separate chunk
const DashboardCharts = React.lazy(() => import('./DashboardCharts'));

const spendingData = [
  { name: 'Housing', value: 1200 },
  { name: 'Food', value: 800 },
  { name: 'Transport', value: 400 },
  { name: 'Entertainment', value: 300 },
  { name: 'Other', value: 200 },
];

const investmentData = [
  { name: 'Stocks', value: 15000 },
  { name: 'Bonds', value: 8000 },
  { name: 'Real Estate', value: 12000 },
  { name: 'Cash', value: 5000 },
];

const COLORS = ['#1890ff', '#13c2c2', '#ffc53d', '#73d13d', '#ff4d4f'];

const Dashboard: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Row gutter={24}>
      <Col span={8}>
        <Card title="Total Balance" bordered={false}>
          <Statistic value={40250} prefix="$" precision={2} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Monthly Spending" bordered={false}>
          <Statistic value={2900} prefix="$" precision={2} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Investment Growth" bordered={false}>
          <Statistic value={7.2} suffix="%" precision={2} />
        </Card>
      </Col>
    </Row>
    <Suspense fallback={<div style={{ marginTop: 32 }}><Card loading title="Loading charts..." /></div>}>
      <DashboardCharts />
    </Suspense>
  </div>
);

export default Dashboard;


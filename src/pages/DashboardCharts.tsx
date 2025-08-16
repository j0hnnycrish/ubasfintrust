import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

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

const DashboardCharts: React.FC = () => (
  <Row gutter={24} style={{ marginTop: 32 }}>
    <Col span={12}>
      <Card title="Spending Breakdown">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {spendingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Investment Allocation">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={investmentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Col>
  </Row>
);

export default DashboardCharts;

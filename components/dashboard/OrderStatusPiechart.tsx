"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

type Props = { data: { status: string; count: number }[] };
const COLORS = ["#57b257", "#ff9933", "#4d8cff", "#a16fd8", "#e86c6c"];
const OrderStatusPieChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const renderLabel = (entry: PieLabelRenderProps) => {
    const name = entry.name ?? "Unknown";
    const percent = entry.percent ?? 0;
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={renderLabel}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string, props) => [
            value,
            props.payload.name,
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 14 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrderStatusPieChart;

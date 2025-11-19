"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type Props = { data: { audience: string; stock: number }[] };

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa"];

const AudienceStockBarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis fontSize={14} dataKey="audience" />
        <YAxis fontSize={14} />
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="stock">
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AudienceStockBarChart;

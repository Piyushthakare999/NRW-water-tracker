import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Storage Tank 2",
    nrw: 2000,
    rw: 9800,
    amt: 2290,
  },
  {
    name: "LifeWorth Hospital",
    nrw: 3000,
    rw: 1398,
    amt: 2210,
  },
  {
    name: "Car Shringar Showroom",
    nrw: 2780,
    rw: 3908,
    amt: 2000,
  },
  {
    name: "Gayatri Mandir",
    nrw: 2390,
    rw: 3800,
    amt: 2500,
  }
];

const CustomBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width="100%"
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" dy={5} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="rw" barSize={40} stackId="a" fill="#82ca9d" />
        <Bar dataKey="nrw" barSize={40} stackId="a" fill="#ed8c8c" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;

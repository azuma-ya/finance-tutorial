import CustomTooltip from "@/components/custom-tooltip";
import { format } from "date-fns";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface Props {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Line
          dot={false}
          dataKey="income"
          strokeWidth={2}
          stroke="#3d82f6"
          className="drop-shadow-sm"
        />
        <Line
          dot={false}
          dataKey="expenses"
          strokeWidth={2}
          stroke="#f43f5e"
          className="drop-shadow-sm"
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineVariant;

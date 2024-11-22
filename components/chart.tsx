import AreaVariant from "@/components/area-variant";
import BarVariant from "@/components/bar-variant";
import LineVariant from "@/components/line-varinat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  BarChart,
  FileSearch,
  LineChart,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface Props {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area");

  const handleTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {chartType === "area" && <AreaVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
            {chartType === "line" && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-full lg:w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[350px] w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
};

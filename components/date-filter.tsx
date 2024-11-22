"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRange } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const DateFilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const accountId = params.get("accountId");
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-M-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  };

  const handleReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white outline-offset-0 transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto"
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 lg:w-auto" align="start">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild>
            <Button
              onClick={handleReset}
              disabled={!date?.from || !date.to}
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date.to}
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;

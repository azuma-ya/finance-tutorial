"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useGetSummary from "@/features/summary/api/use-get-summary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

const AccountFilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const accountId = params.get("accountId") ?? "all";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const { data: accounts, isLoading: isLoadingAccount } = useGetAccounts();
  const { isLoading: isLoadingSummary } = useGetSummary();

  const handleChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={handleChange}
      disabled={isLoadingAccount || isLoadingSummary}
    >
      <SelectTrigger className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white outline-offset-0 transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto">
        <SelectValue placeholder="Select accounts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All account</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountFilter;

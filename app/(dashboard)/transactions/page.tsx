"use client";

import { useState } from "react";

import { Loader2, Plus } from "lucide-react";

import { columns } from "@/app/(dashboard)/transactions/columns";
import ImportCard from "@/app/(dashboard)/transactions/import-card";
import UploadButton from "@/app/(dashboard)/transactions/upload-button";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { transactions as transactionSchema } from "@/db/schema";
import useSelectAccount from "@/features/accounts/hooks/use-select-account";
import useBulkCreateTransactions from "@/features/transactions/api/use-bulk-create";
import useBulkDeleteTransactions from "@/features/transactions/api/use-bulk-delete";
import useGetTransactions from "@/features/transactions/api/use-get-transactions";
import useNewTransaction from "@/features/transactions/hooks/use-new-transaction";
import { toast } from "sonner";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPOER",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImpoertResults] = useState(INITIAL_IMPORT_RESULTS);

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const handleUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImpoertResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const handleCancelImport = () => {
    setImpoertResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const handleSubmit = async (
    values: (typeof transactionSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        handleCancelImport();
      },
    });
  };

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[500px] w-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={handleCancelImport}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Transactions History
          </CardTitle>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="mr-2 size-4" />
              Add new
            </Button>
            <UploadButton onUpload={handleUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) =>
              deleteTransactions.mutate({ ids: row.map((r) => r.original.id) })
            }
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;

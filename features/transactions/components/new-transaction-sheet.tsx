"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import useCreateAccount from "@/features/accounts/api/use-create-account";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useCreateCategory from "@/features/categories/api/use-create-category";
import useGetCategories from "@/features/categories/api/use-get-categories";
import useCreateTransaction from "@/features/transactions/api/use-create-transaction";
import TransactionForm from "@/features/transactions/components/transaction-form";
import useNewTransaction from "@/features/transactions/hooks/use-new-transaction";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FromValues = z.input<typeof formSchema>;

const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();

  const { mutate: createTransaction, isPending: isTransactionPending } =
    useCreateTransaction();

  const categoryQuery = useGetCategories();
  const { mutate: categoryMutation, isPending: isCategoryPending } =
    useCreateCategory();

  const handleCreateCategory = (name: string) => categoryMutation({ name });

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const { mutate: accountMutation, isPending: isAccountPending } =
    useCreateAccount();

  const handleCreateAccount = (name: string) => accountMutation({ name });

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const handleSubmit = (values: FromValues) => {
    createTransaction(values, {
      onSuccess: onClose,
    });
  };

  const isPending =
    isTransactionPending || isCategoryPending || isAccountPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={handleCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={handleCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;

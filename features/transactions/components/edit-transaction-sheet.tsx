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
import useDeleteTransaction from "@/features/transactions/api/use-delete-transaction";
import useEditTransaction from "@/features/transactions/api/use-edit-transaction";
import useGetTransaction from "@/features/transactions/api/use-get-transaction";
import TransactionForm from "@/features/transactions/components/transaction-form";
import useOpenTransaction from "@/features/transactions/hooks/use-open-transaction";
import useConfirm from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FromValues = z.input<typeof formSchema>;

const EditTransactionSheet = () => {
  const [ConfimDaialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about delete this transaction",
  );
  const { id, isOpen, onClose } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const { mutate: editMutation, isPending: isEditPending } =
    useEditTransaction(id);
  const { mutate: deleteMutation, isPending: isDeletePending } =
    useDeleteTransaction(id);

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
    editMutation(values, {
      onSuccess: onClose,
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const isPending =
    isEditPending || isDeletePending || isCategoryPending || isAccountPending;

  const defaultValues = {
    accountId: transactionQuery.data?.accountId ?? "",
    categoryId: transactionQuery.data?.categoryId ?? "",
    amount: transactionQuery.data?.amount
      ? transactionQuery.data.amount.toString()
      : "",
    date: transactionQuery.data?.date
      ? new Date(transactionQuery.data.date)
      : new Date(),
    payee: transactionQuery.data?.payee ?? "",
    notes: transactionQuery.data?.notes ?? "",
  };

  return (
    <>
      <ConfimDaialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
              categoryOptions={categoryOptions}
              onCreateCategory={handleCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={handleCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;

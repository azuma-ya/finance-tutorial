"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import useDeleteAccount from "@/features/accounts/api/use-delete-account";
import useEditAccount from "@/features/accounts/api/use-edit-account";
import useGetAccount from "@/features/accounts/api/use-get-account";
import AccountForm from "@/features/accounts/components/account-form";
import useOpenAccount from "@/features/accounts/hooks/use-open-account";
import useConfirm from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FromValues = z.input<typeof formSchema>;

const EditAccountSheet = () => {
  const [ConfimDaialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about delete this transaction",
  );
  const { id, isOpen, onClose } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const { mutate: editMutation, isPending: isEditPending } = useEditAccount(id);
  const { mutate: deleteMutation, isPending: isDeletePending } =
    useDeleteAccount(id);

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

  const isLoading = accountQuery.isLoading;

  const isPending = isEditPending || isDeletePending;

  const defaultValues = { name: accountQuery.data?.name ?? "" };

  return (
    <>
      <ConfimDaialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;

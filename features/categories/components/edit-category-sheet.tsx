"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import useDeleteCategory from "@/features/categories/api/use-delete-category";
import useEditCategory from "@/features/categories/api/use-edit-category";
import useGetCategory from "@/features/categories/api/use-get-category";
import CategoryForm from "@/features/categories/components/category-form";
import useOpenCategory from "@/features/categories/hooks/use-open-category";
import useConfirm from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FromValues = z.input<typeof formSchema>;

const EditCategorySheet = () => {
  const [ConfimDaialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about delete this transaction",
  );
  const { id, isOpen, onClose } = useOpenCategory();

  const categoryQuery = useGetCategory(id);
  const { mutate: editMutation, isPending: isEditPending } =
    useEditCategory(id);
  const { mutate: deleteMutation, isPending: isDeletePending } =
    useDeleteCategory(id);

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

  const isLoading = categoryQuery.isLoading;

  const isPending = isEditPending || isDeletePending;

  const defaultValues = { name: categoryQuery.data?.name ?? "" };

  return (
    <>
      <ConfimDaialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing Category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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

export default EditCategorySheet;

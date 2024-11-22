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
import useCreateCategory from "@/features/categories/api/use-create-category";
import CategoryForm from "@/features/categories/components/category-form";
import useNewCategory from "@/features/categories/hooks/use-new-category";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FromValues = z.input<typeof formSchema>;

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (values: FromValues) => {
    createCategory(values, {
      onSuccess: onClose,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to track your transision.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          disabled={isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertCategorySchema } from "@/db/schema";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FromValues = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FromValues;
  onSubmit: (values: FromValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FromValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Travel, etc"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled} className="w-full">
          {id ? "Save changes" : "Create account"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            variant="ghost"
            className="w-full"
          >
            <Trash className="size-4 mr-2" />
            Delete category
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CategoryForm;

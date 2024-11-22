"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteCategory from "@/features/categories/api/use-delete-category";
import useOpenCategory from "@/features/categories/hooks/use-open-category";
import useConfirm from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface Props {
  id: string;
}

const Actions = ({ id }: Props) => {
  const [ConfimDaialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about delete this category",
  );
  const { onOpen } = useOpenCategory();

  const { mutate: deleteMutation } = useDeleteCategory(id);

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation();
    }
  };

  return (
    <>
      <ConfimDaialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
